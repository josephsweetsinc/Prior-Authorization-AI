from .ambulance_request import ambulance_request_router
from .auth import auth_router
from .dashboard import dashboard_router
from .main import main_router
from .user import user_router

__all__ = [
    'ambulance_request_router',
    'auth_router',
    'dashboard_router',
    'main_router',
    'user_router',
]
