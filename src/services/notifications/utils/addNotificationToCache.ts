import { apiCategory } from '@/services/websocket';
import type { AppDispatch } from '@/store';

import { updateNotificationCache } from '../actions';
import { notificationApi } from '../api/notifications-api';
import type { INotification } from '../types';

export const addNotificationToCache = (
  notification: INotification,
  dispatch: AppDispatch,
) => {
  updateNotificationCache({ page: 1 }, notification, dispatch);

  if (!notification.is_read) {
    updateNotificationCache(
      { page: 1, is_read: false },
      notification,
      dispatch,
    );
  }

  const category = apiCategory(notification.category);

  if (category) {
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
