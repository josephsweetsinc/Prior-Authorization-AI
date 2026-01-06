import { Window } from '@/shared/components';

import RequestsTable from './RequestsTable';
import { ViewAllLink } from './ViewAllLink';

export const RecentRequests = () => {
  return (
    <Window className='space-y-3 p-5'>
      <div className='flex items-center justify-between gap-6'>
        <h2 className='text-brand-dark text-2xl leading-8 font-bold'>
          Recent Requests
        </h2>

        <ViewAllLink />
      </div>
      <RequestsTable />
    </Window>
  );
};
