import { api } from '@/services/api/api';

interface UploadResponse {
  url: string;
}

export const mediaApi = api.injectEndpoints({
  endpoints: (build) => ({
    uploadFile: build.mutation<UploadResponse, { file: File; type?: string }>({
      query: ({ file: files, type }) => {
        const formData = new FormData();
        formData.append('files', files);
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

export const { useUploadFileMutation } = mediaApi;
