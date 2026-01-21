'use client';

import { useRef, useCallback } from 'react';

import {
  type INotification,
  addNotificationToCache,
} from '@/services/notifications';
import { type AppDispatch } from '@/store';

import { showNotificationToast } from '../utils/toast';

export const useHandleNotifications = (dispatch: AppDispatch) => {
  const lastNotificationIdRef = useRef<number | null>(null);

  const handleNotification = useCallback(
    (notification: INotification) => {
      if (notification.id === lastNotificationIdRef.current) {
        return;
      }

      lastNotificationIdRef.current = notification.id;

      addNotificationToCache(notification, dispatch);

      if (!notification.is_read) {
        showNotificationToast(notification);
      }
    },
    [dispatch],
  );

  return { handleNotification };
};
