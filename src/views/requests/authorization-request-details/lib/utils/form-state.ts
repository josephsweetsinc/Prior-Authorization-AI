import { type IRequestDetails } from '@/services/requests';

import { type RequestDetailsFormState } from '../types';

import { buildRequestDetailsFormState } from './builders';

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
  return !formState || formState.requestId !== data.id
    ? baseState
    : formState.state;
};
