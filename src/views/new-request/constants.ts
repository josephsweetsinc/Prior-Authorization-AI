export type InfoStepOverallStatus = 'missing' | 'incomplete' | 'complete';

export const INFO_STEP_STATUS_CONFIG: Record<
  InfoStepOverallStatus,
  { title: string; description: string }
> = {
  complete: {
    title: 'Document Validated',
    description:
      'The AI has successfully extracted and validated all required information from this document.',
  },
  incomplete: {
    title: 'Document Incomplete',
    description:
      'The document was uploaded, but some required information is missing or unclear.',
  },
  missing: {
    title: 'Document Missing',
    description:
      'Verification of Medical Necessity / Physician Signature has not been uploaded yet.',
  },
};
