from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.session import get_db
from app.models.vessel import Vessel
from app.models.records import FoulingAssessment
from app.repositories import vessel_repo
from app.schemas.records import FoulingAssessmentOut

router = APIRouter(prefix="/fouling", tags=["fouling"])


@router.get("/overview")
def get_fouling_overview(db: Session = Depends(get_db)):
    total = db.query(Vessel).count() or 0
    high_critical = db.query(Vessel).filter(Vessel.fouling_risk.in_(["High", "Critical"])).count() or 0
    avg_fouling = db.query(func.avg(Vessel.fouling_rating)).scalar() or 0.0

    return {
        "total_monitored_vessels": total,
        "high_critical_risk_count": high_critical,
        "fleet_average_fouling_pct": round(float(avg_fouling), 1),
        "fleet_health_status": "Good" if high_critical < 5 else "Requires Attention",
    }


@router.get("/vessels/{vessel_id}", response_model=List[FoulingAssessmentOut])
def get_fouling_for_vessel(vessel_id: str, db: Session = Depends(get_db)):
    vessel = vessel_repo.get_vessel_by_identifier(db, vessel_id)
    if not vessel:
        raise HTTPException(status_code=404, detail="Vessel not found")

    return db.query(FoulingAssessment).filter(FoulingAssessment.vessel_id == vessel.id).order_by(FoulingAssessment.date.desc()).all()
