from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime, func, Text
from sqlalchemy.orm import relationship
from app.database.session import Base


class ShipType(Base):
    __tablename__ = "ship_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)

    vessels = relationship("Vessel", back_populates="ship_type")


class Vessel(Base):
    __tablename__ = "vessels"

    id = Column(Integer, primary_key=True, index=True)
    imo_number = Column(Integer, unique=True, nullable=False, index=True)
    name = Column(String, nullable=False, index=True)
    yard_number = Column(String, nullable=True)
    category = Column(String, nullable=True)
    technical_manager = Column(String, nullable=True, index=True)
    manager_domicile = Column(String, nullable=True)
    manager_registration = Column(String, nullable=True)
    deadweight = Column(Integer, nullable=True)
    gross_tonnage = Column(Integer, nullable=True)
    teu = Column(Integer, nullable=True)
    teu_14 = Column(Integer, nullable=True)
    flag = Column(String, nullable=True)
    built_year = Column(Integer, nullable=True)

    ship_type_id = Column(Integer, ForeignKey("ship_types.id"), nullable=False)
    ship_type = relationship("ShipType", back_populates="vessels")

    length = Column(Numeric(8, 2), nullable=True)
    length_bp = Column(Numeric(8, 2), nullable=True)
    breadth = Column(Numeric(8, 2), nullable=True)
    breadth_moulded = Column(Numeric(8, 2), nullable=True)
    depth = Column(Numeric(8, 2), nullable=True)
    draught = Column(Numeric(8, 2), nullable=True)
    engine_rpm = Column(Numeric(8, 2), nullable=True)
    service_speed = Column(Numeric(8, 2), nullable=True)
    speed_knots = Column(Numeric(8, 2), nullable=True)
    fuel_consumption_tons_per_day = Column(Numeric(8, 2), nullable=True)

    status = Column(String, default="Active", nullable=False)
    fouling_risk = Column(String, default="Low", nullable=False)
    fouling_rating = Column(Numeric(5, 2), default=0.0, nullable=False)
    last_inspection_date = Column(String, nullable=True)
    next_cleaning_due_date = Column(String, nullable=True)
    current_route = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    inspections = relationship("InspectionRecord", back_populates="vessel", cascade="all, delete-orphan")
    fouling_assessments = relationship("FoulingAssessment", back_populates="vessel", cascade="all, delete-orphan")
    cleanings = relationship("CleaningEvent", back_populates="vessel", cascade="all, delete-orphan")
    performance_records = relationship("PerformanceRecord", back_populates="vessel", cascade="all, delete-orphan")