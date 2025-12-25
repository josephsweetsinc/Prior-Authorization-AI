export type RequestStatus = 'approved' | 'pending_review' | 'denied';

export interface RecentRequest {
  id: number;
  patient_full_name: string;
  diagnosis: string;
  status: RequestStatus;
  // ? ISO date
  created_at: string;
}

export interface DateCount {
  // ? YYYY-MM-DD
  date: string;
  count: number;
}

export interface ProviderSummary {
  total_requests: number;
  pending_review: number;
  approved: number;
  approval_rate: number;
}

export interface ProviderRequestProgress {
  full_name: string;
  status: RequestStatus;
  progress: number;
}

export interface ProviderRequestsInProgress {
  items: ProviderRequestProgress[];
}

export interface ProviderDailySubmittedRequests {
  total: number;
  change_percent: number;
  days: DateCount[];
}

export interface ProviderResponse {
  summary: ProviderSummary;
  recent_requests: RecentRequest[];
  requests_in_progress: ProviderRequestsInProgress;
  daily_submitted_requests: ProviderDailySubmittedRequests;
}

export interface DashboardResponse {
  provider: ProviderResponse;
}
