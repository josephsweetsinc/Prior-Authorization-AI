import { type MediaItem } from '@/shared/components';

export interface IFile {
  id: number;
  filename: string;
  file_size: number;
  content_type: string;
  file_url: string;
}

export type IExtractionRequest = {
  file_ids: number[];
};

export interface IRequestData {
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

export type IExtractedData = {
  request_id: number;
  extracted_data: IRequestData;
  is_complete?: boolean;
};

export interface IUploadAndExtractionResult extends IExtractedData {
  files: MediaItem[];
}
