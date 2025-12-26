import {
  selectAdminDashboard,
  useGetDashboardQuery,
} from '@/services/dashboard';

export const useGetRequestsByStatus = () => {
  const { data, isLoading, error, refetch } = useGetDashboardQuery();

  const dashboard = selectAdminDashboard(data);

  if (!dashboard || !dashboard.requests_statuses) {
    const fallbackSummary = {
      approved_requests: 0,
      approved_requests_change_percent: 0,

      pending_review: 0,
      pending_avg_wait_time_hours: 0,

      denied_requests: 0,
      denial_rate_percent: 0,

      ai_accuracy: 0,
    };

    return { kpi: fallbackSummary, isLoading, error, refetch };
  }

  return { kpi: dashboard?.requests_statuses, isLoading, error, refetch };
};
