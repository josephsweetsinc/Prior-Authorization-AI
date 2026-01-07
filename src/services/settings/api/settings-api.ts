import { api as baseApi } from '@/services/api/api';

import {
  type IUpdateAccountPayload,
  type IUpdateOrganizationPayload,
} from '../types';

export const requestsSettingsAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateUserOrganization: builder.mutation<void, IUpdateOrganizationPayload>({
      query: (body) => ({
        url: '/organization/me',
        method: 'PATCH',
        body,
      }),
    }),

    updateUserAccount: builder.mutation<void, IUpdateAccountPayload>({
      query: (body) => ({
        url: '/user/me',
        method: 'PATCH',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useUpdateUserOrganizationMutation,
  useUpdateUserAccountMutation,
} = requestsSettingsAPI;
