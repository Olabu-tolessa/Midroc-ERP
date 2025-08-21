import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

export const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show status briefly on mount if offline
    if (!navigator.onLine) {
      setShowStatus(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showStatus && isOnline) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      showStatus ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
    }`}>
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg ${
        isOnline 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium">Connected</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">No Internet Connection</span>
          </>
        )}
      </div>
    </div>
  );
};

export const DatabaseStatus: React.FC = () => {
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  useEffect(() => {
    // Check database connectivity
    const checkDatabase = async () => {
      try {
        // Simple check for Supabase configuration
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseKey || 
            supabaseUrl === 'https://placeholder-project.supabase.co' || 
            supabaseKey === 'placeholder-anon-key') {
          setDbStatus('error');
        } else {
          setDbStatus('connected');
        }
      } catch (error) {
        setDbStatus('error');
      }
    };

    checkDatabase();
  }, []);

  if (dbStatus === 'connected') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg bg-yellow-100 text-yellow-800 border border-yellow-200">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm font-medium">
          {dbStatus === 'checking' ? 'Checking database...' : 'Database not configured'}
        </span>
      </div>
    </div>
  );
};
