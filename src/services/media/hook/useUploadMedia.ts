import { useUploadFileMutation } from '@/services'; // Перевір шлях до api

export const useUploadMedia = () => {
  const [upload, { isLoading, error, reset }] = useUploadFileMutation();

  const uploadFile = async (file: File, type?: string) => {
    try {
      return await upload({ file, type }).unwrap();
    } catch (err) {
      throw err;
    }
  };

  return {
    uploadFile,
    isLoading,
    error,
    reset,
  };
};
