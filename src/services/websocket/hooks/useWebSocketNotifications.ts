'use client';

import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { getAccessToken } from '@/services/api/token';
import { useGetNotificationsQuery } from '@/services/notifications/api/notifications-api';
import type { NotificationItem } from '@/services/notifications/types/types';
import { addNotificationToCache } from '@/services/notifications/utils/addNotificationToCache';
import { useWebSocket } from '@/services/websocket/api/websocket-service';

import { POLLING_INTERVAL, WEBSOCKET_URL } from '../constants';

export const useWebSocketNotifications = () => {
  const dispatch = useDispatch();
  const { connect, disconnect, on, send, isConnected } = useWebSocket();
  const lastNotificationIdRef = useRef<number | null>(null);

  const { data: notificationsData } = useGetNotificationsQuery(
    { page: 1, category: undefined },
    {
      pollingInterval: isConnected ? 0 : POLLING_INTERVAL,
      skip: isConnected,
    },
  );

  useEffect(() => {
    if (!isConnected && notificationsData?.items?.length) {
      const latestNotification = notificationsData.items[0];
      if (
        latestNotification &&
        latestNotification.id !== lastNotificationIdRef.current
      ) {
        lastNotificationIdRef.current = latestNotification.id;
        if (!latestNotification.is_read) {
          toast.info(latestNotification.title || 'New notification', {
            position: 'top-right',
            autoClose: 5000,
          });
        }
      }
    }
  }, [notificationsData, isConnected]);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      console.warn('No access token available for WebSocket connection');
      return;
    }

    if (!WEBSOCKET_URL) {
      return;
    }

    const url = new URL(WEBSOCKET_URL);
    url.searchParams.set('token', token);
    connect(url.toString(), token);

    const unsubscribe = on('notification', (notification) => {
      const notificationItem = notification as NotificationItem;
      addNotificationToCache(notificationItem, dispatch);

      toast.info(notificationItem.title || 'New notification', {
        position: 'top-right',
        autoClose: 5000,
      });

      lastNotificationIdRef.current = notificationItem.id;
    });

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
