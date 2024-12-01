from dependency_injector import containers, providers

from app.core.config import configs
from app.core.database import Database
from app.repository import *
from app.services import *


class Container(containers.DeclarativeContainer):
    wiring_config = containers.WiringConfiguration(
        modules=[
            "app.api.v1.endpoints.auth",
            "app.api.v1.endpoints.post",
            "app.api.v1.endpoints.tag",
            "app.api.v1.endpoints.user",
            "app.api.v1.endpoints.message",
            # "app.api.v1.endpoints.resource",
            "app.api.v1.endpoints.thread",
            "app.api.v2.endpoints.auth",
            "app.core.dependencies",
        ]
    )

    db = providers.Singleton(Database, db_url=configs.DATABASE_URI)

    post_repository = providers.Factory(PostRepository, session_factory=db.provided.session)
    tag_repository = providers.Factory(TagRepository, session_factory=db.provided.session)
    user_repository = providers.Factory(UserRepository, session_factory=db.provided.session)
    message_repository = providers.Factory(MessageRepository, session_factory=db.provided.session)
    resource_repository = providers.Factory(ResourceRepository, session_factory=db.provided.session)
    thread_repository = providers.Factory(ThreadRepository, session_factory=db.provided.session)

    auth_service = providers.Factory(AuthService, user_repository=user_repository)
    post_service = providers.Factory(PostService, post_repository=post_repository, tag_repository=tag_repository)
    tag_service = providers.Factory(TagService, tag_repository=tag_repository)
    user_service = providers.Factory(UserService, user_repository=user_repository)
    message_service = providers.Factory(MessageService, message_repository=message_repository)
    resource_service = providers.Factory(ResourceService, resource_repository=resource_repository)
    thread_service = providers.Factory(ThreadService, thread_repository=thread_repository)
