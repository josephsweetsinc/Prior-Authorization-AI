'use client';

import { type PaginationState } from '@tanstack/react-table';
import { useState } from 'react';

import { useGetNotificationsQuery } from '@/services/notifications/';
import { TitleAndDesc } from '@/shared/components';
import { useFilters } from '@/shared/hooks/useFilters';

import { DEFAULT_FILTERS, DEFAULT_PAGE_SIZE } from '../constants';
import {
  type INotificationFilters,
  type NotificationCategory,
} from '../types/types';

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

  const apiCategory =
    filters.category === 'unread' || filters.category === 'all'
      ? undefined
      : filters.category;

  const { data, isLoading } = useGetNotificationsQuery({
    page: pagination.pageIndex + 1,
    category: apiCategory,
  });

  const filteredNotifications =
    filters.category === 'unread'
      ? data?.items.filter((n) => !n.is_read) || []
      : data?.items || [];

  const unreadCount = data?.items.filter((n) => !n.is_read).length || 0;
  const statusUpdatesCount =
    data?.items.filter((n) => n.category === 'status_updates').length || 0;
  const documentsCount =
    data?.items.filter((n) => n.category === 'documents').length || 0;
  const requirementsCount =
    data?.items.filter((n) => n.category === 'requirements').length || 0;

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
          unread: unreadCount,
          status_updates: statusUpdatesCount,
          documents: documentsCount,
          requirements: requirementsCount,
        }}
      />

      <NotificationsFeed
        notifications={filteredNotifications}
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
