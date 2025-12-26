'use client';

import { useGetProviderAnalytics } from '@/services/request-analytics';

import { DailySubmittedRequests } from './DailySubmittedRequests';
import { ProviderAnalyticsSkeleton } from './ProviderAnalyticsSkeleton';
import { RequestsInProgress } from './RequestsInProgress';

export const Analytics = () => {
  const { analytics, isLoading } = useGetProviderAnalytics();

  if (isLoading) {
    return <ProviderAnalyticsSkeleton />;
  }

  return (
    <section className='flex flex-wrap items-stretch gap-5'>
      <RequestsInProgress
        data={analytics.requestsInProgress}
        className='shrink grow basis-[288px]'
      />
      <DailySubmittedRequests
        data={analytics.dailySubmittedRequests}
        className='shrink grow basis-[288px]'
      />
    </section>
  );
};
