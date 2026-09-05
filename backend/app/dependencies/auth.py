from typing import Annotated
from uuid import UUID

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.exceptions import ForbiddenError, UnauthorizedError
from app.core.security import decode_access_token
from app.dependencies.database import DbSession
from app.models.user import User
from app.repositories.careers_page_repository import CareersPageRepository
from app.repositories.company_repository import CompanyRepository
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService

bearer_scheme = HTTPBearer(auto_error=False)


def get_user_repository(db: DbSession) -> UserRepository:
    return UserRepository(db)


def get_auth_service(db: DbSession) -> AuthService:
    return AuthService(
        db=db,
        user_repository=UserRepository(db),
        company_repository=CompanyRepository(db),
        careers_page_repository=CareersPageRepository(db),
    )


AuthServiceDep = Annotated[AuthService, Depends(get_auth_service)]


def get_current_user(
    db: DbSession,
    credentials: Annotated[
        HTTPAuthorizationCredentials | None,
        Depends(bearer_scheme),
    ],
    users: Annotated[UserRepository, Depends(get_user_repository)],
) -> User:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise UnauthorizedError("Not authenticated")

    payload = decode_access_token(credentials.credentials)
    try:
        user_id = UUID(str(payload["sub"]))
    except (KeyError, ValueError, TypeError) as exc:
        raise UnauthorizedError("Invalid token subject") from exc

    user = users.get_by_id(user_id)
    if user is None or not user.is_active:
        raise UnauthorizedError("User is inactive or was not found")
    return user


CurrentUserDep = Annotated[User, Depends(get_current_user)]


def get_current_company_id(user: CurrentUserDep) -> UUID:
    return user.company_id


CurrentCompanyIdDep = Annotated[UUID, Depends(get_current_company_id)]


def require_company_access(user: User, company_id: UUID) -> None:
    if user.company_id != company_id:
        raise ForbiddenError("You do not have access to this company")
