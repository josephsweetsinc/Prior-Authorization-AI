import { type HTMLProps } from 'react';

import { useIsAdmin } from '@/services/auth';
import { type NotificationCategory } from '@/services/notifications';
import { FilterTab, FilterTabSkeleton } from '@/shared/components';
import { cn } from '@/shared/lib/utils';

import { PROVIDER_FILTER_TABS, ADMIN_FILTER_TABS } from '../constants';
import type { INotificationStats } from '../types';
import { getTabTitle } from '../utils';

export type Props = {
  activeCategory: NotificationCategory;
  onCategoryChange: (_category: NotificationCategory) => void;
  stats: INotificationStats;
} & HTMLProps<HTMLElement>;

export const FilterTabs = ({
  activeCategory,
  onCategoryChange,
  stats,
  className,
  ...props
}: Props) => {
  const { isAdmin, isLoading } = useIsAdmin();
  const FILTER_TABS = isAdmin ? ADMIN_FILTER_TABS : PROVIDER_FILTER_TABS;

  if (isLoading) {
    return (
      <section
        className={cn(
          'flex w-fit gap-2.5 rounded-[20px] border-[1px]',
          className,
        )}
        {...props}
      >
        {Array.from({ length: 2 }).map((_, index) => (
          <FilterTabSkeleton isActive={index === 0} withCount key={index} />
        ))}
      </section>
    );
  }

  return (
    <section
      className={cn(
        'flex w-fit gap-2.5 rounded-[20px] border-[1px]',
        className,
      )}
      {...props}
    >
      {FILTER_TABS.map((tab) => (
        <FilterTab
          label={getTabTitle(tab, stats)}
          isActive={activeCategory === tab.value}
          onClick={() => onCategoryChange(tab.value)}
          key={tab.value}
        />
      ))}
    </section>
  );
};
