from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.repositories import vessel_repo
from app.services import projection_service
from app.schemas.projections import VesselProjections

router = APIRouter(prefix="/projections", tags=["projections"])


@router.get("/{vessel_id}", response_model=VesselProjections)
def get_projections_for_vessel(vessel_id: str, db: Session = Depends(get_db)):
    vessel = vessel_repo.get_vessel_by_identifier(db, vessel_id)
    if not vessel:
        # If no specific vessel found, return fallback projection for default vessel
        vessel = db.query(vessel_repo.Vessel).first()
        if not vessel:
            raise HTTPException(status_code=404, detail="No vessels available for projection")

    return projection_service.get_vessel_projections(db, vessel)
