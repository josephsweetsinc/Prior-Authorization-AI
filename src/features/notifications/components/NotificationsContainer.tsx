'use client';

import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
} from '@/services/notifications';
import { buildNotificationsParams } from '@/services/websocket';
import { POLLING_INTERVAL } from '@/services/websocket/constants';
import { useWebSocket } from '@/services/websocket/hooks';
import { TitleAndDesc } from '@/shared/components';

import { useNotificationsControls } from '../hooks';
import { useNotificationStats } from '../hooks/useNotificationStats';

import { FilterTabs } from './FilterTabs';
import { NotificationsFeed } from './NotificationsFeed';
import { NotificationsPagination } from './NotificationsPagination';

export const NotificationsContainer = () => {
  const { filters, pagination, setPagination, onCategoryChange } =
    useNotificationsControls();
  const { isConnected } = useWebSocket();

  const { data: notifications, isFetching } = useGetNotificationsQuery(
    buildNotificationsParams(pagination.pageIndex + 1, filters.category),
    {
      pollingInterval: isConnected ? 0 : POLLING_INTERVAL,
    },
  );

  const { data: allNotifications } = useGetNotificationsQuery(
    buildNotificationsParams(1, 'all'),
    {
      pollingInterval: isConnected ? 0 : POLLING_INTERVAL,
    },
  );
  const stats = useNotificationStats(allNotifications?.items);

  const totalPages = notifications?.total_pages || 0;
  const total = notifications?.total || 0;

  const [mark] = useMarkNotificationAsReadMutation();

  const handleMarkAsRead = (notificationId: number) => mark(notificationId);

  return (
    <div className='space-y-4'>
      <TitleAndDesc
        title='Notifications'
        subtitle='Stay updated with latest activities'
      />
      <FilterTabs
        activeCategory={filters.category}
        onCategoryChange={onCategoryChange}
        stats={stats}
      />

      <NotificationsFeed
        notifications={notifications?.items || []}
        isLoading={isFetching}
        onNotificationClick={handleMarkAsRead}
      />

      {totalPages > 1 && (
        <NotificationsPagination
          pagination={pagination}
          onPaginationChange={setPagination}
          total={total}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};
