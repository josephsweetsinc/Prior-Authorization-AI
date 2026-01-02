import { api as baseApi } from '@/services/api/api';

import type { IRequestDetails, IRequestHistoryResponse } from '../types';

export const requestsHistoryAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRequestsHistory: builder.query<IRequestHistoryResponse, void>({
      query: () => '/ambulance-request/',
      providesTags: ['RequestsHistory'],
    }),
    getRequestDetails: builder.query<IRequestDetails, number>({
      query: (id) => `/ambulance-request/${id}`,
      keepUnusedDataFor: 300,
      providesTags: (result) => [{ type: 'RequestDetails', id: result?.id }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetRequestsHistoryQuery, useGetRequestDetailsQuery } =
  requestsHistoryAPI;
