from fastapi import APIRouter, status

from app.dependencies.auth import AuthServiceDep, CurrentUserDep
from app.schemas.auth import (
    AuthMeResponse,
    LoginRequest,
    RegisterRequest,
    TokenResponse,
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(payload: RegisterRequest, service: AuthServiceDep) -> TokenResponse:
    return service.register(payload)


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, service: AuthServiceDep) -> TokenResponse:
    return service.login(payload)


@router.get("/me", response_model=AuthMeResponse)
def me(user: CurrentUserDep, service: AuthServiceDep) -> AuthMeResponse:
    return service.get_me(user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout() -> None:
    """JWT logout is client-side (discard token). Endpoint kept for API symmetry."""
    return None
