import { NewRequestLink } from '@/features/new-request';
import { RecentRequests } from '@/features/recent-requests';
import {
  DecisionInsights,
  RequestsAnalytics,
} from '@/features/request-analytics';
import { RequestsSummary } from '@/features/request-totals';
import { TitleAndDesc } from '@/shared/components';

export const Dashboard = () => {
  return (
    <main className='space-y-5'>
      <div className='flex flex-wrap items-center justify-between gap-6'>
        <TitleAndDesc
          title='Main Dashboard'
          subtitle='Welcome back, manage your authorization requests'
        />

        <NewRequestLink />
      </div>
      <RequestsSummary />
      <RecentRequests />
      <RequestsAnalytics />
      <DecisionInsights />
    </main>
  );
};
