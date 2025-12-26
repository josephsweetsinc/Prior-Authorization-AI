import {
  selectAdminDashboard,
  useGetDashboardQuery,
} from '@/services/dashboard';

export const useGetAdminAnalytics = () => {
  const { data, isLoading, error, refetch } = useGetDashboardQuery();

  const dashboard = selectAdminDashboard(data);

  const analytics = {
    requestsStatuses: dashboard?.requests_statuses ?? {
      approved_requests: 0,
      approved_requests_change_percent: 0,

      pending_review: 0,
      pending_avg_wait_time_hours: 0,

      denied_requests: 0,
      denial_rate_percent: 0,

      ai_accuracy: 0,
    },
    processingTimeDistribution: dashboard?.processing_time_distribution ?? [],
    requestsByStatus: dashboard?.requests_by_status ?? [],
    recentRequests: dashboard?.recent_requests ?? [],
    recentActivity: dashboard?.recent_activity ?? [],
    denialReasons: dashboard?.denial_reasons ?? [],
  };

  return { analytics, isLoading, error, refetch };
};
