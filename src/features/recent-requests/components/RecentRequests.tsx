import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { Window } from '@/shared/components';

import RequestsTable from './RequestsTable';

export const RecentRequests = () => {
  return (
    <Window className='space-y-3 p-5'>
      <div className='flex items-center justify-between gap-6'>
        <h2 className='text-brand-dark text-2xl leading-8 font-bold'>
          Recent Requests
        </h2>

        <Link
          className='text-brand-dark flex items-center gap-2 capitalize underline'
          href='/requests-history'
        >
          <span>View all</span>
          <ArrowUpRight className='size-5' />
        </Link>
      </div>
      <RequestsTable />
    </Window>
  );
};
