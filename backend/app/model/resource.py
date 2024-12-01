from sqlmodel import Field

from app.model.base_model import BaseModel

class Resource(BaseModel, table=True):
    uploaded_user_token: str = Field()

    name: str = Field()
    file_type: str = Field()
    file_path: str = Field()
    size: int = Field()
    is_active: bool = Field(default=False)
