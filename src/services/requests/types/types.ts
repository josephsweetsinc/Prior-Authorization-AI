import { type RequestStatus } from '@/services/dashboard';

export type AuthorizationRequestsDateFilter =
  | 'all'
  | 'today'
  | '7-days'
  | '30-days'
  | '90-days'
  | 'year';

export type AuthorizationRequestsStatusFilter = RequestStatus | 'all';

export interface AuthorizationRequestsFilters {
  searchQuery: string;
  status: AuthorizationRequestsStatusFilter;
  date: AuthorizationRequestsDateFilter;
}

export interface AuthorizationRequest {
  id: number;
  user_id: number;
  patient_first_name: string;
  patient_last_name: string;
  primary_diagnosis: string;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
}

export interface AuthorizationRequestsResponse {
  items: AuthorizationRequest[];
  page: number;
  total: number;
  showing: number;
  total_pages: number;
}

export interface AuthorizationRequestsParams {
  page?: number;
  search?: string;
  status?: RequestStatus;
  days?: number;
}

export interface SearchRequestsByPatientParams {
  patient_id?: string | null;
  patient_name?: string | null;
}

export interface SearchRequestsByPatientResponse {
  request_ids: number[];
}

export type TransportationType =
  | 'ambulance'
  | 'wheelchair'
  | 'stretcher'
  | 'bls'
  | 'als'
  | 'cct';

export type AmbulatoryStatus = 'ambulatory' | 'non-ambulatory';
export interface IRequest {
  id: number;
  user_id: number;
  form_number: string;
  patient_first_name: string;
  patient_last_name: string;
  patient_date_of_birth: string;
  ambulatory_status: AmbulatoryStatus;
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

export type CompletionStatusOverall = 'missing' | 'incomplete' | 'complete';

export interface CompletionStatus {
  overall_status: CompletionStatusOverall;
  missing_fields: string[];
  missing_documents: string[];
  can_submit: boolean;
}

export interface IRequestDetails extends IRequest {
  updated_at: string;
  status_history: IStatus[];
  documents: IDocument[];
  completion_status?: CompletionStatus;
}

export type RequestUpdatePayload = {
  transportation_type?: TransportationType;
  patient_first_name?: string;
  patient_last_name?: string;
  patient_date_of_birth?: string;
  patient_id?: string;
  date_of_transport?: string;
  time_of_transport?: string;
  pickup_address?: string;
  destination_address?: string;
  primary_diagnosis?: string;
  medical_justification?: string;
  form_number?: string;
  reviewer_id?: number;
  ambulatory_status?: AmbulatoryStatus;
  oxygen_required?: boolean;
  ordering_physician?: string;
  physician_phone?: string;
  denial_reason?: string;
  denial_notes?: string;
};

export interface IRequestHistoryResponse {
  items: IRequest[];
  page: number;
  total: number;
  showing: number;
  total_pages: number;
}

export interface IRequestHistoryParams {
  page?: number;
  search?: string;
  status?: RequestStatus;
  days?: number;
}
