import { type UserRoles } from '@/services/auth';
import {
  selectAdminDashboard,
  selectProviderDashboard,
  useGetDashboardQuery,
} from '@/services/dashboard';

type Params = {
  role?: UserRoles;
};

export const useGetRecentRequests = ({ role }: Params) => {
  const { data, isLoading, error, refetch } = useGetDashboardQuery();

  if (!role) {
    return { requests: [], isLoading, error, refetch };
  }

  const dashboard =
    role === 'admin'
      ? selectAdminDashboard(data)
      : selectProviderDashboard(data);

  return {
    requests: dashboard?.recent_requests ?? [],
    isLoading,
    error,
    refetch,
  };
};
