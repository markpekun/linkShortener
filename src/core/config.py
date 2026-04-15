from functools import lru_cache
from typing import Any

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = Field(default="Link Shortener", validation_alias="APP_NAME")
    app_host: str = Field(default="0.0.0.0", validation_alias="APP_HOST")
    app_port: int = Field(default=8000, validation_alias="APP_PORT", ge=1, le=65535)
    app_reload: bool = Field(default=False, validation_alias="APP_RELOAD")

    database_url: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/link_shortener",
        validation_alias="DATABASE_URL",
    )
    db_pool_size: int = Field(default=20, validation_alias="DB_POOL_SIZE", ge=1)
    db_max_overflow: int = Field(default=20, validation_alias="DB_MAX_OVERFLOW", ge=0)
    db_pool_timeout: int = Field(default=30, validation_alias="DB_POOL_TIMEOUT", ge=1)

    short_code_length: int = Field(default=7, validation_alias="SHORT_CODE_LENGTH", ge=4, le=16)
    short_code_max_retries: int = Field(default=8, validation_alias="SHORT_CODE_MAX_RETRIES", ge=1)

    redirect_status_code: int = Field(default=307, validation_alias="REDIRECT_STATUS_CODE")
    log_clicks: bool = Field(default=True, validation_alias="LOG_CLICKS")

    @field_validator("redirect_status_code", mode="before")
    @classmethod
    def validate_redirect_status_code(cls, value: Any) -> int:
        if isinstance(value, str):
            value = value.strip()
            if not value:
                raise ValueError("REDIRECT_STATUS_CODE must be 302 or 307")

        try:
            status_code = int(value)
        except (TypeError, ValueError) as exc:
            raise ValueError("REDIRECT_STATUS_CODE must be 302 or 307") from exc

        if status_code not in (302, 307):
            raise ValueError("REDIRECT_STATUS_CODE must be 302 or 307")

        return status_code

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
