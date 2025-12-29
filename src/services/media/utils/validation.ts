interface IValidationResult {
  ok: boolean;
  error: string | null;
}

export const validateFile = (
  file: File,
  maxSizeMB: number,
): IValidationResult => {
  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      ok: false,
      error: `File "${file.name}" exceeds ${maxSizeMB}MB.`,
    };
  }

  const allowedExt = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
  const ext = file.name.toLowerCase().split('.').pop();

  if (!ext || !allowedExt.includes(ext)) {
    return {
      ok: false,
      error: 'Unsupported format. Allowed: PDF, DOC, DOCX, XLS, XLSX.',
    };
  }

  return { ok: true, error: null };
};
