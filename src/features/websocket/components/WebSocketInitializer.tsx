'use client';

import { useWebSocketNotifications } from '@/services/websocket/hooks';

export const WebSocketInitializer = () => {
  useWebSocketNotifications();
  return null;
};
