import { IdCard, ClockFading, CalendarDays } from 'lucide-react';

import { Window } from '@/shared/components';

const details = [
  {
    label: 'Full Name',
    value: 'Joe Dohn',
    icon: IdCard,
  },
  {
    label: 'Professional ID',
    value: 'EMS-2024-78432',
    icon: IdCard,
  },
  {
    label: 'Last Login',
    value: 'Nov 28, 2025 at 9:42 AM',
    icon: ClockFading,
  },
  {
    label: 'Account Created',
    value: 'March 15, 2023',
    icon: CalendarDays,
  },
] as const;

export const AccountDetailsCard = () => {
  return (
    <Window className='p-5'>
      <div className='space-y-6'>
        <h3 className='text-xl font-bold text-[#232323]'>Account Details</h3>
        <div className='divide-y divide-[#F5F7FA]'>
          {details.map((detail) => (
            <div
              key={detail.label}
              className='flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0'
            >
              <div className='flex items-center gap-2'>
                <detail.icon className='text-status-info size-4' />
                <span className='text-[#4A5568]'>{detail.label}</span>
              </div>
              <span className='font-medium text-[#232323]'>{detail.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
};
