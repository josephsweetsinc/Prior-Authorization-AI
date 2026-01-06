import { api as baseApi } from '@/services/api/api';

import type { IUpdateOrganizationPayload } from '../types';

export const requestsSettingsAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateUserOrganization: builder.mutation<void, IUpdateOrganizationPayload>({
      query: (body) => ({
        url: '/organization/me',
        method: 'PATCH',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useUpdateUserOrganizationMutation } = requestsSettingsAPI;
