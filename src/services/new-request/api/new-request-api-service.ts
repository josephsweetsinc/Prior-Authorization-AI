import { api as baseApi } from '@/services/api/api';
import { type IRequest } from '@/services/requests';

import { type ICreateRequestBody } from '../types';

export const extractionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createAmbulanceRequest: build.mutation<
      IRequest,
      Partial<ICreateRequestBody> | null
    >({
      query: (body) => ({
        url: '/ambulance-request/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: (result) => {
        return result
          ? [
              { type: 'RequestDetails', id: result.id },
              { type: 'RequestsHistory', id: 'LIST' },
              { type: 'Dashboard', id: 'LIST' },
            ]
          : [];
      },
    }),
  }),
});

export const { useCreateAmbulanceRequestMutation } = extractionApi;
