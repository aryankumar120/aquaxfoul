"""
Aqua-X-Foul Excel Ingestion Script
----------------------------------
Reads ALL .xlsx files from a given folder, regardless of how many files
or how many ship types are present. For each row:

  - If the IMO number has not been seen before -> insert as new vessel
    (creating the ShipType if it doesn't exist yet).
  - If the IMO number has already been seen (in this run or already in
    the DB) -> SKIP the insert, but print full details of both the
    original and the duplicate to the console.

Usage:
    python scripts/import_excel.py --folder ./data/excels --sheet-type-column "Ship Type"

If your files do NOT have a "Ship Type" column and instead the type is
implied by the filename (e.g. "BulkCarrier_2024.xlsx"), use:
    python scripts/import_excel.py --folder ./data/excels --type-from-filename
"""

import argparse
import sys
from pathlib import Path
from decimal import Decimal, InvalidOperation

import pandas as pd
from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.models.vessel import ShipType, Vessel

# Expected column names in the Excel files (case-insensitive match attempted)
COLUMN_MAP = {
    "imo/lr/ihs no.": "imo_number",
    "imo number": "imo_number",
    "name of ship": "name",
    "deadweight": "deadweight",
    "flag": "flag",
    "ship type": "ship_type",
    "length": "length",
    "length bp": "length_bp",
    "breadth": "breadth",
    "breadth moulded": "breadth_moulded",
    "engines rpm": "engine_rpm",
    "depth": "depth",
    "draught": "draught",
    "service speed": "service_speed",
}

REQUIRED_FIELDS = ["imo_number", "name"]


