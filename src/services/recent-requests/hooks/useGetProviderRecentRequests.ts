import {
  selectProviderDashboard,
  useGetDashboardQuery,
} from '@/services/dashboard';

export const useGetProviderRecentRequests = () => {
  const { data, isLoading, error, refetch } = useGetDashboardQuery();

  const providerStatistics = selectProviderDashboard(data);

  if (!providerStatistics || !providerStatistics.recent_requests) {
    return { requests: [], isLoading, error, refetch };
  }

  return {
    requests: providerStatistics?.recent_requests,
    isLoading,
    error,
    refetch,
  };
};
