'use client';
import { useState } from 'react';

import { RequestDetails } from '@/features/requests-history';

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
  return (
    <div
      onClick={() => onClick?.(notification.id)}
      className={`rounded-xl border bg-white p-5 transition-all hover:shadow-md ${
        onClick ? 'cursor-pointer' : ''
      } ${isAdmin ? (notification.category === 'unread' ? 'border-l-4 border-l-blue-500' : '') : notification.category === 'requirements' ? 'border-l-4 border-l-blue-500' : ''} ${className}`}
      {...rest}
    >
      <div className='space-y-1'>
        <div className='flex items-center gap-2'>
          <h3 className='text-base font-bold'>{notification.title}</h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className='cursor-pointer text-base font-bold text-[#047CB4] underline transition-colors hover:text-[#035a85]'
          >
            #{notification.request_id}
          </button>
          {!notification.is_read && (
            <span className='h-2 w-2 rounded-full bg-blue-500' />
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
