import { type NotificationItem } from '@/services/notifications';

export type NotificationEventHandler = (_notification: WebSocketEvent) => void;

export interface UseWebSocketReturn {
  connect: (_websocketUrl: string, _token: string) => void;
  disconnect: () => void;
  on: (_eventType: string, _handler: NotificationEventHandler) => () => void;
  send: (_data: unknown) => void;
  isConnected: boolean;
}

export interface WebSocketEvent {
  type?: string;
  data: NotificationItem;
}

export type NotificationSource = 'socket' | 'polling';
