from collections.abc import Generator
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import NullPool

import app.models  # noqa: F401
from app.core.config import settings
from app.db.base import Base
from app.db.session import get_db
from app.main import app


@pytest.fixture(scope="session")
def engine():
    eng = create_engine(
        settings.database_url,
        pool_pre_ping=True,
        poolclass=NullPool,
    )
    Base.metadata.create_all(bind=eng)
    yield eng
    eng.dispose()


@pytest.fixture
def db_session(engine) -> Generator[Session, None, None]:
    """DB session whose writes are rolled back after each test.

    Uses join_transaction_mode='create_savepoint' so service-level
    session.commit() only releases a savepoint and does not persist.
    """
    connection = engine.connect()
    transaction = connection.begin()
    SessionLocal = sessionmaker(
        bind=connection,
        autocommit=False,
        autoflush=False,
        expire_on_commit=False,
        join_transaction_mode="create_savepoint",
    )
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


@pytest.fixture
def client(db_session: Session) -> Generator[TestClient, None, None]:
    def _override_get_db() -> Generator[Session, None, None]:
        yield db_session

    app.dependency_overrides[get_db] = _override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def unique_slug() -> str:
    return f"acme-{uuid4().hex[:8]}"


@pytest.fixture
def company(db_session: Session, unique_slug: str):
    from app.models.company import Company

    entity = Company(name="Acme Corp", slug=unique_slug)
    db_session.add(entity)
    db_session.flush()
    db_session.refresh(entity)
    return entity


def auth_header(token: str) -> dict[str, str]:
    return {"Authorization": f"Bearer {token}"}


def register_and_login(
    client: TestClient,
    slug: str,
    *,
    email: str | None = None,
    password: str = "password123",
    full_name: str = "Recruiter User",
    company_name: str = "Acme Corp",
) -> dict:
    payload = {
        "full_name": full_name,
        "email": email or f"{slug}@example.com",
        "password": password,
        "company_name": company_name,
        "company_slug": slug,
        "primary_color": "#111111",
        "secondary_color": "#FFFFFF",
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == 201, response.text
    return response.json()
