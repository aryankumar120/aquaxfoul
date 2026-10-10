from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Optional

import pandas as pd
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models.vessel import Vessel
from app.repositories import vessel_repo

COLUMN_MAP = {
    "imo/lr/ihs no.": "imo_number",
    "imo number": "imo_number",
    "imo": "imo_number",
    "name of ship": "name",
    "ship name": "name",
    "vessel name": "name",
    "name": "name",
    "deadweight": "deadweight",
    "dwt": "deadweight",
    "gross tonnage": "gross_tonnage",
    "gt": "gross_tonnage",
    "flag": "flag",
    "ship type": "ship_type",
    "type": "ship_type",
    "yard number": "yard_number",
    "yard no": "yard_number",
    "category": "category",
    "technical manager": "technical_manager",
    "manager": "technical_manager",
    "manager domicile": "manager_domicile",
    "manager registration": "manager_registration",
    "teu": "teu",
    "teu 14": "teu_14",
    "teu14": "teu_14",
    "built year": "built_year",
    "year built": "built_year",
    "length": "length",
    "length bp": "length_bp",
    "breadth": "breadth",
    "breadth moulded": "breadth_moulded",
    "engines rpm": "engine_rpm",
    "engine rpm": "engine_rpm",
    "depth": "depth",
    "draught": "draught",
    "draft": "draught",
    "service speed": "service_speed",
    "speed": "service_speed",
    "status": "status",
    "fouling risk": "fouling_risk",
    "fouling rating": "fouling_rating",
}


def normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
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


def ingest_dataframe(
    db: Session,
    df: pd.DataFrame,
    default_type_name: str,
    seen_imos: dict,
    summary: dict,
):
    """Core ingestion logic shared by CLI script and API upload route."""
    df = normalize_columns(df)

    for idx, row in df.iterrows():
        row_dict = row.to_dict()
        imo = to_int(row_dict.get("imo_number"))
        name = row_dict.get("name")

        if imo is None or pd.isna(name) or str(name).strip() == "":
            summary["invalid_rows"] += 1
            summary["invalid_details"].append({
                "row": idx + 2,
                "reason": "Missing IMO or Name",
                "raw": {k: str(v) for k, v in row_dict.items()},
            })
            continue

        ship_type_name = (
            str(row_dict.get("ship_type")).strip()
            if row_dict.get("ship_type") and not pd.isna(row_dict.get("ship_type"))
            else default_type_name
        )

        clean_row = {
            "imo_number": imo,
            "name": str(name).strip(),
            "yard_number": str(row_dict.get("yard_number")).strip() if row_dict.get("yard_number") and not pd.isna(row_dict.get("yard_number")) else None,
            "category": str(row_dict.get("category")).strip() if row_dict.get("category") and not pd.isna(row_dict.get("category")) else None,
            "technical_manager": str(row_dict.get("technical_manager")).strip() if row_dict.get("technical_manager") and not pd.isna(row_dict.get("technical_manager")) else None,
            "manager_domicile": str(row_dict.get("manager_domicile")).strip() if row_dict.get("manager_domicile") and not pd.isna(row_dict.get("manager_domicile")) else None,
            "manager_registration": str(row_dict.get("manager_registration")).strip() if row_dict.get("manager_registration") and not pd.isna(row_dict.get("manager_registration")) else None,
            "deadweight": to_int(row_dict.get("deadweight")),
            "gross_tonnage": to_int(row_dict.get("gross_tonnage")),
            "teu": to_int(row_dict.get("teu")),
            "teu_14": to_int(row_dict.get("teu_14")),
            "flag": str(row_dict.get("flag")).strip() if row_dict.get("flag") and not pd.isna(row_dict.get("flag")) else None,
            "built_year": to_int(row_dict.get("built_year")),
            "ship_type": ship_type_name,
            "length": to_decimal(row_dict.get("length")),
            "length_bp": to_decimal(row_dict.get("length_bp")),
            "breadth": to_decimal(row_dict.get("breadth")),
            "breadth_moulded": to_decimal(row_dict.get("breadth_moulded")),
            "engine_rpm": to_decimal(row_dict.get("engine_rpm")),
            "depth": to_decimal(row_dict.get("depth")),
            "draught": to_decimal(row_dict.get("draught")),
            "service_speed": to_decimal(row_dict.get("service_speed")),
            "status": str(row_dict.get("status")).strip() if row_dict.get("status") and not pd.isna(row_dict.get("status")) else "Active",
            "fouling_risk": str(row_dict.get("fouling_risk")).strip() if row_dict.get("fouling_risk") and not pd.isna(row_dict.get("fouling_risk")) else "Low",
            "fouling_rating": to_decimal(row_dict.get("fouling_rating")) or Decimal("8.5"),
        }

        if imo in seen_imos:
            summary["duplicates_found"] += 1
            summary["duplicate_details"].append({
                "imo": imo,
                "original": seen_imos[imo],
                "duplicate": clean_row,
            })
            continue

        existing = vessel_repo.get_vessel_by_imo(db, imo)
        if existing:
            summary["duplicates_found"] += 1
            summary["duplicate_details"].append({
                "imo": imo,
                "original": {"name": existing.name, "source": "already in database"},
                "duplicate": clean_row,
            })
            seen_imos[imo] = clean_row
            continue

        ship_type = vessel_repo.get_or_create_ship_type(db, ship_type_name)

        vessel = Vessel(
            imo_number=clean_row["imo_number"],
            name=clean_row["name"],
            yard_number=clean_row["yard_number"],
            category=clean_row["category"],
            technical_manager=clean_row["technical_manager"],
            manager_domicile=clean_row["manager_domicile"],
            manager_registration=clean_row["manager_registration"],
            deadweight=clean_row["deadweight"],
            gross_tonnage=clean_row["gross_tonnage"],
            teu=clean_row["teu"],
            teu_14=clean_row["teu_14"],
            flag=clean_row["flag"],
            built_year=clean_row["built_year"],
            ship_type_id=ship_type.id,
            length=clean_row["length"],
            length_bp=clean_row["length_bp"],
            breadth=clean_row["breadth"],
            breadth_moulded=clean_row["breadth_moulded"],
            engine_rpm=clean_row["engine_rpm"],
            depth=clean_row["depth"],
            draught=clean_row["draught"],
            service_speed=clean_row["service_speed"],
            status=clean_row["status"],
            fouling_risk=clean_row["fouling_risk"],
            fouling_rating=clean_row["fouling_rating"],
        )
        db.add(vessel)
        seen_imos[imo] = clean_row
        summary["inserted"] += 1

    db.commit()


