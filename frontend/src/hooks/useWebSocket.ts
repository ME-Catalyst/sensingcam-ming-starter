import { useEffect } from 'react';
import { wsService } from '../services/websocket';
import type { FactoryEvent, FrigateEvent } from '../types';

export const useWebSocket = () => {
  useEffect(() => {
    wsService.connect();

    return () => {
      wsService.disconnect();
    };
  }, []);

  const onFactoryEvent = (handler: (data: FactoryEvent) => void) => {
    wsService.on('factory:event', handler);
    return () => wsService.off('factory:event', handler);
  };

  const onFrigateEvent = (handler: (data: FrigateEvent) => void) => {
    wsService.on('frigate:event', handler);
    return () => wsService.off('frigate:event', handler);
  };

  return {
    onFactoryEvent,
    onFrigateEvent,
    isConnected: wsService.isConnected(),
  };
};
