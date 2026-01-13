import json
import logging
from typing import Any

from fastapi import WebSocket

logger = logging.getLogger(__name__)


class WebSocketConnectionManager:
    """Manager for WebSocket connections.

    Manages active WebSocket connections for all authenticated users.
    Supports sending messages to specific users and broadcasting to all connected users.
    """

    def __init__(self) -> None:
        """Initialize WebSocketConnectionManager."""
        self.active_connections: dict[int, WebSocket] = {}
        """Dictionary mapping user_id to WebSocket connection."""

    async def connect(self, websocket: WebSocket, user_id: int) -> None:
        """Store a WebSocket connection.

        Note: websocket.accept() should be called before this method.

        Args:
            websocket: WebSocket connection to store.
            user_id: ID of the connected user.

        """
        self.active_connections[user_id] = websocket
        logger.info('WebSocket connected for user %s', user_id)

    def disconnect(self, user_id: int) -> None:
        """Remove a WebSocket connection.

        Args:
            user_id: ID of the user to disconnect.

        """
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            logger.info('WebSocket disconnected for user %s', user_id)

    async def send_personal_message(
        self, message: dict[str, Any], user_id: int
    ) -> None:
        """Send a message to a specific user if connected.

        If user is not connected, this method does nothing (no error).
        This is expected behavior - notifications are always saved in DB
        and can be retrieved via API even if user is not connected to WebSocket.

        Args:
            message: Message dictionary to send.
            user_id: ID of the target user.

        """
        websocket = self.active_connections.get(user_id)
        if websocket:
            try:
                await websocket.send_json(message)
                logger.debug('Sent WebSocket message to user %s', user_id)
            except Exception as e:
                logger.warning(
                    'Failed to send WebSocket message to user %s: %s', user_id, e
                )
                self.disconnect(user_id)
        else:
            logger.debug(
                'User %s is not connected to WebSocket. '
                'Notification is saved in database.',
                user_id
            )

    async def broadcast_to_admins(self, message: dict[str, Any]) -> None:
        """Broadcast a message to all connected admin users.

        Args:
            message: Message dictionary to broadcast.

        """
        disconnected_users: list[int] = []
        for user_id, websocket in self.active_connections.items():
            try:
                await websocket.send_json(message)
            except Exception as e:
                logger.exception(
                    'Failed to send broadcast message to user %s: %s',
                    user_id,
                    e,
                )
                disconnected_users.append(user_id)

        # Clean up disconnected connections
        for user_id in disconnected_users:
            self.disconnect(user_id)

    async def broadcast_to_all(self, message: dict[str, Any]) -> None:
        """Broadcast a message to all connected users.

        Args:
            message: Message dictionary to broadcast.

        """
        disconnected_users: list[int] = []
        for user_id, websocket in self.active_connections.items():
            try:
                await websocket.send_json(message)
            except Exception as e:
                logger.exception(
                    'Failed to send broadcast message to user %s: %s',
                    user_id,
                    e,
                )
                disconnected_users.append(user_id)

        # Clean up disconnected connections
        for user_id in disconnected_users:
            self.disconnect(user_id)

    def is_connected(self, user_id: int) -> bool:
        """Check if a user is connected.

        Args:
            user_id: ID of the user to check.

        Returns:
            bool: True if user is connected, False otherwise.

        """
        return user_id in self.active_connections

    def get_connected_count(self) -> int:
        """Get the number of connected users.

        Returns:
            int: Number of active connections.

        """
        return len(self.active_connections)


# Global instance
websocket_manager = WebSocketConnectionManager()