def find_header_row(file_path: Path, max_scan_rows: int = 10) -> int:
    preview = pd.read_excel(file_path, header=None, nrows=max_scan_rows)
    known_keys = set(COLUMN_MAP.keys())

    for i in range(len(preview)):
        row_values = [str(v).strip().lower() for v in preview.iloc[i].tolist()]
        if any(v in known_keys for v in row_values):
            return i

    return 0


def import_excel_file(db: Session, file_path: Path, type_hint: Optional[str] = None) -> dict:
    """Used by the API upload route: ingest a single uploaded excel file."""
    try:
        header_row = find_header_row(file_path)
        df = pd.read_excel(file_path, header=header_row)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read Excel file: {e}")

    default_type_name = type_hint or file_path.stem.replace("_", " ").replace("-", " ").strip()

    raw_summary = {
        "files_processed": 1,
        "inserted": 0,
        "duplicates_found": 0,
        "invalid_rows": 0,
        "duplicate_details": [],
        "invalid_details": [],
    }
    seen_imos = {}
    ingest_dataframe(db, df, default_type_name, seen_imos, raw_summary)

    # Return structure matching both PDF specs and schema
    return {
        "records_processed": raw_summary["inserted"] + raw_summary["duplicates_found"] + raw_summary["invalid_rows"],
        "new_vessels": raw_summary["inserted"],
        "updated_vessels": 0,
        "duplicates_detected": raw_summary["duplicates_found"],
        "invalid_records": raw_summary["invalid_rows"],
        "files_processed": 1,
        "status": "Import completed",
        "duplicate_details": raw_summary["duplicate_details"],
        "invalid_details": raw_summary["invalid_details"],
    }