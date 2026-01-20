import {
  type IGetNotificationsParams,
  type NotificationCategory,
} from '@/services/notifications';
import { clearParams } from '@/shared/lib/utils';

export const apiCategory = (category?: NotificationCategory) => {
  if (!category) {
    return undefined;
  }

  return category === 'unread' || category === 'all' ? undefined : category;
};

export const buildNotificationsParams = (
  page: number,
  category?: NotificationCategory,
): IGetNotificationsParams => {
  return clearParams({
    page,
    category: apiCategory(category),
    is_read: category === 'unread' ? false : undefined,
  });
};
