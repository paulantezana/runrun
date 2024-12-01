from app.repository.resource_repository import ResourceRepository
from app.services.base_service import BaseService


class ResourceService(BaseService):
    def __init__(self, resource_repository: ResourceRepository):
        self.resource_repository = resource_repository
        super().__init__(resource_repository)
