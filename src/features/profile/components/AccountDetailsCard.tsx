import { IdCard, ClockFading, CalendarDays } from 'lucide-react';

import { useGetCurrentUserQuery } from '@/services/auth/api/auth-api-service';
import { Window } from '@/shared/components';

const FALLBACK_VALUE = '—';

const formatDate = (value?: string | null) => {
  if (!value) {
    return FALLBACK_VALUE;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return FALLBACK_VALUE;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
};

const formatDateTime = (value?: string | null) => {
  if (!value) {
    return FALLBACK_VALUE;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return FALLBACK_VALUE;
  }

  const datePart = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(date);

  const timePart = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);

  return `${datePart} at ${timePart}`;
};

export const AccountDetailsCard = () => {
  const { data: currentUser } = useGetCurrentUserQuery();
  const fullName = [currentUser?.name, currentUser?.surname]
    .filter(Boolean)
    .join(' ');
  const details = [
    {
      label: 'Full Name',
      value: fullName || currentUser?.email || FALLBACK_VALUE,
      icon: IdCard,
    },
    {
      label: 'Professional ID',
      value: currentUser?.organization?.professional_id || FALLBACK_VALUE,
      icon: IdCard,
    },
    {
      label: 'Last Login',
      value: formatDateTime(currentUser?.last_login ?? null),
      icon: ClockFading,
    },
    {
      label: 'Account Created',
      value: formatDate(currentUser?.created_at ?? null),
      icon: CalendarDays,
    },
  ] as const;

  return (
    <Window className='p-5'>
      <div className='space-y-6'>
        <h3 className='text-xl font-bold text-black'>Account Details</h3>
        <div className='divide-y divide-neutral-100'>
          {details.map((detail) => (
            <div
              key={detail.label}
              className='flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0'
            >
              <div className='flex items-center gap-2'>
                <detail.icon className='text-status-info size-4' />
                <span className='text-gray-dark'>{detail.label}</span>
              </div>
              <span className='font-medium text-black'>{detail.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
};
