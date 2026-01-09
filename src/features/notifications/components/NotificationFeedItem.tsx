import Link from 'next/link';

import { type NotificationFeedItemProps } from '../types';
import { formatDate } from '../utils/formatDate';

export const NotificationFeedItem = ({
  notification,
  onClick,
  className = '',
  ...rest
}: NotificationFeedItemProps) => {
  return (
    <div
      onClick={() => onClick?.(notification.id)}
      className={`rounded-xl border bg-white p-5 transition-all hover:shadow-md ${
        onClick ? 'cursor-pointer' : ''
      } ${notification.category === 'requirements' ? 'border-l-4 border-l-blue-500' : ''} ${className}`}
      {...rest}
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
  );
};
