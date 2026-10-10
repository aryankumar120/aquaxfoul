from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.session import engine, get_db, Base
from app.models.vessel import Vessel
from app.api.routes import vessels, dashboard, fouling, cleaning, projections, auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure tables are created
    Base.metadata.create_all(bind=engine)
    # Auto-seed if empty
    from app.database.session import SessionLocal
    from scripts.seed_data import seed_database
    db = SessionLocal()
    try:
        if db.query(Vessel).count() == 0:
            seed_database(db)
    except Exception as e:
        print(f"Startup seed notice: {e}")
    finally:
        db.close()
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend API services for Aqua-X-Foul Maritime Biofouling Intelligence Platform",
    lifespan=lifespan,
)

# CORS configuration for React frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoints
@app.get("/health", tags=["system"])
@app.get("/api/v1/health", tags=["system"])
def health_check():
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }


@app.get("/health/db", tags=["system"])
@app.get("/api/v1/health/db", tags=["system"])
def db_health_check(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT 1")).scalar()
    return {"status": "ok", "db_response": result}


# Versioned API router (/api/v1)
api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(auth.router)
api_v1_router.include_router(vessels.router)
api_v1_router.include_router(dashboard.router)
api_v1_router.include_router(fouling.router)
api_v1_router.include_router(cleaning.router)
api_v1_router.include_router(projections.router)

# Mount /api/v1 router
app.include_router(api_v1_router)

# Also mount routers at root for direct /vessels, /dashboard, etc. access
app.include_router(auth.router)
app.include_router(vessels.router)
app.include_router(dashboard.router)
app.include_router(fouling.router)
app.include_router(cleaning.router)
app.include_router(projections.router)