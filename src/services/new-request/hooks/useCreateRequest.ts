import { useSelector } from 'react-redux';

import { useCreateAmbulanceRequestMutation } from '../api';
import { selectNewRequest } from '../api/selectors';
import { type ICreateRequestParams } from '../types';
import { buildRequestBody } from '../utils/request-body';

export const useCreateRequest = () => {
  const [createMutation, mutationResult] = useCreateAmbulanceRequestMutation();
  const stored = useSelector(selectNewRequest);
  const { isLoading, error, data } = (mutationResult ?? {}) as {
    isLoading?: boolean;
    error?: unknown;
    data?: unknown;
  };

  const createRequest = async (params?: ICreateRequestParams) => {
    const body = buildRequestBody(stored, params);
    return createMutation(body).unwrap();
  };

  return {
    createRequest,
    isLoading,
    error,
    data,
  };
};
