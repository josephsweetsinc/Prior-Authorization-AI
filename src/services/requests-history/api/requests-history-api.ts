import { api as baseApi } from '@/services/api/api';

import type { IRequestHistoryResponse } from '../types';

export const requestsHistoryAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRequestsHistory: builder.query<IRequestHistoryResponse, void>({
      query: () => '/ambulance-request/',
      providesTags: ['RequestsHistory'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetRequestsHistoryQuery } = requestsHistoryAPI;
