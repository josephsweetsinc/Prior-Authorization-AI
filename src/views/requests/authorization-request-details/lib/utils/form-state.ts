import { type IRequestDetails } from '@/services/requests';
import { phonePattern } from '@/shared/lib/validations/schemas';

import { type RequestDetailsFormState } from '../types';

import { buildRequestDetailsFormState } from './builders';

const PHONE_ERROR_MESSAGE = 'Phone can contain only digits, spaces, and ()+-';

const getBaseFormState = (
  data: IRequestDetails,
  defaultFormState: RequestDetailsFormState | null,
) => defaultFormState ?? buildRequestDetailsFormState(data);

export const resolveFormState = (params: {
  data: IRequestDetails;
  formState: { requestId: number; state: RequestDetailsFormState } | null;
  defaultFormState: RequestDetailsFormState | null;
}) => {
  const { data, formState, defaultFormState } = params;
  const baseState = getBaseFormState(data, defaultFormState);

  if (!formState) {
    return baseState;
  }

  if (formState.requestId !== data.id) {
    return baseState;
  }

  return formState.state;
};

export const getPhysicianPhoneError = (formState: RequestDetailsFormState) => {
  const value = formState.physicianPhone.trim();
  if (!value) {
    return '';
  }

  if (phonePattern.test(value)) {
    return '';
  }

  return PHONE_ERROR_MESSAGE;
};
