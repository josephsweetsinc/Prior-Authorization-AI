import {
  type IExtractedData,
  type IUploadAndExtractionResult,
} from '@/services/new-request';

import { type FormState } from '../info-form';

export type INewRequestState = {
  extractedData: Partial<IExtractedData> | null;
  extractionResult: IUploadAndExtractionResult | null;
  form: FormState | null;
};
