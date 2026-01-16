import { api as baseApi } from '@/services/api/api';
import { clearParams } from '@/shared/lib/utils';

import { type NotificationsResponse, type NotificationsParams } from '../types';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, NotificationsParams>(
      {
        query: ({ page = 1, category, filter }) => ({
          url: '/notification/',
          params: clearParams({
            page,
            category:
              category !== 'all' &&
              category !== 'unread' &&
              filter !== 'all' &&
              filter !== 'unread'
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
    markNotificationAsRead: builder.mutation<void, number>({
      query: (id) => ({
        url: `/notification/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Notifications', id },
        { type: 'Notifications', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { useGetNotificationsQuery, useMarkNotificationAsReadMutation } =
  notificationApi;
