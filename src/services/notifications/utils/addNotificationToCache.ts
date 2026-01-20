import { type AppDispatch } from '@/store';

import { updateNotificationCache } from '../actions';
import { notificationApi } from '../api/notifications-api';
import { type INotification, type NotificationCategory } from '../types';

export const addNotificationToCache = (
  notification: INotification,
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
      { type: 'Notifications', id: 'LIST' },
      { type: 'RequestsHistory', id: notification.request_id },
      { type: 'AuthorizationRequests', id: notification.request_id },
      { type: 'RequestDetails', id: notification.request_id },
      { type: 'Dashboard' },
    ]),
  );
};
