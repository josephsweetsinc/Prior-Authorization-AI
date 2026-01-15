'use client';
import Link from 'next/link';
import { useState } from 'react';

import { RequestDetails } from '@/features/requests-history';
import { cn } from '@/shared/lib/utils';

import { type NotificationFeedItemProps } from '../types';
import { formatDate } from '../utils/formatDate';

export const NotificationFeedItem = ({
  notification,
  onClick,
  isAdmin,
  className = '',
  ...rest
}: NotificationFeedItemProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const shouldShowBlueBorder = isAdmin
    ? !notification.is_read
    : notification.category === 'requirements';

  return (
    <div
      onClick={() => onClick?.(notification.id)}
      className={cn(
        'rounded-xl border bg-white p-5 transition-all hover:shadow-md',
        onClick && 'cursor-pointer',
        shouldShowBlueBorder && 'border-l-4 border-l-blue-500',
        className,
      )}
      {...rest}
    >
      <div className='space-y-1'>
        <div className='flex items-center gap-2'>
          <h3 className='text-base font-bold'>{notification.title}</h3>
          {isAdmin ? (
            <Link
              href={`/requests/${notification.request_id}`}
              className='text-request-link hover:text-request-link-hover cursor-pointer text-base font-bold underline transition-colors'
            >
              #{notification.request_id}
            </Link>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className='text-request-link hover:text-request-link-hover cursor-pointer text-base font-bold underline transition-colors'
            >
              #{notification.request_id}
            </button>
          )}
        </div>
        <RequestDetails
          requestId={notification.request_id}
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
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
  );
};
