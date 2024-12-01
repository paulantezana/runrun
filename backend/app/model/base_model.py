from datetime import datetime
from sqlmodel import DateTime, Field, SQLModel, func

class BaseModel(SQLModel):
    id: int = Field(primary_key=True)
    created_at: datetime = Field(default=func.now(), sa_type=DateTime(timezone=True), sa_column_kwargs={ "onupdate": func.now()})
    updated_at: datetime = Field(default=func.now(), sa_type=DateTime(timezone=True), sa_column_kwargs={ "onupdate": func.now()})
