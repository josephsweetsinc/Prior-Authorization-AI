import {
  formToExtracted,
  type IUploadAndExtractionResult,
  type IExtractedData,
} from '@/services';

import { type FormState } from '../info-form';

interface Params {
  extractedData: Partial<IExtractedData> | null;
  storedForm: Partial<FormState> | null;
  draftExtractionResult: IUploadAndExtractionResult | null;
  includeDraft?: boolean;
}

export const resolveInitialValues = ({
  extractedData,
  storedForm,
  draftExtractionResult,
  includeDraft = false,
}: Params): Partial<IExtractedData> | null => {
  if (includeDraft && draftExtractionResult) {
    return draftExtractionResult.extracted_data;
  }

  if (storedForm) {
    return formToExtracted(storedForm);
  }

  if (extractedData) {
    return extractedData;
  }

  return null;
};
