from typing import Optional
from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: str
    password: Optional[str] = None


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: str
    initials: str
    avatarUrl: Optional[str] = None


class AuthResponse(BaseModel):
    token: str
    user: UserOut
