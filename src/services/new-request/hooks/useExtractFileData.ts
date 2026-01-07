import { type IExtractionResponse } from '@/services';
import { useExtractFromFilesMutation } from '@/services/media';

export const useExtractFileData = () => {
  const [extract, { isLoading, error, data, reset }] =
    useExtractFromFilesMutation();

  const extractFiles = async (
    fileIds: number[],
  ): Promise<IExtractionResponse> => {
    try {
      const response = await extract({ file_ids: fileIds }).unwrap();

      return response;
    } catch (err: unknown) {
      console.error('extractFiles error', err);
      throw err;
    }
  };

  return {
    extractFiles,
    isLoading,
    error,
    data,
    reset,
  };
};
