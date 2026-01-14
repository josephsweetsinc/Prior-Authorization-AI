import { useGetNotificationsQuery } from '@/services/notifications/';
import { POLLING_INTERVAL } from '@/services/websocket/constants';
import { useWebSocketNotifications } from '@/services/websocket/hooks';

import { unreadCount } from '../utils/filters';

export const useUnreadNotificationsCount = () => {
  const { isConnected } = useWebSocketNotifications();

  const { data: allNotificationsData, isLoading } = useGetNotificationsQuery(
    {
      page: 1,
      category: undefined,
    },
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
