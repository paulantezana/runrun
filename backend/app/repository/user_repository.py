from contextlib import AbstractContextManager
from typing import Callable

from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError
from app.model.user import User
from app.repository.base_repository import BaseRepository

class UserRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory
        super().__init__(session_factory, User)
    
    def find_by_email(self, email: str):
        with self.session_factory() as session:
            query = session.query(self.model).filter(
                self.model.email == email,
            ).first()
            
            if not query:
                raise NotFoundError(f"User with email {email} not found.")
            return query