import { useDispatch } from 'react-redux';

import type { NotificationCategory } from '@/services/notifications';

import { useConnectSockets } from './useConnectSockets';
import { useHandleNotifications } from './useHandleNotifications';
import { usePolling } from './usePolling';

export const useNotifications = ({
  page = 1,
  category = 'all',
}: {
  page?: number;
  category?: NotificationCategory;
} = {}) => {
  const dispatch = useDispatch();
  const { handleNotification } = useHandleNotifications(dispatch);

  const { isConnected, send } = useConnectSockets(handleNotification);

  // ? Fallback in case ws connection is lost
  usePolling({ handleNotification, isConnected: isConnected, page, category });

  return { isConnected, send };
};
