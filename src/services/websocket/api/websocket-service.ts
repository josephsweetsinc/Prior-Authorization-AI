'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import type { CloseEvent } from 'reconnecting-websocket/dist/events';

import {
  type NotificationEventHandler,
  type UseWebSocketReturn,
} from '../types';

let wsSingleton: ReconnectingWebSocket | null = null;
let wsUrlSingleton: string | null = null;
let isConnectedSingleton = false;
let acquireCountSingleton = 0;
const eventHandlersSingleton = new Map<string, Set<NotificationEventHandler>>();
const connectionSubscribers = new Set<(_isConnected: boolean) => void>();

const notifyConnectionSubscribers = () => {
  connectionSubscribers.forEach((subscriber) => {
    subscriber(isConnectedSingleton);
  });
};

const setConnectedSingleton = (next: boolean) => {
  if (isConnectedSingleton === next) {
    return;
  }
  isConnectedSingleton = next;
  notifyConnectionSubscribers();
};

const ensureWebSocket = (websocketUrl: string) => {
  const existing = wsSingleton;
  const existingState = existing?.readyState;
  const urlUnchanged = wsUrlSingleton === websocketUrl;

  if (
    existing &&
    urlUnchanged &&
    (existingState === WebSocket.OPEN || existingState === WebSocket.CONNECTING)
  ) {
    return;
  }

  if (existing) {
    try {
      existing.close();
    } catch (err) {
      console.error('Failed to close existing WebSocket connection', err);
    }
  }

  wsUrlSingleton = websocketUrl;
  wsSingleton = new ReconnectingWebSocket(websocketUrl, [], {
    maxReconnectionDelay: 10000,
    minReconnectionDelay: 1000,
    reconnectionDelayGrowFactor: 1.3,
    connectionTimeout: 4000,
    maxRetries: Infinity,
  });

  wsSingleton.addEventListener('open', () => {
    setConnectedSingleton(true);
  });

  wsSingleton.addEventListener('message', (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      const eventType = data?.type || 'notification';
      const handlers = eventHandlersSingleton.get(eventType);
      if (handlers) {
        handlers.forEach((handler) => handler(data));
      }
    } catch (err) {
      console.error('Failed to parse WebSocket message', err);
    }
  });

  wsSingleton.addEventListener('error', () => {
    setConnectedSingleton(false);
  });

  wsSingleton.addEventListener('close', (_event: CloseEvent) => {
    setConnectedSingleton(false);
  });
};

const subscribeConnection = (subscriber: (_isConnected: boolean) => void) => {
  connectionSubscribers.add(subscriber);
  subscriber(isConnectedSingleton);
  return () => {
    connectionSubscribers.delete(subscriber);
  };
};

const onSingleton = (eventType: string, handler: NotificationEventHandler) => {
  if (!eventHandlersSingleton.has(eventType)) {
    eventHandlersSingleton.set(eventType, new Set());
  }
  eventHandlersSingleton.get(eventType)!.add(handler);
  return () => {
    const handlers = eventHandlersSingleton.get(eventType);
    if (!handlers) {
      return;
    }
    handlers.delete(handler);
    if (handlers.size === 0) {
      eventHandlersSingleton.delete(eventType);
    }
  };
};

const sendSingleton = (data: unknown) => {
  if (wsSingleton?.readyState === WebSocket.OPEN) {
    wsSingleton.send(JSON.stringify(data));
  }
};

const closeSingleton = () => {
  if (wsSingleton) {
    try {
      wsSingleton.close();
    } catch (err) {
      console.error('Failed to close WebSocket connection', err);
    }
  }
  wsSingleton = null;
  wsUrlSingleton = null;
  eventHandlersSingleton.clear();
  setConnectedSingleton(false);
};

export const useWebSocket = (): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(isConnectedSingleton);

  const acquiredRef = useRef(false);

  useEffect(() => subscribeConnection(setIsConnected), []);

  const connect = useCallback((websocketUrl: string, _token: string) => {
    if (!acquiredRef.current) {
      acquiredRef.current = true;
      acquireCountSingleton += 1;
    }
    ensureWebSocket(websocketUrl);
  }, []);

  const disconnect = useCallback(() => {
    if (!acquiredRef.current) {
      return;
    }
    acquiredRef.current = false;
    acquireCountSingleton = Math.max(0, acquireCountSingleton - 1);
    if (acquireCountSingleton === 0) {
      closeSingleton();
    }
  }, []);

  const on = useMemo(() => onSingleton, []);
  const send = useMemo(() => sendSingleton, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { connect, disconnect, on, send, isConnected };
};
