import { api as baseApi } from '@/services/api/api';
import { clearParams } from '@/shared/lib/utils';

import {
  type IGetNotificationsParams,
  type IGetNotificationsResponse,
} from '../types';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<
      IGetNotificationsResponse,
      IGetNotificationsParams
    >({
      query: ({ page = 1, category, is_read }) => ({
        url: '/notification/',
        params: clearParams({
          page,
          category: category,
          is_read,
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
    }),
    markNotificationAsRead: builder.mutation<void, number>({
      query: (id) => ({
        url: `/notification/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error) => [
        { type: 'Notifications', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const { useGetNotificationsQuery, useMarkNotificationAsReadMutation } =
  notificationApi;
