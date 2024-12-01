from contextlib import AbstractContextManager
from typing import Callable

from sqlalchemy.orm import Session

from app.model.message import Message
from app.repository.base_repository import BaseRepository


class MessageRepository(BaseRepository):
    def __init__(self, session_factory: Callable[..., AbstractContextManager[Session]]):
        self.session_factory = session_factory
        super().__init__(session_factory, Message)

    def get_all_by_thread_id(self, thread_id: int):
        with self.session_factory() as session:
            query = session.query(self.model).filter(
                self.model.thread_id == thread_id,
            ).all()

            return query