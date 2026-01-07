import { type INewRequestState } from '@/features/new-request';

import { type ICreateRequestBody, type ICreateRequestParams } from '../types';

import {
  extractedToForm,
  extractFileIdsFromStored,
  formToExtracted,
} from './transform';

export const buildRequestBody = (
  stored?: INewRequestState,
  params?: ICreateRequestParams,
): Partial<ICreateRequestBody> | null => {
  if (!stored) {
    return null;
  }

  if (!stored.extractedData || !stored.extractionResult) {
    return null;
  }

  const form =
    params?.form ?? stored.form ?? extractedToForm(stored.extractedData);

  if (!form) {
    return null;
  }

  const fileIds = params?.fileIds ?? extractFileIdsFromStored(stored);

  const transformedData = formToExtracted(form);

  return {
    request_id: stored.extractionResult.request_id,
    file_ids: fileIds,
    ...transformedData,
  };
};
