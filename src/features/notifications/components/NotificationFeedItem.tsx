'use client';
import Link from 'next/link';
import { type HTMLProps, type MouseEvent, useState } from 'react';

import { RequestDetails } from '@/features/requests-history';
import { type INotification } from '@/services/notifications';
import { cn } from '@/shared/lib/utils';

import { formatDate } from '../utils/formatDate';

export type Props = {
  notification: INotification;
  onClick: (_id: number) => void;
  isAdmin?: boolean;
} & Omit<HTMLProps<HTMLElement>, 'onClick'>;

export const NotificationFeedItem = ({
  notification,
  onClick,
  isAdmin,
  className,
  ...props
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const close = () => setIsModalOpen(false);

  const open = (e: MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const marked = isAdmin
    ? !notification.is_read
    : notification.category === 'requirements';

  return (
    <article
      onClick={() => onClick(notification.id)}
      className={cn(
        'space-y-1 rounded-xl border bg-white p-5 transition-all hover:shadow-md',
        {
          'cursor-pointer': onClick,
          'border-l-status-info border-l-4': marked,
        },
        className,
      )}
      {...props}
    >
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
            onClick={open}
            className='text-request-link hover:text-request-link-hover cursor-pointer text-base font-bold underline transition-colors'
          >
            #{notification.request_id}
          </button>
        )}
      </div>
      {isModalOpen && (
        <RequestDetails
          requestId={notification.request_id}
          open={isModalOpen}
          onClose={close}
        />
      )}
      <div className='flex items-center justify-between gap-2'>
        <p className='text-gray-dark text-sm font-normal'>
          {notification.message}
        </p>
        <span className='text-muted-blue text-sm font-normal text-nowrap'>
          {formatDate(notification.created_at)}
        </span>
      </div>
    </article>
  );
};
