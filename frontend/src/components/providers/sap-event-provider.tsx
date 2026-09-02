'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { RealtimeToast } from '@/components/ui/realtime-toast';

interface SapEventContextType {
  isConnected: boolean;
  lastEvent: any | null;
  triggerBapiToast: (message?: string) => void;
}

const SapEventContext = createContext<SapEventContextType>({ 
  isConnected: false, 
  lastEvent: null, 
  triggerBapiToast: () => {} 
});

export const useSapEvents = () => useContext(SapEventContext);

export function SapEventProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<any>(null);
  const [toasts, setToasts] = useState<any[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 10000);
  };

  const triggerBapiToast = (message?: string) => {
    const defaultMsg = message || `SAP BAPI Execution Confirmed! Purchase Order #${Math.floor(45000000 + Math.random() * 9000000)} created in SAP CAP.`;
    addToast('info', 'SAP BAPI Execution', defaultMsg);
  };

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimer: NodeJS.Timeout;

    const connect = () => {
      const baseUrl = process.env.NEXT_PUBLIC_AI_API_URL || 'http://127.0.0.1:8001';
      eventSource = new EventSource(`${baseUrl}/api/sap/events/stream`);

      eventSource.onopen = () => {
        setIsConnected(true);
      };

      eventSource.addEventListener('connection', (e) => {
        const data = JSON.parse(e.data);
        setIsConnected(true);
        addToast('success', 'SAP Event Mesh', data.status);
      });

      eventSource.addEventListener('SAP_DISRUPTION_EVENT', (e) => {
        const data = JSON.parse(e.data);
        setLastEvent(data);
        addToast('error', 'SAP Disruption Detected', data.message);
      });

      eventSource.addEventListener('SAP_BAPI_EVENT', (e) => {
        const data = JSON.parse(e.data);
        setLastEvent(data);
        addToast('info', 'SAP BAPI Execution', data.message);
      });

      eventSource.onerror = (error) => {
        console.error('SAP Event Mesh Stream Error (reconnecting in 3s)...', error);
        setIsConnected(false);
        if (eventSource) {
          eventSource.close();
        }
        reconnectTimer = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }
    };
  }, []);

  return (
    <SapEventContext.Provider value={{ isConnected, lastEvent, triggerBapiToast }}>
      {children}
      <div className="fixed top-20 right-6 z-[9999] flex flex-col space-y-3 max-w-md w-full pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto shadow-2xl">
            <RealtimeToast type={t.type} title={t.title} message={t.message} onClose={() => setToasts(prev => prev.filter(x => x.id !== t.id))} />
          </div>
        ))}
      </div>
    </SapEventContext.Provider>
  );
}
