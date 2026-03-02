"""Application configuration"""

from typing import List
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )

    # Application
    app_name: str = "Sotoplace"
    app_version: str = "0.1.0"
    debug: bool = False
    environment: str = "production"

    # Server
    host: str = "0.0.0.0"
    port: int = 8000

    # Database
    database_url: str = Field(..., description="PostgreSQL connection URL")
    database_pool_size: int = 20
    database_max_overflow: int = 10

    # Redis
    redis_url: str = Field(..., description="Redis connection URL")

    # Security
    secret_key: str = Field(..., description="Secret key for JWT")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    # CORS
    cors_origins: List[str] = ["http://localhost:3000"]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v

    # File Storage
    storage_type: str = "local"  # local, s3, minio
    storage_path: str = "./uploads"
    max_upload_size: int = 104857600  # 100MB

    # S3/MinIO
    s3_endpoint_url: str | None = None
    s3_access_key: str | None = None
    s3_secret_key: str | None = None
    s3_bucket_name: str = "sotoplace"
    s3_region: str = "us-east-1"

    # Email
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_user: str | None = None
    smtp_password: str | None = None
    smtp_from_email: str = "noreply@sotoplace.com"
    smtp_from_name: str = "Sotoplace"

    # Celery
    celery_broker_url: str | None = None
    celery_result_backend: str | None = None

    # Monitoring
    sentry_dsn: str | None = None

    # Logging
    log_level: str = "INFO"

    @property
    def async_database_url(self) -> str:
        """Get async database URL"""
        return self.database_url.replace("postgresql://", "postgresql+asyncpg://")


# Global settings instance
settings = Settings()
