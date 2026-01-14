import { useGetCurrentUserQuery } from '@/services/auth';

import { type NotificationsFeedProps } from '../types/types';

import { NotificationFeedItem } from './NotificationFeedItem';
import { NotificationFeedSkeleton } from './NotificationFeedSkeleton';

export const NotificationsFeed = ({
  notifications,
  isLoading,
  onNotificationClick,
}: NotificationsFeedProps) => {
  const { data: currentUser } = useGetCurrentUserQuery();
  const isAdmin = currentUser?.role === 'admin';

  if (isLoading) {
    return <NotificationFeedSkeleton />;
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
        <NotificationFeedItem
          notification={notification}
          key={notification.id}
          onClick={() => onNotificationClick?.(notification.id)}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
};
