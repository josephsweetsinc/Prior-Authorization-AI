'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import ReconnectingWebSocket from 'reconnecting-websocket';
import type { CloseEvent } from 'reconnecting-websocket/dist/events';

import { parseApiError } from '@/services/api/types';

import {
  type NotificationEventHandler,
  type UseWebSocketReturn,
} from '../types';

export const useWebSocket = (): UseWebSocketReturn => {
  const wsRef = useRef<ReconnectingWebSocket | null>(null);
  const eventHandlersRef = useRef<Map<string, Set<NotificationEventHandler>>>(
    new Map(),
  );
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback((websocketUrl: string, _token: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    wsRef.current = new ReconnectingWebSocket(websocketUrl, [], {
      maxReconnectionDelay: 10000,
      minReconnectionDelay: 1000,
      reconnectionDelayGrowFactor: 1.3,
      connectionTimeout: 4000,
      maxRetries: Infinity,
    });

    wsRef.current.addEventListener('open', () => {
      setIsConnected(true);
    });

    wsRef.current.addEventListener('message', (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        const handlers = eventHandlersRef.current.get(
          data.type || 'notification',
        );

        if (handlers) {
          handlers.forEach((handler) => handler(data));
        }
      } catch (err) {
        const parsedError = parseApiError(err)?.message;
        toast.error(parsedError ?? 'Failed to parse WebSocket message');
      }
    });

    wsRef.current.addEventListener('error', () => {
      setIsConnected(false);
    });

    wsRef.current.addEventListener('close', (_event: CloseEvent) => {
      setIsConnected(false);
    });
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    eventHandlersRef.current.clear();
    setIsConnected(false);
  }, []);

  const on = useCallback(
    (eventType: string, handler: NotificationEventHandler) => {
      if (!eventHandlersRef.current.has(eventType)) {
        eventHandlersRef.current.set(eventType, new Set());
      }
      eventHandlersRef.current.get(eventType)!.add(handler);

      return () => {
        const handlers = eventHandlersRef.current.get(eventType);
        if (handlers) {
          handlers.delete(handler);
        }
      };
    },
    [],
  );

  const send = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    on,
    send,
    isConnected,
  };
};
