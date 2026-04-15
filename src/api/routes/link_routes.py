from fastapi import APIRouter, Depends, Path, Request, status
from fastapi.responses import RedirectResponse

from src.api.dependencies import get_link_service
from src.schemas.link import CreateShortLinkRequest, ShortenLinkResponse
from src.services.link_service import LinkService

router = APIRouter(tags=["links"])


@router.post("/shorten", response_model=ShortenLinkResponse, status_code=status.HTTP_201_CREATED)
async def shorten_url(
    payload: CreateShortLinkRequest,
    request: Request,
    link_service: LinkService = Depends(get_link_service),
) -> ShortenLinkResponse:
    link = await link_service.create_short_link(original_url=str(payload.original_url))
    return ShortenLinkResponse(
        short_code=link.short_code,
        short_url=link_service.build_short_url(str(request.base_url), link.short_code),
        original_url=link.original_url,
        created_at=link.created_at,
    )


@router.get("/{code}", status_code=status.HTTP_307_TEMPORARY_REDIRECT)
async def redirect_to_original(
    code: str = Path(min_length=1, max_length=16, pattern=r"^[0-9A-Za-z]+$"),
    link_service: LinkService = Depends(get_link_service),
) -> RedirectResponse:
    original_url = await link_service.resolve_short_code(code)
    return RedirectResponse(url=original_url, status_code=link_service.redirect_status_code)
