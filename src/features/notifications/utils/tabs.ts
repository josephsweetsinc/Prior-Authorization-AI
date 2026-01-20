import type { IFilterTab, INotificationStats } from '../types';

export const getTabTitle = (tab: IFilterTab, stats: INotificationStats) => {
  if (tab.value === 'all') {
    return tab.label;
  }

  const count = stats[tab.value] ?? 0;

  return `${tab.label} (${count})`;
};
