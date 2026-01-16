import { useGetNotificationsQuery } from '@/services/notifications/';
import {
  buildNotificationsParams,
  useWebSocket,
  POLLING_INTERVAL,
} from '@/services/websocket';

import { unreadCount } from '../utils/filters';

export const useUnreadNotificationsCount = () => {
  const { isConnected } = useWebSocket();

  const { data: allNotificationsData, isLoading } = useGetNotificationsQuery(
    buildNotificationsParams(1, 'all'),
    {
      pollingInterval: isConnected ? 0 : POLLING_INTERVAL,
    },
  );

  const count = unreadCount(allNotificationsData?.items || []);

  return {
    count,
    isLoading,
  };
};
