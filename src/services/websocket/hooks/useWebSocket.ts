'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  closeSingleton,
  decrementAcquireCount,
  ensureWebSocket,
  getIsConnectedSingleton,
  incrementAcquireCount,
  onSingleton,
  sendSingleton,
  subscribeConnection,
} from '../api/websocket-service';
import { type UseWebSocketReturn } from '../types';

export const useWebSocket = (): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(getIsConnectedSingleton());

  const acquiredRef = useRef(false);

  useEffect(() => subscribeConnection(setIsConnected), []);

  const connect = useCallback((websocketUrl: string, _token: string) => {
    if (!acquiredRef.current) {
      acquiredRef.current = true;
      incrementAcquireCount();
    }
    ensureWebSocket(websocketUrl);
  }, []);

  const disconnect = useCallback(() => {
    if (!acquiredRef.current) {
      return;
    }
    acquiredRef.current = false;
    const acquireCount = decrementAcquireCount();
    if (acquireCount === 0) {
      closeSingleton();
    }
  }, []);

  const on = onSingleton;
  const send = sendSingleton;

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return { connect, disconnect, on, send, isConnected };
};
