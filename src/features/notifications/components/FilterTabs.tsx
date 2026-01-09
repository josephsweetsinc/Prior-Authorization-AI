import { FilterTab } from '@/shared/components/filter-tab/FilterTab';

import { FILTER_TABS } from '../constants';
import { type FilterTabsProps } from '../types';

export const FilterTabs = ({
  activeCategory,
  onCategoryChange,
  categoryCounts = {
    unread: 0,
    status_updates: 0,
    documents: 0,
    requirements: 0,
  },
}: FilterTabsProps) => {
  const getTabTitle = (tab: (typeof FILTER_TABS)[number]) => {
    if (tab.value === 'all') {
      return tab.label;
    }
    const count = categoryCounts[tab.value as keyof typeof categoryCounts] || 0;
    return `${tab.label} (${count})`;
  };

  return (
    <div className='flex w-fit gap-2.5 rounded-[20px] border-[1px]'>
      {FILTER_TABS.map((tab) => (
        <FilterTab
          key={tab.value}
          title={getTabTitle(tab)}
          isActive={activeCategory === tab.value}
          onClick={() => onCategoryChange(tab.value)}
        />
      ))}
    </div>
  );
};
