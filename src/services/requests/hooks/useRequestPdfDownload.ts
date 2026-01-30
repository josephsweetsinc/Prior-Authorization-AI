import { useCallback } from 'react';

import { useLazyDownloadRequestPdfQuery } from '../api';
import { downloadRequestPdfFile } from '../services/requestPdfDownloadService';

type UseRequestPdfDownloadArgs = {
  requestId: number;
  formNumber?: string | null;
};

type UseRequestPdfDownloadOptions = {
  onError?: (_error: unknown) => void;
};

export const useRequestPdfDownload = (
  options: UseRequestPdfDownloadOptions = {},
) => {
  const [downloadRequestPdf, { isFetching }] = useLazyDownloadRequestPdfQuery();
  const { onError } = options;

  const handleDownload = useCallback(
    async ({ requestId, formNumber }: UseRequestPdfDownloadArgs) => {
      try {
        const url = await downloadRequestPdf(requestId).unwrap();
        if (!url) {
          return;
        }
        downloadRequestPdfFile({ url, requestId, formNumber });
      } catch (error) {
        if (onError) {
          onError(error);
        } else {
          console.error('Failed to download PDF', error);
        }
      }
    },
    [downloadRequestPdf, onError],
  );

  return {
    downloadRequestPdf: handleDownload,
    isDownloading: isFetching,
  };
};
