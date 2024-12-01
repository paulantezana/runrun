from app.repository.thread_repository import ThreadRepository
from app.services.base_service import BaseService


class ThreadService(BaseService):
    def __init__(self, thread_repository: ThreadRepository):
        self.thread_repository = thread_repository
        super().__init__(thread_repository)

    def get_all_by_user(self, user_token: str):
        data = self.thread_repository.get_all_by_user(user_token)
        return data
