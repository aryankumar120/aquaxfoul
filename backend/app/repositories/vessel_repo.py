from typing import Optional, Tuple, List
from sqlalchemy import or_, desc, asc, String, cast
from sqlalchemy.orm import Session, joinedload

from app.models.vessel import Vessel, ShipType


def get_vessel_by_id(db: Session, vessel_id: int) -> Optional[Vessel]:
    return (
        db.query(Vessel)
        .options(joinedload(Vessel.ship_type))
        .filter(Vessel.id == vessel_id)
        .first()
    )


def get_vessel_by_identifier(db: Session, identifier: str) -> Optional[Vessel]:
    """Resolve vessel by numeric ID, IMO, or 'v-{imo}' slug."""
    clean_id = identifier.replace("v-", "").strip()
    if clean_id.isdigit():
        num_val = int(clean_id)
        # Try finding by IMO first, then by primary key ID
        vessel = db.query(Vessel).options(joinedload(Vessel.ship_type)).filter(Vessel.imo_number == num_val).first()
        if vessel:
            return vessel
        return db.query(Vessel).options(joinedload(Vessel.ship_type)).filter(Vessel.id == num_val).first()
    # Try finding by name
    return db.query(Vessel).options(joinedload(Vessel.ship_type)).filter(Vessel.name.ilike(identifier)).first()


def get_vessel_by_imo(db: Session, imo_number: int) -> Optional[Vessel]:
    return (
        db.query(Vessel)
        .options(joinedload(Vessel.ship_type))
        .filter(Vessel.imo_number == imo_number)
        .first()
    )


def list_vessels(
    db: Session,
    page: int = 1,
    limit: int = 25,
    search: Optional[str] = None,
    ship_type: Optional[str] = None,
    category: Optional[str] = None,
    technical_manager: Optional[str] = None,
    manager_domicile: Optional[str] = None,
    status: Optional[str] = None,
    fouling_risk: Optional[str] = None,
    flag: Optional[str] = None,
    min_dwt: Optional[int] = None,
    max_dwt: Optional[int] = None,
    sort_by: str = "id",
    sort_dir: str = "asc",
) -> Tuple[List[Vessel], int]:
    query = db.query(Vessel).options(joinedload(Vessel.ship_type))

    # Global search across vessel name, IMO number, technical manager, yard number
    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Vessel.name.ilike(term),
                cast(Vessel.imo_number, String).ilike(term),
                Vessel.technical_manager.ilike(term),
                Vessel.yard_number.ilike(term),
            )
        )

    # Filter by ship type
    if ship_type and ship_type != "All":
        query = query.join(ShipType).filter(ShipType.name.ilike(ship_type))

    # Filter by category
    if category and category != "All":
        query = query.filter(Vessel.category.ilike(category))

    # Filter by technical manager
    if technical_manager and technical_manager != "All":
        query = query.filter(Vessel.technical_manager.ilike(technical_manager))

    # Filter by manager domicile
    if manager_domicile and manager_domicile != "All":
        query = query.filter(Vessel.manager_domicile.ilike(manager_domicile))

    # Filter by status
    if status and status != "All":
        query = query.filter(Vessel.status.ilike(status))

    # Filter by fouling risk
    if fouling_risk and fouling_risk != "All":
        query = query.filter(Vessel.fouling_risk.ilike(fouling_risk))

    # Filter by flag
    if flag and flag != "All":
        query = query.filter(Vessel.flag.ilike(flag))

    # Filter by DWT range
    if min_dwt is not None:
        query = query.filter(Vessel.deadweight >= min_dwt)
    if max_dwt is not None:
        query = query.filter(Vessel.deadweight <= max_dwt)

    total = query.count()

    # Column sorting mapping
    sort_col_map = {
        "id": Vessel.id,
        "name": Vessel.name,
        "imo": Vessel.imo_number,
        "imo_number": Vessel.imo_number,
        "dwt": Vessel.deadweight,
        "deadweight": Vessel.deadweight,
        "gt": Vessel.gross_tonnage,
        "builtYear": Vessel.built_year,
        "built_year": Vessel.built_year,
        "foulingRating": Vessel.fouling_rating,
        "fouling_rating": Vessel.fouling_rating,
        "status": Vessel.status,
    }

    col = sort_col_map.get(sort_by, Vessel.id)
    if sort_dir.lower() == "desc":
        query = query.order_by(desc(col))
    else:
        query = query.order_by(asc(col))

    offset = max(0, (page - 1) * limit)
    results = query.offset(offset).limit(limit).all()

    return results, total


def get_or_create_ship_type(db: Session, name: str) -> ShipType:
    clean_name = name.strip()
    ship_type = db.query(ShipType).filter(ShipType.name.ilike(clean_name)).first()
    if not ship_type:
        ship_type = ShipType(name=clean_name)
        db.add(ship_type)
        db.flush()
    return ship_type


def create_vessel(db: Session, vessel: Vessel) -> Vessel:
    db.add(vessel)
    db.commit()
    db.refresh(vessel)
    return vessel


def update_vessel(db: Session, vessel: Vessel) -> Vessel:
    db.commit()
    db.refresh(vessel)
    return vessel


def delete_vessel(db: Session, vessel: Vessel) -> None:
    db.delete(vessel)
    db.commit()