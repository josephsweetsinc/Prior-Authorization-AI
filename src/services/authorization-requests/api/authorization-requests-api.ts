import { api as baseApi } from '@/services/api/api';

import type {
  AuthorizationRequestsParams,
  AuthorizationRequestsResponse,
} from '../types';

export const authorizationRequestsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAuthorizationRequests: builder.query<
      AuthorizationRequestsResponse,
      AuthorizationRequestsParams | void
    >({
      query: (params) => {
        const { page = 1, search, status, days } = params ?? {};

        return {
          url: '/ambulance-request/',
          params: {
            page,
            search,
            status,
            days,
          },
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: 'AuthorizationRequests' as const,
                id,
              })),
              { type: 'AuthorizationRequests', id: 'LIST' },
            ]
          : [{ type: 'AuthorizationRequests', id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAuthorizationRequestsQuery } = authorizationRequestsApi;
