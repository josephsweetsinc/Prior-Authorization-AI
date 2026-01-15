import { api as baseApi } from '@/services/api/api';
import { clearParams } from '@/shared/lib/utils';

import { type NotificationsResponse, type NotificationsParams } from '../types';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, NotificationsParams>(
      {
        query: ({ page = 1, category }) => ({
          url: '/notification/',
          params: clearParams({
            page,
            category:
              category !== 'all' && category !== 'unread'
                ? category
                : undefined,
          }),
        }),
        providesTags: (result) =>
          result
            ? [
                ...result.items.map(({ id }) => ({
                  type: 'Notifications' as const,
                  id,
                })),
                { type: 'Notifications', id: 'LIST' },
              ]
            : [{ type: 'Notifications', id: 'LIST' }],
        keepUnusedDataFor: 60,
      },
    ),
  }),
  overrideExisting: false,
});

export const { useGetNotificationsQuery } = notificationApi;
