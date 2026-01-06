import { api as baseApi } from '@/services/api/api';

import type {
  IRequestDetails,
  IRequestHistoryParams,
  IRequestHistoryResponse,
} from '../types';

export const requestsHistoryAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRequestsHistory: builder.query<
      IRequestHistoryResponse,
      IRequestHistoryParams
    >({
      query: ({ page = 1, search, status, days }) => ({
        url: '/ambulance-request/',
        params: {
          page,
          search,
          status,
          days,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: 'RequestsHistory' as const,
                id,
              })),
              { type: 'RequestsHistory', id: 'LIST' },
            ]
          : [{ type: 'RequestsHistory', id: 'LIST' }],
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
