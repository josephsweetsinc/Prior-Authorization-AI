import { toast } from 'react-toastify';

import { useUploadFileMutation } from '@/services';

export const useUploadMedia = () => {
  const [upload, { isLoading, error }] = useUploadFileMutation();

  const uploadFile = async (file: File, type?: string) => {
    try {
      const res = await upload({ file, type }).unwrap();
      return res;
    } catch (err) {
      console.error(err);
      toast.error('');
      throw err;
    }
  };

  return { uploadFile, isLoading, error };
};
