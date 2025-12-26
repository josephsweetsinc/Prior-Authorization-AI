'use client';

import { useGetAdminAnalytics } from '@/services/request-analytics';

import { RequestsAnalyticsSkeleton } from './RequestsAnalyticsSkeleton';
import { RequestsByStatusChart } from './RequestsByStatus';
import { TimeDistribution } from './TimeDistribution';

export const AdminAnalytics = () => {
  const { analytics, isLoading } = useGetAdminAnalytics();

  if (isLoading) {
    return <RequestsAnalyticsSkeleton />;
  }

  return (
    <section className='flex flex-wrap items-stretch gap-5'>
      <TimeDistribution
        data={analytics.processingTimeDistribution}
        className='shrink grow basis-[288px]'
      />
      <RequestsByStatusChart
        data={analytics.requestsByStatus}
        className='shrink grow basis-[288px]'
      />
    </section>
  );
};
