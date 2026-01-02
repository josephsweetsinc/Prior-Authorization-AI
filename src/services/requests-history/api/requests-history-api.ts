import { api as baseApi } from '@/services/api/api';

import type { IRequestHistoryResponse } from '../types';

export const requestsHistoryAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRequestsHistory: builder.query<IRequestHistoryResponse, void>({
      query: () => '/ambulance-request/',
      providesTags: ['Dashboard'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetRequestsHistoryQuery } = requestsHistoryAPI;
