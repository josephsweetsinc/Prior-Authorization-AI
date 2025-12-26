'use client';

import { useGetCurrentUserQuery } from '@/services';

import { AdminMetrics } from './AdminMetrics';
import { ProviderMetrics } from './ProviderMetrics';
import { MetricsListSkeleton } from './skeletons/MetricsListSkeleton';

export const RequestsSummary = () => {
  const { data: currentUser, isLoading } = useGetCurrentUserQuery();

  if (isLoading) {
    return <MetricsListSkeleton />;
  }

  if (currentUser?.role === 'admin') {
    return <AdminMetrics />;
  }

  return <ProviderMetrics />;
};
