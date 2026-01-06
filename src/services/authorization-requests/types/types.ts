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
