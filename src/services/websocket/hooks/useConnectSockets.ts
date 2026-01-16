'use client';

import { useEffect } from 'react';

import { getAccessToken } from '@/services/api/token';
import type { NotificationItem } from '@/services/notifications';

import { WEBSOCKET_URL } from '../constants';
import { type WebSocketEvent } from '../types';
import { safeNotificationHandler } from '../utils/checks';

import { useWebSocket } from './useWebSocket';

export const useConnectSockets = (
  handleNotification: (_n: NotificationItem) => void,
) => {
  const { connect, disconnect, on, send, isConnected } = useWebSocket();

  useEffect(() => {
    const token = getAccessToken();
    if (!token || !WEBSOCKET_URL) {
      return;
    }

    const url = new URL(WEBSOCKET_URL);
    url.searchParams.set('token', token);
    connect(url.toString(), token);

    const unsubscribe = on('notification', (payload: WebSocketEvent) => {
      safeNotificationHandler(payload.data, handleNotification);
    });

    return () => {
      unsubscribe();
      disconnect();
    };
  }, [connect, disconnect, on, handleNotification]);

  return { isConnected, send };
};
