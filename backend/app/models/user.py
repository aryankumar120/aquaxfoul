from sqlalchemy import Column, Integer, String, DateTime, func
from app.database.session import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    user_uid = Column(String, unique=True, index=True, default="usr-1")
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="Administrator", nullable=False)
    initials = Column(String, default="AK", nullable=False)
    hashed_password = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
