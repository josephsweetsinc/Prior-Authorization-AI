import { type RequestStatus } from '@/services/dashboard';

export type TransportationType =
  | 'ambulance'
  | 'wheelchair'
  | 'stretcher'
  | 'bls'
  | 'als'
  | 'cct';
export interface IRequest {
  id: number;
  user_id: number;
  form_number: string;
  patient_first_name: string;
  patient_last_name: string;
  patient_date_of_birth: string;
  ambulatory_status: string;
  oxygen_required: boolean;
  primary_diagnosis: string;
  medical_justification: string;
  ordering_physician: string;
  physician_phone: string;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
  patient_id: string;
  pickup_address: string;
  destination_address: string;
  transportation_type: TransportationType;
  date_of_transport: string;
  time_of_transport: string;
  ai_accuracy: number;
}

export interface IStatus {
  id: number;
  request_id: number;
  status: RequestStatus;
  notes: string | null;
  created_at: string;
}

export interface IDocument {
  id: number;
  filename: string;
  file_size: number;
  content_type: string;
  download_url: string;
}

export interface IRequestDetails extends IRequest {
  updated_at: string;
  status_history: IStatus[];
  documents: IDocument[];
}

export interface IRequestHistoryResponse {
  items: IRequest[];
  page: number;
  total: number;
  showing: number;
  total_pages: number;
}

export interface IRequestHistoryParams {
  page: number;
  search: string;
  status?: RequestStatus;
  days?: number;
}
