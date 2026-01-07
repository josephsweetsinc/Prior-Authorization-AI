import { type FormState } from '@/features/new-request';
import { type TransportationType } from '@/services/requests-history';
import { type MediaItem } from '@/shared/components';

export interface IUploadAndExtractionResult extends IExtractionResponse {
  files: MediaItem[];
}

export interface ICreateRequestParams {
  fileIds?: number[];
  form?: FormState | null;
}

export interface ICreateRequestBody {
  request_id: number;
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
  ambulatory_status: AmbulatoryStatus;
  oxygen_required: boolean;
  ordering_physician: string;
  physician_phone: string;
  confidence_score: number;
}

export type IExtractionRequest = {
  file_ids: number[];
};
export type AmbulatoryStatus = 'ambulatory' | 'non-ambulatory';

export interface IExtractedData {
  transportation_type: TransportationType;
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
  ambulatory_status: AmbulatoryStatus;
  oxygen_required: boolean;
  ordering_physician: string;
  physician_phone: string;
  confidence_score: number;
}

export type IExtractionResponse = {
  request_id: number;
  extracted_data: Partial<IExtractedData>;
  is_complete?: boolean;
};
