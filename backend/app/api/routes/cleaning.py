from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.session import get_db
from app.models.vessel import Vessel
from app.models.records import CleaningEvent
from app.repositories import vessel_repo
from app.schemas.records import CleaningEventOut

router = APIRouter(prefix="/cleaning", tags=["cleaning"])


@router.get("/records", response_model=List[CleaningEventOut])
def list_cleaning_records(db: Session = Depends(get_db)):
    events = db.query(CleaningEvent).order_by(CleaningEvent.date.desc()).limit(50).all()
    return events


@router.get("/vessels/{vessel_id}", response_model=List[CleaningEventOut])
def get_vessel_cleaning_events(vessel_id: str, db: Session = Depends(get_db)):
    vessel = vessel_repo.get_vessel_by_identifier(db, vessel_id)
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found")

    return db.query(CleaningEvent).filter(CleaningEvent.vessel_id == vessel.id).order_by(CleaningEvent.date.desc()).all()
