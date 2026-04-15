import logging

from sqlalchemy.exc import IntegrityError

from src.core.config import Settings
from src.core.exceptions import LinkNotFoundError, ShortCodeGenerationError
from src.models.link import Link
from src.repository.link_repository import LinkRepository
from src.utils.short_code import generate_short_code

logger = logging.getLogger(__name__)


class LinkService:
    def __init__(self, repository: LinkRepository, settings: Settings):
        self._repository = repository
        self._settings = settings

    @property
    def redirect_status_code(self) -> int:
        return self._settings.redirect_status_code

    async def create_short_link(self, original_url: str) -> Link:
        existing_link = await self._repository.get_by_original_url(original_url)
        if existing_link is not None:
            return existing_link

        for _ in range(self._settings.short_code_max_retries):
            short_code = generate_short_code(self._settings.short_code_length)
            try:
                link = await self._repository.create_link(short_code=short_code, original_url=original_url)
            except IntegrityError as exc:
                if self._is_short_code_collision(exc):
                    continue
                raise

            return link

        raise ShortCodeGenerationError("Unable to generate unique short code")

    async def resolve_short_code(self, short_code: str) -> str:
        link = await self._repository.get_by_short_code(short_code)
        if link is None:
            raise LinkNotFoundError(f"Short code '{short_code}' not found")

        if self._settings.log_clicks:
            logger.info("Resolved redirect for short_code=%s", short_code)

        return link.original_url

    @staticmethod
    def build_short_url(base_url: str, short_code: str) -> str:
        return f"{base_url.rstrip('/')}/{short_code}"

    @staticmethod
    def _is_short_code_collision(error: IntegrityError) -> bool:
        message = str(getattr(error, "orig", error)).lower()
        return "short_code" in message or "unique" in message
