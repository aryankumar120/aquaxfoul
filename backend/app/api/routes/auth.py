from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional

from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, AuthResponse, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    if not payload.email or not payload.email.strip():
        raise HTTPException(status_code=400, detail="Email is required")

    email = payload.email.strip().lower()
    user = db.query(User).filter(User.email.ilike(email)).first()

    if not user:
        # Create user on initial login for seamless development and testing
        name = email.split("@")[0].replace(".", " ").title()
        initials = "".join([part[0].upper() for part in name.split()[:2]]) or "AK"
        user = User(
            user_uid=f"usr-{abs(hash(email)) % 100000}",
            email=email,
            name=name,
            role="Administrator",
            initials=initials,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = f"jwt-aqua-{user.id}-{int(abs(hash(user.email)))}"

    user_out = UserOut(
        id=user.user_uid,
        name=user.name,
        email=user.email,
        role=user.role,
        initials=user.initials,
    )

    return AuthResponse(token=token, user=user_out)


@router.get("/me", response_model=UserOut)
def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
):
    # Retrieve user or return default admin
    user = db.query(User).first()
    if not user:
        user = User(
            user_uid="usr-aryan",
            name="Aryan Kumar",
            email="aryan@aqua-xfoul.com",
            role="Administrator",
            initials="AK",
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return UserOut(
        id=user.user_uid,
        name=user.name,
        email=user.email,
        role=user.role,
        initials=user.initials,
    )


@router.post("/logout")
def logout():
    return {"status": "ok", "message": "Successfully logged out"}
