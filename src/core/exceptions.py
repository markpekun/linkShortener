class LinkNotFoundError(Exception):
    """Raised when short code does not exist."""


class ShortCodeGenerationError(Exception):
    """Raised when service cannot generate a unique short code."""
