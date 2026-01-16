import { toast } from 'react-toastify';

import { type NotificationItem } from '@/services/notifications';

import { AUTOCLOSE_MS } from '../constants';

export const showNotificationToast = (notification: NotificationItem) => {
  toast.info(notification.title || 'New notification', {
    position: 'top-right',
    autoClose: AUTOCLOSE_MS,
  });
};
