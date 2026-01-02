import { type RequestStatus } from '@/services/dashboard';

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

export interface IRequestHistoryResponse {
  items: IRequest[];
  next_cursor: number;
  has_more: boolean;
}
