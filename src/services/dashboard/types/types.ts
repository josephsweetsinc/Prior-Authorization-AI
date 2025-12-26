export type RequestStatus = 'approved' | 'pending' | 'processing' | 'denied';

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

export interface RequestsByStatus {
  status: RequestStatus;
  count: number;
  percentage: number;
}

export interface ProcessingTimeDistribution {
  // ? YYYY-MM-DD
  date: string;
  approved_count: number;
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

export interface AdminRequestsStatuses {
  approved_requests: number;
  approved_requests_change_percent: number;

  pending_review: number;
  pending_avg_wait_time_hours: number;

  denied_requests: number;
  denial_rate_percent: number;

  ai_accuracy: number;
}

export interface ProviderResponse {
  summary: ProviderSummary;
  recent_requests: RecentRequest[];
  requests_in_progress: ProviderRequestsInProgress;
  daily_submitted_requests: ProviderDailySubmittedRequests;
}

export interface RecentActivity {
  request_id: number;
  status: RequestStatus;
  author_name: string;
  // ? ISO date
  created_at: string;
}

export interface DenialReason {
  reason: string;
  count: number;
}

export interface AdminResponse {
  requests_statuses: AdminRequestsStatuses;
  processing_time_distribution: ProcessingTimeDistribution[];
  requests_by_status: RequestsByStatus[];
  recent_requests: RecentRequest[];
  recent_activity: RecentActivity[];
  denial_reasons: DenialReason[];
}

export interface DashboardResponse {
  provider: ProviderResponse;
  admin: AdminResponse;
}
