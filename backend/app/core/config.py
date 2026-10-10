from typing import List
from pydantic import ConfigDict
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    model_config = ConfigDict(extra="allow", env_file=".env")

    APP_NAME: str = "Aqua-X-Foul Maritime Intelligence Platform"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    DATABASE_URL: str = "postgresql://aquaxfoul_user:aquaxfoul_dev@localhost:5432/aquaxfoul"
    SECRET_KEY: str = "aqua-xfoul-secret-key-2026-production-ready"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "*",
    ]


settings = Settings()