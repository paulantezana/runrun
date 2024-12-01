from dependency_injector.wiring import Provide
from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from ollama import chat
import json

from app.core.container import Container
from app.core.dependencies import get_current_active_user
from app.core.middleware import inject, inject_async
from app.model.user import User
from app.schema.message_schema import Message, UpsertMessage
from app.services.message_service import MessageService

router = APIRouter(
    prefix="/message",
    tags=["message"],
)

@router.get("/{thread_id}")
@inject
def get_message_list(
    thread_id: int,
    service: MessageService = Depends(Provide[Container.message_service]),
    current_user: User = Depends(get_current_active_user),
):
    return service.get_all_by_thread_id(thread_id)


@router.post("/chat")
@inject_async
async def create_message(
    message: UpsertMessage,
    service: MessageService = Depends(Provide[Container.message_service]),
    current_user: User = Depends(get_current_active_user),
):
    return await service.chat(message)

@router.delete("/{message_id}")
@inject
def delete_message(
    message_id: int,
    service: MessageService = Depends(Provide[Container.message_service]),
    current_user: User = Depends(get_current_active_user),
):
    return service.remove_by_id(message_id)