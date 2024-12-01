from typing import Optional

from pydantic import BaseModel

from app.schema.base_schema import ModelBaseInfo
from app.util.schema import AllOptional

class BaseMessage(BaseModel):
    sender: Optional[str] = None
    content: Optional[str] = None
    thread_id: Optional[int] = None

    class Config:
        orm_mode = True

class UpsertMessage(BaseModel):
    sender: Optional[str] = None
    content: Optional[str] = None
    thread_id: Optional[int] = None

class Message(ModelBaseInfo, BaseMessage, metaclass=AllOptional): ...