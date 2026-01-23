const DEFAULT_REQUEST_PDF_NAME = 'request';

type BuildRequestPdfFilenameArgs = {
  requestId: number;
  formNumber?: string | null;
};

export const buildRequestPdfFilename = ({
  requestId,
  formNumber,
}: BuildRequestPdfFilenameArgs) => {
  const baseName = formNumber?.trim() || DEFAULT_REQUEST_PDF_NAME;
  const safeBaseName = baseName.replace(/[^a-zA-Z0-9-_]+/g, '-');

  if (safeBaseName.length > 0) {
    return `${safeBaseName}-${requestId}.pdf`;
  }

  return `${DEFAULT_REQUEST_PDF_NAME}-${requestId}.pdf`;
};
