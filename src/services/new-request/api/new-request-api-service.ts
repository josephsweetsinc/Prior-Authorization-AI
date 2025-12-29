import { api as baseApi } from '@/services/api/api';

export const extractionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createAmbulanceRequest: build.mutation<unknown, unknown>({
      query: (body) => ({
        url: '/ambulance-request/create',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCreateAmbulanceRequestMutation } = extractionApi;
