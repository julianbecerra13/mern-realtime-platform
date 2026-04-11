import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within SocketProvider');
  return context;
};

export const SocketProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();

  const checkConnection = useCallback(async () => {
    if (!user) { setConnected(false); return; }
    try {
      await api.get('/health');
      setConnected(true);
    } catch {
      setConnected(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) { setConnected(false); return; }
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, [user, checkConnection]);

  return (
    <SocketContext.Provider value={{ socket: null, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
