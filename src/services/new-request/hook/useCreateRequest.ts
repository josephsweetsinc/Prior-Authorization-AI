import { useSelector } from 'react-redux';

import { type NewRequestState, type FormState } from '@/features/new-request';

import { useCreateAmbulanceRequestMutation } from '../api';
import { selectNewRequest } from '../api/selectors';

export type CreateRequestParams = {
  fileIds?: number[];
  form?: FormState | null;
};

export type CreateRequestBody = {
  file_ids: number[];
  transportation_type: string;
  patient_first_name: string;
  patient_last_name: string;
  patient_date_of_birth: string;
  patient_id: string;
  date_of_transport: string;
  time_of_transport: string;
  pickup_address: string;
  destination_address: string;
  primary_diagnosis: string;
  medical_justification: string;
  form_number: string;
};

const mapExtractedToFormState = (
  v?: Record<string, unknown> | null,
): FormState | null => {
  if (!v) {
    return null;
  }

  return {
    transportationType: String(v.transportation_type ?? ''),
    patientFirstName: String(v.patient_first_name ?? ''),
    patientLastName: String(v.patient_last_name ?? ''),
    patientDob: String(v.patient_date_of_birth ?? ''),
    patientId: String(v.patient_id ?? ''),
    dateOfTransport: String(v.date_of_transport ?? ''),
    timeOfTransport: String(v.time_of_transport ?? ''),
    pickupAddress: String(v.pickup_address ?? ''),
    destinationAddress: String(v.destination_address ?? ''),
    primaryDiagnosis: String(v.primary_diagnosis ?? ''),
    medicalJustification: String(v.medical_justification ?? ''),
    formNumber: String(v.form_number ?? ''),
  } as FormState;
};

const extractFileIdsFromStored = (
  stored?: NewRequestState | undefined,
): number[] => {
  if (!stored) {
    return [];
  }

  const extractionResult = stored.extractionResult ?? null;
  const extractedData = stored.extractedData ?? null;

  let fromExtractionResult: unknown = null;
  if (extractionResult && typeof extractionResult === 'object') {
    const er = extractionResult as Record<string, unknown>;
    fromExtractionResult = er['files'] ?? er['files_uploaded'] ?? null;
  }

  let fromExtracted: unknown = null;
  if (extractedData && typeof extractedData === 'object') {
    const ed = extractedData as Record<string, unknown>;
    fromExtracted = ed['files'] ?? null;
  }

  let maybeFiles: unknown = null;
  if (Array.isArray(fromExtractionResult)) {
    maybeFiles = fromExtractionResult;
  } else if (Array.isArray(fromExtracted)) {
    maybeFiles = fromExtracted;
  }

  const ids: number[] = [];
  if (Array.isArray(maybeFiles)) {
    for (const f of maybeFiles) {
      if (f && typeof f === 'object') {
        const fileObj = f as Record<string, unknown>;
        const idVal = fileObj['id'] ?? fileObj['file_id'] ?? fileObj['fileId'];

        if (
          idVal !== undefined &&
          idVal !== null &&
          (typeof idVal === 'string' || typeof idVal === 'number')
        ) {
          const n = Number(idVal);
          if (!Number.isNaN(n)) {
            ids.push(n);
          }
        }
      }
    }
  }

  return ids;
};

export const useCreateRequest = () => {
  const stored = useSelector(selectNewRequest);
  const [createMutation, mutationResult] = useCreateAmbulanceRequestMutation();
  const { isLoading, error, data } = (mutationResult ?? {}) as {
    isLoading?: boolean;
    error?: unknown;
    data?: unknown;
  };

  const buildBody = (params?: CreateRequestParams): CreateRequestBody => {
    const storedFormRaw = stored?.form ?? null;
    const mappedFromExtracted = mapExtractedToFormState(
      stored?.extractedData ?? null,
    );

    const formOverride =
      params?.form ??
      (storedFormRaw && typeof storedFormRaw === 'object'
        ? (storedFormRaw as FormState)
        : mappedFromExtracted);

    const fileIdsOverride = params?.fileIds ?? extractFileIdsFromStored(stored);

    const form = formOverride as FormState | null;

    return {
      file_ids: fileIdsOverride ?? [],
      transportation_type: form?.transportationType ?? '',
      patient_first_name: form?.patientFirstName ?? '',
      patient_last_name: form?.patientLastName ?? '',
      patient_date_of_birth: form?.patientDob ?? '',
      patient_id: form?.patientId ?? '',
      date_of_transport: form?.dateOfTransport ?? '',
      time_of_transport: form?.timeOfTransport ?? '',
      pickup_address: form?.pickupAddress ?? '',
      destination_address: form?.destinationAddress ?? '',
      primary_diagnosis: form?.primaryDiagnosis ?? '',
      medical_justification: form?.medicalJustification ?? '',
      form_number: form?.formNumber ?? '',
    };
  };

  const createRequest = async (params?: CreateRequestParams) => {
    const body = buildBody(params);
    return createMutation(body).unwrap();
  };

  return {
    createRequest,
    isLoading,
    error,
    data,
  };
};
