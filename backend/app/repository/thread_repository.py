from contextlib import AbstractContextManager
from typing import Callable

from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError
from app.model.thread import Thread
from app.repository.base_repository import BaseRepository


class ThreadRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory
        super().__init__(session_factory, Thread)

    def get_all_by_user(self, user_token: str):
        with self.session_factory() as session:
            query = session.query(self.model).filter(
                self.model.user_token == user_token,
            ).all()

            return query