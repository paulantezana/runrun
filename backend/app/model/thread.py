from sqlmodel import Field

from app.model.base_model import BaseModel


class Thread(BaseModel, table=True):
    user_token: str = Field()
    
    title: str = Field()
