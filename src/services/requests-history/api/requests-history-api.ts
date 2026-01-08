import { api as baseApi } from '@/services/api/api';

import type {
  RequestUpdatePayload,
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
    denyRequest: builder.mutation<
      IRequest,
      { id: number; denial_reason: string; denial_notes?: string }
    >({
      query: ({ id, denial_reason, denial_notes }) => ({
        url: `/ambulance-request/${id}/deny`,
        method: 'POST',
        body: {
          denial_reason,
          ...(denial_notes ? { denial_notes } : {}),
        },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'RequestDetails', id },
        { type: 'RequestsHistory', id },
        { type: 'RequestsHistory', id: 'LIST' },
        { type: 'AuthorizationRequests', id },
        { type: 'AuthorizationRequests', id: 'LIST' },
      ],
    }),
    updateRequest: builder.mutation<
      IRequestDetails,
      { id: number; data: RequestUpdatePayload }
    >({
      query: ({ id, data }) => ({
        url: `/ambulance-request/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
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
  useDenyRequestMutation,
  useUpdateRequestMutation,
} = requestsHistoryAPI;
