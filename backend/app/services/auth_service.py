from sqlalchemy.orm import Session

from app.core.exceptions import ConflictError, DomainValidationError, UnauthorizedError
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.company import Company
from app.models.user import User
from app.repositories.careers_page_repository import CareersPageRepository
from app.repositories.company_repository import CompanyRepository
from app.repositories.user_repository import UserRepository
from app.schemas.auth import (
    AuthMeResponse,
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
from app.schemas.company import CompanyResponse
from app.utils.slug import normalize_slug


class AuthService:
    """Registration, login, and current-user orchestration."""

    def __init__(
        self,
        db: Session,
        user_repository: UserRepository | None = None,
        company_repository: CompanyRepository | None = None,
        careers_page_repository: CareersPageRepository | None = None,
    ) -> None:
        self._db = db
        self._users = user_repository or UserRepository(db)
        self._companies = company_repository or CompanyRepository(db)
        self._careers_pages = careers_page_repository or CareersPageRepository(db)

    def register(self, payload: RegisterRequest) -> TokenResponse:
        email = payload.email.strip().lower()
        if self._users.get_by_email(email) is not None:
            raise ConflictError(f"Email '{email}' is already registered")

        slug = self._require_valid_slug(payload.company_slug)
        if self._companies.exists_by_slug(slug):
            raise ConflictError(f"Company slug '{slug}' is already taken")

        company = Company(
            name=payload.company_name.strip(),
            slug=slug,
            primary_color=payload.primary_color,
            secondary_color=payload.secondary_color,
            is_active=True,
        )
        company = self._companies.create_company(company)

        user = User(
            company_id=company.id,
            full_name=payload.full_name.strip(),
            email=email,
            password_hash=hash_password(payload.password),
            is_active=True,
        )
        user = self._users.create_user(user)

        self._careers_pages.create_if_missing(company.id)

        self._db.commit()
        self._db.refresh(company)
        self._db.refresh(user)

        return self._token_response(user, company)

    def login(self, payload: LoginRequest) -> TokenResponse:
        email = payload.email.strip().lower()
        user = self._users.get_by_email(email)
        if user is None or not user.is_active:
            raise UnauthorizedError("Invalid email or password")
        if not verify_password(payload.password, user.password_hash):
            raise UnauthorizedError("Invalid email or password")

        company = self._companies.get_by_id(user.company_id)
        if company is None or not company.is_active:
            raise UnauthorizedError("Company account is inactive")

        return self._token_response(user, company)

    def get_me(self, user: User) -> AuthMeResponse:
        company = self._companies.get_by_id(user.company_id)
        if company is None:
            raise UnauthorizedError("Company was not found for this user")
        return AuthMeResponse(
            user=UserResponse.model_validate(user),
            company=CompanyResponse.model_validate(company),
        )

    def _token_response(self, user: User, company: Company) -> TokenResponse:
        token = create_access_token(user_id=user.id, company_id=company.id)
        return TokenResponse(
            access_token=token,
            user=UserResponse.model_validate(user),
            company=CompanyResponse.model_validate(company),
        )

    def _require_valid_slug(self, value: str) -> str:
        slug = normalize_slug(value)
        if not slug:
            raise DomainValidationError(
                "Slug must contain at least one alphanumeric character"
            )
        if len(slug) > 100:
            raise DomainValidationError("Slug must be at most 100 characters")
        return slug
