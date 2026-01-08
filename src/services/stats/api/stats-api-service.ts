import { api as baseApi } from '@/services/api/api';

import type { AdminUsersStats, ProviderStats } from '../types';

export const statsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProviderStats: builder.query<ProviderStats, void>({
      query: () => '/stats/provider',
      providesTags: ['Dashboard'],
    }),
    getAdminUsersStats: builder.query<AdminUsersStats, void>({
      query: () => '/stats/admin/users',
      providesTags: ['Dashboard'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetProviderStatsQuery, useGetAdminUsersStatsQuery } =
  statsApi;
