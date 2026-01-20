'use client';

import type { PaginationState } from '@tanstack/react-table';
import { useState } from 'react';

import { type NotificationCategory } from '@/services/notifications';
import { useFilters } from '@/shared/hooks/useFilters';

import { DEFAULT_FILTERS, DEFAULT_PAGE_SIZE } from '../constants';
import { type INotificationFilters } from '../types';

export const useNotificationsControls = () => {
  const { filters, handleFiltersChange } =
    useFilters<INotificationFilters>(DEFAULT_FILTERS);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  const onCategoryChange = (category: NotificationCategory) => {
    handleFiltersChange('category', category);
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  };

  return { filters, pagination, setPagination, onCategoryChange };
};
