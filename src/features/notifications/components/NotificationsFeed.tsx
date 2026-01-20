import { type HTMLProps } from 'react';

import { useIsAdmin } from '@/services/auth';
import { type INotification } from '@/services/notifications';
import { cn } from '@/shared/lib/utils';

import { NotificationFeedItem } from './NotificationFeedItem';
import { NotificationFeedSkeleton } from './NotificationFeedSkeleton';

export type Props = {
  notifications?: INotification[];
  isLoading?: boolean;
  onNotificationClick: (_notificationId: number) => void;
} & HTMLProps<HTMLElement>;

export const NotificationsFeed = ({
  notifications,
  isLoading,
  onNotificationClick,
  className,
  ...props
}: Props) => {
  const { isAdmin } = useIsAdmin();

  if (isLoading) {
    return <NotificationFeedSkeleton />;
  }

  if (!notifications || notifications.length === 0) {
    return (
      <section
        className={cn(
          'flex min-h-[200px] items-center justify-center rounded-xl border bg-white p-8',
          className,
        )}
        {...props}
      >
        <p className='text-gray-dark text-sm'>No notifications found</p>
      </section>
    );
  }

  return (
    <section className={cn('space-y-3', className)} {...props}>
      {notifications.map((notification) => (
        <NotificationFeedItem
          notification={notification}
          key={notification.id}
          onClick={() => onNotificationClick?.(notification.id)}
          isAdmin={isAdmin}
        />
      ))}
    </section>
  );
};
