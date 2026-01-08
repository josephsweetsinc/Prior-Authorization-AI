import { api as baseApi } from '@/services/api/api';

import type {
  IRequest,
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
      query: ({ page = 1, ...params }) => ({
        url: '/ambulance-request/',
        params: {
          page,
          ...params,
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
    approveRequest: builder.mutation<IRequest, number>({
      query: (id) => ({
        url: `/ambulance-request/${id}/approve`,
        method: 'POST',
        body: {},
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'RequestDetails', id },
        { type: 'RequestsHistory', id },
        { type: 'RequestsHistory', id: 'LIST' },
        { type: 'AuthorizationRequests', id },
        { type: 'AuthorizationRequests', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRequestsHistoryQuery,
  useGetRequestDetailsQuery,
  useApproveRequestMutation,
} = requestsHistoryAPI;
