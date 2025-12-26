'use client';

import { useGetCurrentUserQuery } from '@/services';
import { useGetAdminAnalytics } from '@/services/request-analytics';

import { DenialReasons } from './DenialReasons';
import { RecentActivity } from './RecentActivity';
import { RequestsAnalyticsSkeleton } from './RequestsAnalyticsSkeleton';

export const DecisionInsights = () => {
  const { data: currentUser, isLoading: userLoading } =
    useGetCurrentUserQuery();
  const { analytics, isLoading: analyticsLoading } = useGetAdminAnalytics();

  const isLoading = userLoading || analyticsLoading;

  if (isLoading) {
    return <RequestsAnalyticsSkeleton />;
  }

  if (!currentUser || currentUser.role === 'provider') {
    return;
  }

  return (
    <section className='flex flex-wrap items-stretch gap-5'>
      <RecentActivity
        data={analytics.recentActivity}
        className='shrink grow basis-[288px]'
      />
      <DenialReasons
        data={analytics.denialReasons}
        className='shrink grow basis-[288px]'
      />
    </section>
  );
};