def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Map messy excel headers to clean internal names."""
    new_cols = {}
    for col in df.columns:
        key = str(col).strip().lower()
        new_cols[col] = COLUMN_MAP.get(key, col)
    return df.rename(columns=new_cols)


def to_decimal(value):
    if pd.isna(value):
        return None
    try:
        return Decimal(str(value))
    except (InvalidOperation, ValueError):
        return None


def to_int(value):
    if pd.isna(value):
        return None
    try:
        return int(float(value))
    except (ValueError, TypeError):
        return None


def get_or_create_ship_type(db: Session, name: str, cache: dict) -> ShipType:
    name = name.strip()
    if name in cache:
        return cache[name]

    ship_type = db.query(ShipType).filter(ShipType.name.ilike(name)).first()
    if not ship_type:
        ship_type = ShipType(name=name)
        db.add(ship_type)
        db.flush()  # get ID without full commit
        print(f"  [NEW SHIP TYPE DISCOVERED] '{name}' added to ship_types table")

    cache[name] = ship_type
    return ship_type


def print_vessel_details(row: dict, label: str):
    print(f"    {label}: IMO={row.get('imo_number')} | Name={row.get('name')} | "
          f"Type={row.get('ship_type')} | DWT={row.get('deadweight')} | Flag={row.get('flag')}")


def process_file(filepath: Path, db: Session, ship_type_cache: dict,
                  seen_imos: dict, type_from_filename: bool,
                  summary: dict):
    print(f"\nProcessing file: {filepath.name}")

    try:
        df = pd.read_excel(filepath)
    except Exception as e:
        print(f"  [ERROR] Could not read file: {e}")
        summary["files_failed"].append(str(filepath))
        return

    df = normalize_columns(df)

    # Determine ship type source
    inferred_type_from_name = filepath.stem.replace("_", " ").replace("-", " ").strip()

    if "ship_type" not in df.columns and not type_from_filename:
        print(f"  [WARNING] No 'Ship Type' column found and --type-from-filename not set.")
        print(f"  Falling back to filename as ship type: '{inferred_type_from_name}'")

    for idx, row in df.iterrows():
        row_dict = row.to_dict()

        imo = to_int(row_dict.get("imo_number"))
        name = row_dict.get("name")

        # --- Validation ---
        if imo is None or pd.isna(name) or str(name).strip() == "":
            summary["invalid_rows"] += 1
            print(f"  [INVALID ROW #{idx+2}] Missing IMO or Name -> skipped. Raw: {row_dict}")
            continue

        ship_type_name = (
            str(row_dict.get("ship_type")).strip()
            if row_dict.get("ship_type") and not pd.isna(row_dict.get("ship_type"))
            else inferred_type_from_name
        )

        clean_row = {
            "imo_number": imo,
            "name": str(name).strip(),
            "deadweight": to_int(row_dict.get("deadweight")),
            "flag": str(row_dict.get("flag")).strip() if row_dict.get("flag") and not pd.isna(row_dict.get("flag")) else None,
            "ship_type": ship_type_name,
            "length": to_decimal(row_dict.get("length")),
            "length_bp": to_decimal(row_dict.get("length_bp")),
            "breadth": to_decimal(row_dict.get("breadth")),
            "breadth_moulded": to_decimal(row_dict.get("breadth_moulded")),
            "engine_rpm": to_decimal(row_dict.get("engine_rpm")),
            "depth": to_decimal(row_dict.get("depth")),
            "draught": to_decimal(row_dict.get("draught")),
            "service_speed": to_decimal(row_dict.get("service_speed")),
            "_source_file": filepath.name,
            "_row_number": idx + 2,  # +2 accounts for header row + 0-index
        }

        # --- Duplicate check (in-memory, across ALL files this run) ---
        if imo in seen_imos:
            summary["duplicates_found"] += 1
            print(f"\n  [DUPLICATE IMO FOUND] IMO {imo} already processed. Skipping this entry.")
            print_vessel_details(seen_imos[imo], "ORIGINAL (kept)")
            print_vessel_details(clean_row, "DUPLICATE (skipped)")
            continue

        # --- Duplicate check (already in DB from a previous run) ---
        existing = db.query(Vessel).filter(Vessel.imo_number == imo).first()
        if existing:
            summary["duplicates_found"] += 1
            print(f"\n  [DUPLICATE IMO FOUND] IMO {imo} already exists in database. Skipping this entry.")
            print(f"    ORIGINAL (in DB): IMO={existing.imo_number} | Name={existing.name}")
            print_vessel_details(clean_row, "DUPLICATE (skipped)")
            seen_imos[imo] = clean_row  # remember so repeated dupes in this run also get logged
            continue

        # --- Insert ---
        ship_type = get_or_create_ship_type(db, ship_type_name, ship_type_cache)

        vessel = Vessel(
            imo_number=clean_row["imo_number"],
            name=clean_row["name"],
            deadweight=clean_row["deadweight"],
            flag=clean_row["flag"],
            ship_type_id=ship_type.id,
            length=clean_row["length"],
            length_bp=clean_row["length_bp"],
            breadth=clean_row["breadth"],
            breadth_moulded=clean_row["breadth_moulded"],
            engine_rpm=clean_row["engine_rpm"],
            depth=clean_row["depth"],
            draught=clean_row["draught"],
            service_speed=clean_row["service_speed"],
        )
        db.add(vessel)
        seen_imos[imo] = clean_row
        summary["inserted"] += 1

    db.commit()
    summary["files_processed"] += 1


def main():
    parser = argparse.ArgumentParser(description="Import vessel Excel files into PostgreSQL")
    parser.add_argument("--folder", required=True, help="Folder containing .xlsx files")
    parser.add_argument("--type-from-filename", action="store_true",
                         help="Infer ship type from filename instead of a 'Ship Type' column")
    args = parser.parse_args()

    folder = Path(args.folder)
    if not folder.exists() or not folder.is_dir():
        print(f"[ERROR] Folder not found: {folder}")
        sys.exit(1)

    excel_files = sorted(folder.glob("*.xlsx"))
    if not excel_files:
        print(f"[ERROR] No .xlsx files found in {folder}")
        sys.exit(1)

    print(f"Found {len(excel_files)} Excel file(s) to process.")

    db = SessionLocal()
    ship_type_cache = {}
    seen_imos = {}
    summary = {
        "files_processed": 0,
        "files_failed": [],
        "inserted": 0,
        "duplicates_found": 0,
        "invalid_rows": 0,
    }

    try:
        for filepath in excel_files:
            process_file(filepath, db, ship_type_cache, seen_imos,
                         args.type_from_filename, summary)
    finally:
        db.close()

    print("\n" + "=" * 50)
    print("IMPORT SUMMARY")
    print("=" * 50)
    print(f"Files processed:     {summary['files_processed']} / {len(excel_files)}")
    print(f"Files failed:        {len(summary['files_failed'])}")
    if summary["files_failed"]:
        for f in summary["files_failed"]:
            print(f"    - {f}")
    print(f"Vessels inserted:    {summary['inserted']}")
    print(f"Duplicates skipped:  {summary['duplicates_found']}")
    print(f"Invalid rows skipped:{summary['invalid_rows']}")
    print("Status: Import completed")


if __name__ == "__main__":
    main()