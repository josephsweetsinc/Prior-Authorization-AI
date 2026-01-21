import { type AppDispatch } from '@/store';

import { notificationApi } from '../api/notifications-api';
import { draftStructure } from '../constants';
import type { IGetNotificationsParams, INotification } from '../types';

export const updateNotificationCache = (
  params: IGetNotificationsParams,
  notification: INotification,
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
