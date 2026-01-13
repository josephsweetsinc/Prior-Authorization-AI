import logging

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from models import User
from services import UserService
from services.auth import AuthService
from services.websocket_manager import websocket_manager

logger = logging.getLogger(__name__)

websocket_router = APIRouter()


def _extract_token_from_header(authorization: str | None) -> str | None:
    """Extract Bearer token from Authorization header.

    Args:
        authorization: Authorization header value (e.g., "Bearer token").

    Returns:
        Token string or None if not found.

    """
    if not authorization:
        return None
    if authorization.startswith('Bearer '):
        return authorization[7:]
    return None


@websocket_router.websocket('/notifications')
async def websocket_notifications(
    websocket: WebSocket,
) -> None:
    """WebSocket endpoint for real-time notifications.

    Connects authenticated users (admins and providers) to receive real-time notifications.
    The connection is authenticated using a JWT token passed in Authorization header.

    **Authentication:**
    - Header: `Authorization: Bearer <your_jwt_token>`

    **Testing in Postman:**
    1. Create a new WebSocket request
    2. URL: `ws://localhost:8000/Prod/api/v1/websocket/notifications`
    3. Add header: `Authorization: Bearer <your_jwt_token>`
    4. Click "Connect"
    5. You will receive notifications as they are created

    **Note:** WebSocket connections cannot be tested in Swagger UI.

    Args:
        websocket: WebSocket connection.

    """
    # Accept the connection first to avoid 403 rejection
    await websocket.accept()
    
    user: User | None = None
    try:
        # Extract token from Authorization header
        # Try different ways to get the header
        authorization = websocket.headers['authorization']
        
        # Log the actual authorization header value for debugging
        logger.info(
            'Authorization header found: %s, value: %s',
            authorization is not None,
            authorization[:50] + '...' if authorization and len(authorization) > 50 else authorization
        )
        
        token = _extract_token_from_header(authorization)

        if not token:
            await websocket.close(code=1008, reason='Authorization header required')
            return

        # Validate token and get user
        # We need to create services manually as WebSocket doesn't support Depends
        from config.database import async_session_maker

        async with async_session_maker() as session:
            auth_service = AuthService(db_session=session)
            user_service = UserService(db_session=session)

            try:
                user_id = await auth_service.validate_token_for_user(token)
                user = await user_service.get_user_by_id(user_id)
            except Exception as e:
                logger.warning('WebSocket authentication failed: %s', e)
                await websocket.close(code=1008, reason='Authentication failed')
                return

            if not user:
                await websocket.close(code=1008, reason='User not found')
                return

            # Register the connection for this user
            websocket_manager.active_connections[user.id] = websocket
            logger.info('WebSocket connected for user %s', user.id)

            # Keep the connection alive and handle messages
            while True:
                # Wait for messages (ping/pong or other messages)
                data = await websocket.receive_text()
                logger.debug('Received message from user %s: %s', user.id, data)

                # Optionally handle incoming messages (e.g., ping/pong)
                # For now, we just keep the connection alive

    except WebSocketDisconnect:
        if user:
            websocket_manager.disconnect(user.id)
        logger.info('WebSocket disconnected for user %s', user.id if user else 'unknown')
    except Exception as e:
        logger.exception('WebSocket error: %s', e)
        if user:
            websocket_manager.disconnect(user.id)
        try:
            await websocket.close(code=1011, reason='Internal server error')
        except Exception:
            pass  # Connection might already be closed
