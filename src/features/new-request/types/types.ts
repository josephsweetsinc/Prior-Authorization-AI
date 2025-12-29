import {
  type IUploadAndExtractionResult,
  type IExtractedData,
} from '@/services';

import { type FormState } from '../info-form';

export type INewRequestState = {
  extractedData: IExtractedData['extracted_data'] | null;
  extractionResult: IUploadAndExtractionResult | null;
  form: FormState | null;
};
