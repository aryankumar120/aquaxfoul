from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime, Text, func
from sqlalchemy.orm import relationship
from app.database.session import Base


class InspectionRecord(Base):
    __tablename__ = "inspection_records"

    id = Column(Integer, primary_key=True, index=True)
    vessel_id = Column(Integer, ForeignKey("vessels.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(String, nullable=False)
    type = Column(String, nullable=False)
    inspector = Column(String, nullable=False)
    location = Column(String, nullable=False)
    hull_rating = Column(Numeric(5, 2), nullable=False)
    propeller_condition = Column(String, nullable=False)
    findings = Column(Text, nullable=True)
    status = Column(String, default="Completed", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    vessel = relationship("Vessel", back_populates="inspections")


class FoulingAssessment(Base):
    __tablename__ = "fouling_assessments"

    id = Column(Integer, primary_key=True, index=True)
    vessel_id = Column(Integer, ForeignKey("vessels.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(String, nullable=False)
    risk_level = Column(String, nullable=False)
    fouling_coverage_pct = Column(Numeric(5, 2), nullable=False)
    roughness_microns = Column(Numeric(8, 2), nullable=False)
    speed_loss_pct = Column(Numeric(5, 2), nullable=False)
    excess_fuel_pct = Column(Numeric(5, 2), nullable=False)
    estimated_co2_penalty_tons = Column(Numeric(8, 2), nullable=False)
    assessed_by = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    vessel = relationship("Vessel", back_populates="fouling_assessments")


class CleaningEvent(Base):
    __tablename__ = "cleaning_events"

    id = Column(Integer, primary_key=True, index=True)
    vessel_id = Column(Integer, ForeignKey("vessels.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(String, nullable=False)
    location = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    method = Column(String, nullable=False)
    status = Column(String, default="Completed", nullable=False)
    before_rating = Column(Numeric(5, 2), nullable=False)
    after_rating = Column(Numeric(5, 2), nullable=False)
    efficiency_gain_pct = Column(Numeric(5, 2), nullable=False)
    cost_usd = Column(Numeric(10, 2), nullable=False)
    co2_saved_tons_est = Column(Numeric(10, 2), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    vessel = relationship("Vessel", back_populates="cleanings")


class PerformanceRecord(Base):
    __tablename__ = "performance_records"

    id = Column(Integer, primary_key=True, index=True)
    vessel_id = Column(Integer, ForeignKey("vessels.id", ondelete="CASCADE"), nullable=False, index=True)
    date = Column(String, nullable=False)
    speed_knots = Column(Numeric(5, 2), nullable=False)
    fuel_consumption_tons_per_day = Column(Numeric(8, 2), nullable=False)
    slip_ratio_pct = Column(Numeric(5, 2), nullable=False)
    weather_beaufort = Column(Integer, default=3, nullable=False)
    excess_fuel_penalty_pct = Column(Numeric(5, 2), default=0.0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    vessel = relationship("Vessel", back_populates="performance_records")
