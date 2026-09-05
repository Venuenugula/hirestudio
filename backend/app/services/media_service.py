from pathlib import Path
from uuid import UUID, uuid4

from fastapi import UploadFile

from app.core.config import settings
from app.core.exceptions import DomainValidationError

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
}
MAX_UPLOAD_BYTES = 2 * 1024 * 1024  # 2 MB
MEDIA_KINDS = {"logo", "banner"}


class MediaService:
    """Store company brand assets on local disk (MVP)."""

    def save_company_image(
        self,
        *,
        company_id: UUID,
        kind: str,
        upload: UploadFile,
    ) -> str:
        if kind not in MEDIA_KINDS:
            raise DomainValidationError("Media kind must be 'logo' or 'banner'")

        content_type = (upload.content_type or "").lower()
        extension = ALLOWED_IMAGE_TYPES.get(content_type)
        if extension is None:
            raise DomainValidationError(
                "Upload a JPEG, PNG, WebP, or GIF image (max 2 MB)"
            )

        data = upload.file.read(MAX_UPLOAD_BYTES + 1)
        if not data:
            raise DomainValidationError("Uploaded file is empty")
        if len(data) > MAX_UPLOAD_BYTES:
            raise DomainValidationError("Image must be 2 MB or smaller")

        company_dir = Path(settings.upload_dir) / "companies" / str(company_id)
        company_dir.mkdir(parents=True, exist_ok=True)

        filename = f"{kind}-{uuid4().hex}{extension}"
        destination = company_dir / filename
        destination.write_bytes(data)

        # Public path served by StaticFiles at /uploads
        return f"/uploads/companies/{company_id}/{filename}"
