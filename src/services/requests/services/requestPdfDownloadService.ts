import { buildRequestPdfFilename } from '../utils/request-pdf';

type DownloadRequestPdfFileArgs = {
  url: string;
  requestId: number;
  formNumber?: string | null;
};

export const downloadRequestPdfFile = ({
  url,
  requestId,
  formNumber,
}: DownloadRequestPdfFileArgs) => {
  if (!url) {
    return;
  }

  const filename = buildRequestPdfFilename({ requestId, formNumber });
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
