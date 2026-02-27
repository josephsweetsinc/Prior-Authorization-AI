export const DENIAL_REASON_MAP: Record<string, string> = {
  invalid_request_type: 'Incomplete request type',
  transport_level_not_medically_necessary:
    'Transport level not medically necessary',
  missing_physician_signature: 'Missing physician signature',
  duplicate_request: 'Duplicate request',
  incomplete_medical_documentation: 'Incomplete medical documentation',
  outdated_or_expired_documents: 'Outdated or expired documents',
  other_reason: 'Other reason',
  incorrect_or_inconsistent_patient_information:
    'Incorrect or Inconsistent Patient Information',
  invalid_diagnosis_code: 'Invalid Diagnosis Code',
};
