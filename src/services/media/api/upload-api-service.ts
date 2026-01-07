import type {
  IExtractionRequest,
  IFile,
  IExtractionResponse,
} from '@/services';
import { api as baseApi } from '@/services/api/api';

export const extractionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    extractFromFiles: build.mutation<IExtractionResponse, IExtractionRequest>({
      query: (body) => ({
        url: '/ambulance-request/extraction',
        method: 'POST',
        body,
      }),
    }),
    uploadFile: build.mutation<IFile[], unknown>({
      query: ({ file, type }) => {
        const formData = new FormData();
        formData.append('files', file);
        if (type) {
          formData.append('type', type);
        }

        return {
          url: '/ambulance-request/files',
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

export const { useExtractFromFilesMutation, useUploadFileMutation } =
  extractionApi;
