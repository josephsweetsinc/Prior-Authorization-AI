import { useSelector } from 'react-redux';

import { type FormState } from '@/features/new-request';

import { useCreateAmbulanceRequestMutation } from '../api';
import { selectNewRequest } from '../api/selectors';
import {
  extractedToForm,
  extractFileIdsFromStored,
  formToExtracted,
} from '../utils';

export interface ICreateRequestParams {
  fileIds?: number[];
  form?: FormState | null;
}

export interface ICreateRequestBody {
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
}

export const useCreateRequest = () => {
  const stored = useSelector(selectNewRequest);
  const [createMutation, mutationResult] = useCreateAmbulanceRequestMutation();
  const { isLoading, error, data } = (mutationResult ?? {}) as {
    isLoading?: boolean;
    error?: unknown;
    data?: unknown;
  };

  const buildBody = (params?: ICreateRequestParams): ICreateRequestBody => {
    const form: Record<string, unknown> | null =
      params?.form ??
      stored?.form ??
      extractedToForm(stored?.extractedData ?? null);

    const fileIds = params?.fileIds ?? extractFileIdsFromStored(stored);

    const transformedData = formToExtracted(form as FormState);

    return {
      file_ids: fileIds,
      ...transformedData,
    } as ICreateRequestBody;
  };

  const createRequest = async (params?: ICreateRequestParams) => {
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
