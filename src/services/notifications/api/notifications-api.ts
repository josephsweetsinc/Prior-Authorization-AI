import { api as baseApi } from '@/services/api/api';

import { type NotificationsResponse, type NotificationsParams } from '../types';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<NotificationsResponse, NotificationsParams>(
      {
        query: ({ page = 1, category }) => ({
          url: '/notification/',
          params: {
            page,
            category: category !== 'all' ? category : undefined,
          },
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
      },
    ),
  }),
  overrideExisting: false,
});

export const { useGetNotificationsQuery } = notificationApi;
