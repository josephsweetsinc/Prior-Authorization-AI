import { api } from '@/services/api/api';

import { type IUploadResponse } from '../types/types';

export const mediaApi = api.injectEndpoints({
  endpoints: (build) => ({
    uploadFile: build.mutation<IUploadResponse, { file: File; type?: string }>({
      query: ({ file: files, type }) => {
        const formData = new FormData();
        formData.append('files', files);
        if (type) {
          formData.append('type', type);
        }

        return {
          url: '/ambulance-request/upload',
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

export const { useUploadFileMutation } = mediaApi;
