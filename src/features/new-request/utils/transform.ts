import type {
  IExtractedData,
  IDocument,
  IRequestDetails,
  IUploadAndExtractionResult,
} from '@/services';
import { type MediaItem } from '@/shared/components';

export function isExtractionComplete(
  extracted: Partial<IExtractedData>,
): boolean {
  return (Object.keys(extracted) as (keyof IExtractedData)[]).every((key) => {
    const value = extracted[key];

    if (typeof value === 'boolean') {
      return true;
    }

    if (typeof value === 'number') {
      return Number.isFinite(value);
    }

    return Boolean(value);
  });
}

export function transformRequestToExtraction(
  request?: IRequestDetails | null,
): IUploadAndExtractionResult | null {
  if (!request) {
    return null;
  }

  const extracted_data: Partial<IExtractedData> = {
    transportation_type: request.transportation_type,
    patient_first_name: request.patient_first_name,
    patient_last_name: request.patient_last_name,
    patient_date_of_birth: request.patient_date_of_birth,
    patient_id: request.patient_id,
    date_of_transport: request.date_of_transport,
    time_of_transport: request.time_of_transport,
    pickup_address: request.pickup_address,
    destination_address: request.destination_address,
    primary_diagnosis: request.primary_diagnosis,
    medical_justification: request.medical_justification,
    form_number: request.form_number,
    ambulatory_status: request.ambulatory_status,
    oxygen_required: request.oxygen_required,
    ordering_physician: request.ordering_physician,
    physician_phone: request.physician_phone,
    confidence_score: request.ai_accuracy,
  };

  const hasDocuments = Boolean(request.documents?.length);
  const isComplete = isExtractionComplete(extracted_data);

  return {
    request_id: request.id,
    extracted_data,
    completion_status: request.completion_status ?? {
      overall_status: hasDocuments
        ? isComplete
          ? 'complete'
          : 'incomplete'
        : 'missing',
      missing_fields: [],
      missing_documents: [],
      can_submit: hasDocuments && isComplete,
    },
    files: transformDocumentsToMediaItems(request.documents),
  };
}

export function transformDocumentsToMediaItems(
  documents?: IDocument[] | null,
): MediaItem[] {
  if (!documents?.length) {
    return [];
  }

  return documents.map((doc) => ({
    id: doc.id,
    url: doc.download_url,
    file_url: doc.download_url,
    name: doc.filename,
    filename: doc.filename,
    size: doc.file_size,
    file_size: doc.file_size,
    content_type: doc.content_type,
  }));
}
