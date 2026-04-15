from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.config import get_settings
from src.core.database import get_db_session
from src.repository.link_repository import LinkRepository
from src.services.link_service import LinkService


async def get_link_service(
    session: AsyncSession = Depends(get_db_session),
) -> LinkService:
    settings = get_settings()
    repository = LinkRepository(session)
    return LinkService(repository=repository, settings=settings)
