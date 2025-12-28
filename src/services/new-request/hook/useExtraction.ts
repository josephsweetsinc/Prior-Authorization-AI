import {
  type ExtractionResponse,
  useExtractFromFilesMutation,
} from '@/services';

export const useExtraction = () => {
  const mutationTuple = useExtractFromFilesMutation();
  const extract = mutationTuple[0];

  type MutationResult =
    | {
        isLoading: boolean;
        error?: unknown;
        data?: ExtractionResponse;
        reset?: () => void;
      }
    | undefined;

  const result = (mutationTuple[1] ?? undefined) as MutationResult;
  const { isLoading, error, data, reset } = result ?? {
    isLoading: false,
    error: undefined,
    data: undefined,
    reset: undefined,
  };

  const extractFiles = async (
    fileIds: number[],
  ): Promise<ExtractionResponse> => {
    try {
      const res = (await extract({ file_ids: fileIds })) as unknown as {
        data?: ExtractionResponse;
        error?: unknown;
      };

      if (res && typeof res === 'object' && 'data' in res && res.data) {
        return res.data as ExtractionResponse;
      }

      console.error('Extraction API returned without data', res);
      throw (
        (res && (res as { error?: unknown }).error) ??
        new Error('Unknown extraction error')
      );
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
