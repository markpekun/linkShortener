from datetime import datetime

from pydantic import AnyHttpUrl, BaseModel, ConfigDict, Field


class CreateShortLinkRequest(BaseModel):
    original_url: AnyHttpUrl = Field(description="URL to be shortened")


class ShortenLinkResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    short_code: str
    short_url: str
    original_url: str
    created_at: datetime


class ErrorResponse(BaseModel):
    detail: str
