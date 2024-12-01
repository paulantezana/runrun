from typing import Optional

from pydantic import BaseModel

from app.schema.base_schema import ModelBaseInfo
from app.util.schema import AllOptional

class BaseThread(BaseModel):
    user_token: Optional[str]
    title: Optional[str]

    class Config:
        orm_mode = True

class UpsertThread(BaseModel):
    user_token: Optional[str] = None
    title: str

class Thread(ModelBaseInfo, BaseThread, metaclass=AllOptional): ...
