import { api as baseApi } from '@/services/api/api';
import { type IUser } from '@/services/auth';

import {
  type IUpdateUserPayload,
  type ICreateUserPayload,
  type IGetUsersResponse,
  type IGetUserParams,
} from '../types';

const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<IGetUsersResponse, IGetUserParams>({
      query: ({ page = 1, search, role }) => ({
        url: '/user/',
        params: {
          page,
          search,
          role,
        },
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Users' as const, id })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
    }),

    createUser: builder.mutation<IUser, ICreateUserPayload>({
      query: (body) => ({
        url: '/user/',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),

    updateUser: builder.mutation<
      IUser,
      { id: number; data: IUpdateUserPayload }
    >({
      query: ({ id, data }) => ({
        url: `/user/${id}`,
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
        url: `/user/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Users', id },
        { type: 'Users', id: 'LIST' },
      ],
    }),

    approveUser: builder.mutation<IUser, number>({
      query: (id) => ({
        url: `/user/${id}/activate`,
        method: 'PATCH',
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
  useUpdateUserMutation,
  useApproveUserMutation,
} = usersApi;
