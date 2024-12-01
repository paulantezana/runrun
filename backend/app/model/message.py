from sqlmodel import Field

from app.model.base_model import BaseModel


class Message(BaseModel, table=True):
    content: str = Field()
    sender: str = Field()
    thread_id: int = Field(foreign_key="thread.id", index=True, nullable=False)
