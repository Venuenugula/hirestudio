from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User


class UserRepository:
    """Database access for User. No business rules live here."""

    def __init__(self, db: Session) -> None:
        self._db = db

    def create_user(self, user: User) -> User:
        self._db.add(user)
        self._db.flush()
        self._db.refresh(user)
        return user

    def get_by_id(self, user_id: UUID) -> User | None:
        return self._db.get(User, user_id)

    def get_by_email(self, email: str) -> User | None:
        statement = select(User).where(User.email == email)
        return self._db.scalars(statement).first()

    def get_by_company_id(self, company_id: UUID) -> User | None:
        statement = select(User).where(User.company_id == company_id)
        return self._db.scalars(statement).first()
