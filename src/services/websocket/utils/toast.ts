import { toast } from 'react-toastify';

import type { INotification } from '@/services/notifications';

import { AUTOCLOSE_MS } from '../constants';

export const showNotificationToast = (notification: INotification) => {
  toast.info(notification.title || 'New notification', {
    position: 'top-right',
    autoClose: AUTOCLOSE_MS,
    toastId: 'notification-toast',
  });
};
