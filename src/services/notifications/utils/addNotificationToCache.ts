import { type AppDispatch } from '@/store';

import { notificationApi } from '../api/notifications-api';
import {
  type NotificationCategory,
  type NotificationItem,
  type NotificationsParams,
} from '../types';

export const addNotificationToCache = (
  notification: NotificationItem,
  dispatch: AppDispatch,
) => {
  const updateCache = (params: NotificationsParams) => {
    dispatch(
      notificationApi.util.updateQueryData(
        'getNotifications',
        params,
        (draft) => {
          if (!draft) {
            draft = {
              items: [],
              page: 1,
              total: 0,
              showing: 0,
              total_pages: 1,
            };
          }

          const exists = draft.items.some(
            (item) => item.id === notification.id,
          );

          if (!exists) {
            draft.items.unshift(notification);
            draft.total += 1;
            draft.showing = draft.items.length;
          }
        },
      ),
    );
  };

  updateCache({ page: 1 });

  const category = notification.category as NotificationCategory;
  if (category && category !== 'all' && category !== 'unread') {
    updateCache({ page: 1, category });
  }

  dispatch(
    notificationApi.util.invalidateTags([
      { type: 'Notifications', id: 'LIST' },
      { type: 'Notifications', id: notification.id },
    ]),
  );
};
