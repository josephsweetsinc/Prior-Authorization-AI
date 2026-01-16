'use client';

import { useEffect, useRef } from 'react';

import { useGetNotificationsQuery } from '@/services/notifications';
import type {
  NotificationItem,
  NotificationCategory,
} from '@/services/notifications/types/types';

import { POLLING_INTERVAL } from '../constants';
import { safeNotificationHandler } from '../utils/checks';
import { buildNotificationsParams } from '../utils/params';

interface Params {
  handleNotification: (_notification: NotificationItem) => void;
  isConnected: boolean;
  page?: number;
  category?: NotificationCategory;
}

export const usePolling = ({
  handleNotification,
  isConnected,
  page = 1,
  category = 'unread',
}: Params) => {
  const lastNotificationIdRef = useRef<number | null>(null);

  const { data } = useGetNotificationsQuery(
    buildNotificationsParams(page, category),
    {
      pollingInterval: isConnected ? 0 : POLLING_INTERVAL,
      skip: isConnected,
    },
  );

  useEffect(() => {
    if (isConnected || !data?.items?.length) {
      return;
    }

    const latestNotification = data.items[0];

    safeNotificationHandler(
      latestNotification,
      handleNotification,
      lastNotificationIdRef,
    );
  }, [data, isConnected, handleNotification]);
};
