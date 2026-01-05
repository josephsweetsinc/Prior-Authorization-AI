import { api as baseApi } from '@/services/api/api';

import {
  type ICreateUserPayload,
  type IGetUsersResponse,
  type IUserEntry,
} from '../types';

const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<IGetUsersResponse, void>({
      query: () => '/user/',
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    createUser: builder.mutation<IUserEntry, ICreateUserPayload>({
      query: (body) => ({
        url: '/user/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    updateUser: builder.mutation<
      IUserEntry,
      { id: number; data: Partial<IUserEntry> }
    >({
      query: ({ id, data }) => ({
        url: `/user/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/user/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
} = usersApi;
