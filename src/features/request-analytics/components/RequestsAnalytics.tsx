'use client';

import { useGetCurrentUserQuery } from '@/services';

import { AdminAnalytics } from './AdminAnalytics';
import { ProviderAnalytics } from './ProviderAnalytics';
import { RequestsAnalyticsSkeleton } from './RequestsAnalyticsSkeleton';

export const RequestsAnalytics = () => {
  const { data: currentUser, isLoading } = useGetCurrentUserQuery();

  if (isLoading) {
    return <RequestsAnalyticsSkeleton />;
  }

  if (currentUser?.role === 'admin') {
    return <AdminAnalytics />;
  }

  return <ProviderAnalytics />;
};
