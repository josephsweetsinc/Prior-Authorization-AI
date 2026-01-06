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
  patient_first_name: string;
  patient_last_name: string;
  primary_diagnosis: string;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
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
  patient_id: string;
  pickup_address: string;
  destination_address: string;
  transportation_type: TransportationType;
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
