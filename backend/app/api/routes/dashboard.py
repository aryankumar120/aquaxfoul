from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services import dashboard_service
from app.schemas.dashboard import DashboardSummary

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(db: Session = Depends(get_db)):
    return dashboard_service.get_dashboard_summary(db)
