import shutil
import tempfile
import math
from pathlib import Path
from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.vessel import Vessel
from app.models.records import InspectionRecord, FoulingAssessment, CleaningEvent, PerformanceRecord
from app.repositories import vessel_repo
from app.services import vessel_service, projection_service
from app.schemas.vessel import (
    VesselOut,
    VesselListResponse,
    VesselCreate,
    VesselUpdate,
    ImportSummary,
)
from app.schemas.records import (
    InspectionRecordOut,
    FoulingAssessmentOut,
    CleaningEventOut,
    PerformanceRecordOut,
)
from app.schemas.projections import VesselProjections

router = APIRouter(prefix="/vessels", tags=["vessels"])


@router.post("/import", response_model=ImportSummary)
async def import_excel(
    file: UploadFile = File(...),
    type_hint: Optional[str] = None,
    db: Session = Depends(get_db),
):
    if not file.filename.endswith((".xlsx", ".xls")):
        raise HTTPException(status_code=400, detail="File must be .xlsx or .xls")

    with tempfile.NamedTemporaryFile(delete=False, suffix=Path(file.filename).suffix) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = Path(tmp.name)

    try:
        summary = vessel_service.import_excel_file(db, tmp_path, type_hint=type_hint)
    finally:
        tmp_path.unlink(missing_ok=True)

    return summary


@router.get("", response_model=VesselListResponse)
def list_vessels(
    page: int = Query(1, ge=1),
    limit: int = Query(25, ge=1, le=200),
    search: Optional[str] = None,
    type: Optional[str] = None,
    ship_type: Optional[str] = None,
    category: Optional[str] = None,
    technicalManager: Optional[str] = None,
    technical_manager: Optional[str] = None,
    managerDomicile: Optional[str] = None,
    manager_domicile: Optional[str] = None,
    status: Optional[str] = None,
    foulingRisk: Optional[str] = None,
    fouling_risk: Optional[str] = None,
    flag: Optional[str] = None,
    minDwt: Optional[int] = None,
    maxDwt: Optional[int] = None,
    sortBy: Optional[str] = None,
    sort_by: Optional[str] = None,
    sortOrder: Optional[str] = None,
    sort_dir: Optional[str] = None,
    db: Session = Depends(get_db),
):
    # Normalize query parameters accepting both camelCase and snake_case
    resolved_type = type or ship_type
    resolved_manager = technicalManager or technical_manager
    resolved_domicile = managerDomicile or manager_domicile
    resolved_risk = foulingRisk or fouling_risk
    resolved_sort = sortBy or sort_by or "id"
    resolved_dir = sortOrder or sort_dir or "asc"

    results, total = vessel_repo.list_vessels(
        db,
        page=page,
        limit=limit,
        search=search,
        ship_type=resolved_type,
        category=category,
        technical_manager=resolved_manager,
        manager_domicile=resolved_domicile,
        status=status,
        fouling_risk=resolved_risk,
        flag=flag,
        min_dwt=minDwt,
        max_dwt=maxDwt,
        sort_by=resolved_sort,
        sort_dir=resolved_dir,
    )

    total_pages = max(1, math.ceil(total / limit)) if total > 0 else 1

    serialized_results = [VesselOut.model_validate(v) for v in results]

    return VesselListResponse(
        total=total,
        page=page,
        limit=limit,
        totalPages=total_pages,
        data=serialized_results,
        results=serialized_results,
    )


@router.get("/{vessel_id}", response_model=VesselOut)
def get_vessel(vessel_id: str, db: Session = Depends(get_db)):
    vessel = vessel_repo.get_vessel_by_identifier(db, vessel_id)
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found")
    return vessel


@router.post("", response_model=VesselOut, status_code=201)
def create_vessel(payload: VesselCreate, db: Session = Depends(get_db)):
    if vessel_repo.get_vessel_by_imo(db, payload.imo_number):
        raise HTTPException(status_code=409, detail="IMO number already exists")

    ship_type = vessel_repo.get_or_create_ship_type(db, payload.ship_type)
    data = payload.model_dump(exclude={"ship_type"})
    vessel = Vessel(**data, ship_type_id=ship_type.id)
    return vessel_repo.create_vessel(db, vessel)


@router.put("/{vessel_id}", response_model=VesselOut)
def update_vessel(vessel_id: str, payload: VesselUpdate, db: Session = Depends(get_db)):
    vessel = vessel_repo.get_vessel_by_identifier(db, vessel_id)
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found")

    data = payload.model_dump(exclude_unset=True)
    if "ship_type" in data:
        ship_type_name = data.pop("ship_type")
        ship_type = vessel_repo.get_or_create_ship_type(db, ship_type_name)
        vessel.ship_type_id = ship_type.id

    for key, value in data.items():
        setattr(vessel, key, value)

    return vessel_repo.update_vessel(db, vessel)


@router.delete("/{vessel_id}", status_code=204)
def delete_vessel(vessel_id: str, db: Session = Depends(get_db)):
    vessel = vessel_repo.get_vessel_by_identifier(db, vessel_id)
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found")
    vessel_repo.delete_vessel(db, vessel)


# Sub-resources for Vessel Details (Inspections, Fouling, Cleaning, Performance, Projections)

@router.get("/{vessel_id}/inspections", response_model=List[InspectionRecordOut])
def get_vessel_inspections(vessel_id: str, db: Session = Depends(get_db)):
    vessel = vessel_repo.get_vessel_by_identifier(db, vessel_id)
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found")

    records = db.query(InspectionRecord).filter(InspectionRecord.vessel_id == vessel.id).order_by(InspectionRecord.date.desc()).all()
    return records


@router.get("/{vessel_id}/fouling", response_model=List[FoulingAssessmentOut])
def get_vessel_fouling(vessel_id: str, db: Session = Depends(get_db)):
    vessel = vessel_repo.get_vessel_by_identifier(db, vessel_id)
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found")

    assessments = db.query(FoulingAssessment).filter(FoulingAssessment.vessel_id == vessel.id).order_by(FoulingAssessment.date.desc()).all()
    return assessments


@router.get("/{vessel_id}/cleaning", response_model=List[CleaningEventOut])
def get_vessel_cleaning(vessel_id: str, db: Session = Depends(get_db)):
    vessel = vessel_repo.get_vessel_by_identifier(db, vessel_id)
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found")

    events = db.query(CleaningEvent).filter(CleaningEvent.vessel_id == vessel.id).order_by(CleaningEvent.date.desc()).all()
    return events


@router.get("/{vessel_id}/performance", response_model=List[PerformanceRecordOut])
def get_vessel_performance(vessel_id: str, db: Session = Depends(get_db)):
    vessel = vessel_repo.get_vessel_by_identifier(db, vessel_id)
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found")

    metrics = db.query(PerformanceRecord).filter(PerformanceRecord.vessel_id == vessel.id).order_by(PerformanceRecord.date.desc()).all()
    return metrics


@router.get("/{vessel_id}/projections", response_model=VesselProjections)
def get_vessel_projections_route(vessel_id: str, db: Session = Depends(get_db)):
    vessel = vessel_repo.get_vessel_by_identifier(db, vessel_id)
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found")

    return projection_service.get_vessel_projections(db, vessel)