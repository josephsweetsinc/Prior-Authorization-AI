import {
  selectProviderDashboard,
  useGetDashboardQuery,
} from '@/services/dashboard';

export const useGetRequestsSummary = () => {
  const { data, isLoading, error, refetch } = useGetDashboardQuery();

  const providerStatistics = selectProviderDashboard(data);

  if (!providerStatistics || !providerStatistics.summary) {
    const fallbackSummary = {
      total_requests: 0,
      pending_review: 0,
      approved: 0,
      approval_rate: 0,
    };

    return { summary: fallbackSummary, isLoading, error, refetch };
  }

  return { summary: providerStatistics?.summary, isLoading, error, refetch };
};
