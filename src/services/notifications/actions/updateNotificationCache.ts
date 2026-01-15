import { type AppDispatch } from '@/store';

import { notificationApi } from '../api/notifications-api';
import { draftStructure } from '../constants';
import { type NotificationItem, type NotificationsParams } from '../types';

export const updateNotificationCache = (
  params: NotificationsParams,
  notification: NotificationItem,
  dispatch: AppDispatch,
) => {
  dispatch(
    notificationApi.util.updateQueryData(
      'getNotifications',
      params,
      (draft) => {
        if (!draft) {
          draft = draftStructure;
        }

        const exists = draft.items.some((item) => item.id === notification.id);

        if (!exists) {
          draft.items.unshift(notification);
          draft.total += 1;
          draft.showing = draft.items.length;
        }
      },
    ),
  );
};
