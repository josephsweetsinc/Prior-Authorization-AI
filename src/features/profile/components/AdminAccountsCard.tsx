'use client';

import { useGetAdminUsersStatsQuery } from '@/services/stats';
import { Window } from '@/shared/components';

import { uniqueAdminEntries } from '../utils/uniqueAdminEntries';

const FALLBACK_VALUE = '—';

export const AdminAccountsCard = () => {
  const { data } = useGetAdminUsersStatsQuery();
  const admins = data?.recent_admins ?? [];
  const primaryEntry =
    data?.full_name || data?.email
      ? [
          {
            full_name: data?.full_name || FALLBACK_VALUE,
            email: data?.email || FALLBACK_VALUE,
          },
        ]
      : [];
  const entries = [...primaryEntry, ...admins];
  const uniqueEntries = uniqueAdminEntries(entries);

  return (
    <Window className='p-5'>
      <div className='space-y-6'>
        <h3 className='text-xl font-bold text-[#232323]'>Admin Accounts</h3>
        <div className='m-0 flex items-center justify-between gap-6 border-b border-[rgba(224,224,224,0.35)] pb-3 text-sm font-medium tracking-[0.2em] text-[#A3AED0]'>
          <span>NAME</span>
          <span>EMAIL</span>
        </div>
        <div className='custom-scrollbar max-h-[180px] overflow-y-scroll pr-2'>
          <div className='divide-y divide-[#F1F1F1]'>
            {uniqueEntries.length === 0 ? (
              <div className='pt-3 pb-0 text-sm text-[#4A5568]'>
                No admin accounts found.
              </div>
            ) : (
              uniqueEntries.map((admin, index) => (
                <div
                  key={`${admin.email}-${index}`}
                  className='flex flex-wrap items-center justify-between gap-6 py-4 text-[#4A5568] last:pb-0'
                >
                  <span className='font-bold text-[#4A5568]'>
                    {admin.full_name || FALLBACK_VALUE}
                  </span>
                  <span className='font-medium'>
                    {admin.email || FALLBACK_VALUE}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Window>
  );
};
