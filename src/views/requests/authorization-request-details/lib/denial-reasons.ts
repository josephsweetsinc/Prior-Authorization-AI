export const DenialReason = {
  DuplicateRequest: 'duplicate_request',
  InvalidRequestType: 'invalid_request_type',
  InvalidDiagnosisCode: 'invalid_diagnosis_code',
  MissingPhysicianSignature: 'missing_physician_signature',
  TransportLevelNotMedicallyNecessary:
    'transport_level_not_medically_necessary',
  IncompleteMedicalDocumentation: 'incomplete_medical_documentation',
  OutdatedOrExpiredDocuments: 'outdated_or_expired_documents',
  IncorrectOrInconsistentPatientInformation:
    'incorrect_or_inconsistent_patient_information',
  OtherReason: 'other_reason',
} as const;

export type DenialReason = (typeof DenialReason)[keyof typeof DenialReason];

export const DENIAL_REASON_OPTIONS = [
  { value: DenialReason.DuplicateRequest, label: 'Duplicate Request' },
  { value: DenialReason.InvalidRequestType, label: 'Invalid Request Type' },
  { value: DenialReason.InvalidDiagnosisCode, label: 'Invalid Diagnosis Code' },
  {
    value: DenialReason.MissingPhysicianSignature,
    label: 'Missing Physician Signature',
  },
  {
    value: DenialReason.TransportLevelNotMedicallyNecessary,
    label: 'Transport Level Not Medically Necessary',
  },
  {
    value: DenialReason.IncompleteMedicalDocumentation,
    label: 'Incomplete Medical Documentation',
  },
  {
    value: DenialReason.OutdatedOrExpiredDocuments,
    label: 'Outdated or Expired Documents',
  },
  {
    value: DenialReason.IncorrectOrInconsistentPatientInformation,
    label: 'Incorrect or Inconsistent Patient Information',
  },
  { value: DenialReason.OtherReason, label: 'Other Reason' },
];
