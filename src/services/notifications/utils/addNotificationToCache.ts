import { type AppDispatch } from '@/store';

import { updateNotificationCache } from '../actions';
import { notificationApi } from '../api/notifications-api';
import { type NotificationCategory, type NotificationItem } from '../types';

export const addNotificationToCache = (
  notification: NotificationItem,
  dispatch: AppDispatch,
) => {
  updateNotificationCache({ page: 1, filter: 'all' }, notification, dispatch);

  if (!notification.is_read) {
    updateNotificationCache(
      { page: 1, filter: 'unread' },
      notification,
      dispatch,
    );
  }

  const category = notification.category as NotificationCategory;
  if (category && category !== 'all' && category !== 'unread') {
    updateNotificationCache({ page: 1, category }, notification, dispatch);
  }

  dispatch(
    notificationApi.util.invalidateTags([
      { type: 'Notifications', id: notification.id },
      { type: 'RequestsHistory', id: notification.request_id },
      { type: 'AuthorizationRequests', id: notification.request_id },
      { type: 'RequestDetails', id: notification.request_id },
      { type: 'Dashboard' },
    ]),
  );
};
