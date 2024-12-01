from dependency_injector.wiring import Provide
from fastapi import APIRouter, Depends

from app.core.container import Container
from app.core.dependencies import get_current_active_user
from app.core.middleware import inject
from app.model.user import User
from app.schema.thread_schema import Thread, UpsertThread
from app.services.thread_service import ThreadService

router = APIRouter(
    prefix="/thread",
    tags=["thread"],
)

@router.get("")
@inject
def get_thread_list(
    service: ThreadService = Depends(Provide[Container.thread_service]),
    current_user: User = Depends(get_current_active_user),
):
    return service.get_all_by_user(current_user.user_token)


@router.post("", response_model=Thread)
@inject
def create_thread(
    thread: UpsertThread,
    service: ThreadService = Depends(Provide[Container.thread_service]),
    current_user: User = Depends(get_current_active_user),
):
    thread.user_token = current_user.user_token
    return service.add(thread)

@router.delete("/{thread_id}")
@inject
def delete_thread(
    thread_id: int,
    service: ThreadService = Depends(Provide[Container.thread_service]),
    current_user: User = Depends(get_current_active_user),
):
    return service.remove_by_id(thread_id)