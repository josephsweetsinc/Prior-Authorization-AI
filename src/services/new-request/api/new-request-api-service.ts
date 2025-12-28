import type { ExtractionResponse, ExtractionRequest } from '@/services';
import { api as baseApi } from '@/services/api/api';

export const extractionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    extractFromFiles: build.mutation<ExtractionResponse, ExtractionRequest>({
      query: (body) => ({
        url: '/ambulance-request/extraction',
        method: 'POST',
        body,
      }),
    }),
    createAmbulanceRequest: build.mutation<unknown, unknown>({
      query: (body) => ({
        url: '/ambulance-request/create',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useExtractFromFilesMutation,
  useCreateAmbulanceRequestMutation,
} = extractionApi;
