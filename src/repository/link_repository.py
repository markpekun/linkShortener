from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.link import Link


class LinkRepository:
    def __init__(self, session: AsyncSession):
        self._session = session

    async def get_by_short_code(self, short_code: str) -> Link | None:
        stmt = select(Link).where(Link.short_code == short_code).limit(1)
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_original_url(self, original_url: str) -> Link | None:
        stmt = (
            select(Link)
            .where(Link.original_url == original_url)
            .order_by(Link.created_at.asc())
            .limit(1)
        )
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none()

    async def create_link(self, short_code: str, original_url: str) -> Link:
        link = Link(short_code=short_code, original_url=original_url, expires_at=None)
        self._session.add(link)
        try:
            await self._session.commit()
        except Exception:
            await self._session.rollback()
            raise
        await self._session.refresh(link)
        return link
