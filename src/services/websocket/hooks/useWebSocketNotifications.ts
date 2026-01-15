'use client';

import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { buildNotificationsParams } from '@/features/notifications/utils/filters';
import { getAccessToken } from '@/services/api/token';
import { useGetNotificationsQuery } from '@/services/notifications/api/notifications-api';
import type { NotificationItem } from '@/services/notifications/types/types';
import { addNotificationToCache } from '@/services/notifications/utils/addNotificationToCache';

import { POLLING_INTERVAL, WEBSOCKET_URL } from '../constants';

import { useWebSocket } from './useWebSocket';

const showNotificationToast = (notification: NotificationItem) => {
  toast.info(notification.title || 'New notification', {
    position: 'top-right',
    autoClose: 5000,
  });
};

export const useWebSocketNotifications = () => {
  const dispatch = useDispatch();
  const { connect, disconnect, on, send, isConnected } = useWebSocket();
  const lastNotificationIdRef = useRef<number | null>(null);

  const { data: pollingNotificationsData } = useGetNotificationsQuery(
    buildNotificationsParams(1),
    {
      pollingInterval: isConnected ? 0 : POLLING_INTERVAL,
      skip: isConnected,
    },
  );

  useEffect(() => {
    if (isConnected) {
      return;
    }

    if (!pollingNotificationsData?.items?.length) {
      return;
    }

    const latestNotification = pollingNotificationsData.items[0];

    if (!latestNotification) {
      return;
    }

    if (latestNotification.id === lastNotificationIdRef.current) {
      return;
    }

    lastNotificationIdRef.current = latestNotification.id;

    if (!latestNotification.is_read) {
      showNotificationToast(latestNotification);
    }
  }, [pollingNotificationsData, isConnected]);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      console.warn('No access token available for WebSocket connection');
      return;
    }

    if (!WEBSOCKET_URL) {
      console.warn('WebSocket URL not configured');
      return;
    }

    const url = new URL(WEBSOCKET_URL);
    url.searchParams.set('token', token);
    connect(url.toString(), token);

    const handleRealtimeNotification = (_notification: unknown) => {
      const notification = _notification as NotificationItem;

      addNotificationToCache(notification, dispatch);

      showNotificationToast(notification);

      lastNotificationIdRef.current = notification.id;
    };

    const unsubscribe = on('notification', handleRealtimeNotification);

    return () => {
      unsubscribe();
      disconnect();
    };
  }, [dispatch, connect, disconnect, on]);

  return {
    isConnected,
    send,
  };
};
