import Link from 'next/link';

import { Skeleton } from '@/shared/components';

import { type NotificationsFeedProps } from '../types/types';
import { formatDate } from '../utils';

export const NotificationsFeed = ({
  notifications,
  isLoading,
  onNotificationClick,
}: NotificationsFeedProps) => {
  if (isLoading) {
    return (
      <div className='space-y-3'>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className='rounded-xl border bg-white p-5'>
            <div className='flex items-start justify-between gap-4'>
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-5 w-1/3' />
                <Skeleton className='h-4 w-full' />
              </div>
              <Skeleton className='h-4 w-20' />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className='flex min-h-[200px] items-center justify-center rounded-xl border bg-white p-8'>
        <p className='text-gray-dark text-sm'>No notifications found</p>
      </div>
    );
  }

  return (
    <div className='space-y-3'>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          onClick={() => onNotificationClick?.(notification.id)}
          className={`rounded-xl border bg-white p-5 transition-all hover:shadow-md ${
            onNotificationClick ? 'cursor-pointer' : ''
          } ${notification.category === 'requirements' ? 'border-l-4 border-l-blue-500' : ''}`}
        >
          <div className='space-y-1'>
            <div className='flex items-center gap-2'>
              <h3 className='text-base font-bold'>{notification.title}</h3>
              <Link
                href={`/requests/${notification.request_id}`}
                className='text-base font-bold text-[#047CB4] underline'
              >
                #{notification.request_id}
              </Link>
              {!notification.is_read && (
                <span className='h-2 w-2 rounded-full bg-blue-500' />
              )}
            </div>
            <div className='flex items-center justify-between gap-2'>
              <p className='text-gray-dark text-sm font-normal'>
                {notification.message}
              </p>
              <span className='text-sm font-normal text-nowrap text-[#A3AED0]'>
                {formatDate(notification.created_at)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
