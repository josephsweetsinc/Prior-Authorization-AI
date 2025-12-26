import {
  selectProviderDashboard,
  useGetDashboardQuery,
} from '@/services/dashboard';

export const useGetProviderAnalytics = () => {
  const { data, isLoading, error, refetch } = useGetDashboardQuery();

  const dashboard = selectProviderDashboard(data);

  const analytics = {
    requestsInProgress: dashboard?.requests_in_progress.items ?? [],
    dailySubmittedRequests: dashboard?.daily_submitted_requests ?? {
      total: 0,
      change_percent: 0,
      days: [],
    },
  };

  return { analytics, isLoading, error, refetch };
};
