'use client';

import { type PaginationState } from '@tanstack/react-table';
import { useState } from 'react';

import { useGetNotificationsQuery } from '@/services/notifications/';
import { POLLING_INTERVAL } from '@/services/websocket/constants';
import { useWebSocket } from '@/services/websocket/hooks';
import { TitleAndDesc } from '@/shared/components';
import { useFilters } from '@/shared/hooks/useFilters';

import { DEFAULT_FILTERS, DEFAULT_PAGE_SIZE } from '../constants';
import {
  type INotificationFilters,
  type NotificationCategory,
} from '../types/types';
import {
  buildNotificationsParams,
  filteredNotifications,
  unreadCount,
  statusUpdatesCount,
  documentsCount,
  requirementsCount,
} from '../utils/filters';

import { FilterTabs } from './FilterTabs';
import { NotificationsFeed } from './NotificationsFeed';
import { NotificationsPagination } from './NotificationsPagination';

export const NotificationsContainer = () => {
  const { filters, handleFiltersChange } =
    useFilters<INotificationFilters>(DEFAULT_FILTERS);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const { isConnected } = useWebSocket();

  const { data, isLoading } = useGetNotificationsQuery(
    buildNotificationsParams(pagination.pageIndex + 1, filters.category),
    {
      pollingInterval: isConnected ? 0 : POLLING_INTERVAL,
    },
  );

  const { data: allNotificationsData } = useGetNotificationsQuery(
    buildNotificationsParams(1, 'all'),
    {
      pollingInterval: isConnected ? 0 : POLLING_INTERVAL,
    },
  );

  const filteredNotificationsList = filteredNotifications(
    data?.items || [],
    filters.category,
  );

  const unreadCountValue = unreadCount(allNotificationsData?.items || []);
  const statusUpdatesCountValue = statusUpdatesCount(
    allNotificationsData?.items || [],
  );
  const documentsCountValue = documentsCount(allNotificationsData?.items || []);
  const requirementsCountValue = requirementsCount(
    allNotificationsData?.items || [],
  );

  const handleFilterChange = (category: NotificationCategory) => {
    handleFiltersChange('category', category);
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };

  return (
    <div className='space-y-4'>
      <TitleAndDesc
        title='Notifications'
        subtitle='Stay updated with latest activities'
      />
      <FilterTabs
        activeCategory={filters.category}
        onCategoryChange={handleFilterChange}
        categoryCounts={{
          unread: unreadCountValue,
          status_updates: statusUpdatesCountValue,
          documents: documentsCountValue,
          requirements: requirementsCountValue,
        }}
      />

      <NotificationsFeed
        notifications={filteredNotificationsList}
        isLoading={isLoading}
      />

      {data && data.total > 0 && (
        <NotificationsPagination
          pagination={pagination}
          onPaginationChange={setPagination}
          total={data.total}
          totalPages={data.total_pages}
        />
      )}
    </div>
  );
};
