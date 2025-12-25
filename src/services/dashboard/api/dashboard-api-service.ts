import { api as baseApi } from '@/services/api/api';

import { type DashboardResponse } from '../types';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardResponse, void>({
      query: () => '/dashboard_metrics/',
      providesTags: ['Dashboard'],
    }),
  }),
  overrideExisting: false,
});

export const selectProviderDashboard = (data?: DashboardResponse) =>
  data?.provider;

export const { useGetDashboardQuery } = dashboardApi;
