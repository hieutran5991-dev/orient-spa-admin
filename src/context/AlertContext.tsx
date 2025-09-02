'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Alert types
export type AlertType = 'success' | 'error' | 'warning' | 'info';

// Alert interface
export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  showLink?: boolean;
  linkHref?: string;
  linkText?: string;
  duration?: number; // Auto dismiss duration in ms (0 = no auto dismiss)
  persistent?: boolean; // If true, alert won't auto dismiss
}

// Alert context interface
interface AlertContextType {
  alerts: Alert[];
  showAlert: (alert: Omit<Alert, 'id'>) => string;
  hideAlert: (id: string) => void;
  clearAllAlerts: () => void;
  
  // Convenience methods
  showSuccess: (title: string, message: string, options?: Partial<Alert>) => string;
  showError: (title: string, message: string, options?: Partial<Alert>) => string;
  showWarning: (title: string, message: string, options?: Partial<Alert>) => string;
  showInfo: (title: string, message: string, options?: Partial<Alert>) => string;
}

// Create context
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Alert provider props
interface AlertProviderProps {
  children: ReactNode;
  defaultDuration?: number; // Default auto dismiss duration
  maxAlerts?: number; // Maximum number of alerts to show at once
}

// Alert provider component
export const AlertProvider: React.FC<AlertProviderProps> = ({
  children,
  defaultDuration = 5000, // 5 seconds default
  maxAlerts = 5
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Generate unique ID for alerts
  const generateId = useCallback(() => {
    return `alert-${Date.now()}}`;
  }, []);

    // Hide alert
    const hideAlert = useCallback((id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
      }, []);

  // Show alert
  const showAlert = useCallback((alertData: Omit<Alert, 'id'>) => {
    const id = generateId();
    const alert: Alert = {
      id,
      duration: defaultDuration,
      persistent: false,
      ...alertData
    };

    setAlerts(prev => {
      const newAlerts = [alert, ...prev];
      // Keep only maxAlerts number of alerts
      return newAlerts.slice(0, maxAlerts);
    });

    // Auto dismiss if duration is set and not persistent
    if (alert.duration && alert.duration > 0 && !alert.persistent) {
      setTimeout(() => {
        hideAlert(id);
      }, alert.duration);
    }

    return id;
  }, [defaultDuration, maxAlerts, generateId, hideAlert]);

  // Clear all alerts
  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((title: string, message: string, options?: Partial<Alert>) => {
    return showAlert({
      type: 'success',
      title,
      message,
      ...options
    });
  }, [showAlert]);

  const showError = useCallback((title: string, message: string, options?: Partial<Alert>) => {
    return showAlert({
      type: 'error',
      title,
      message,
      ...options
    });
  }, [showAlert]);

  const showWarning = useCallback((title: string, message: string, options?: Partial<Alert>) => {
    return showAlert({
      type: 'warning',
      title,
      message,
      ...options
    });
  }, [showAlert]);

  const showInfo = useCallback((title: string, message: string, options?: Partial<Alert>) => {
    return showAlert({
      type: 'info',
      title,
      message,
      ...options
    });
  }, [showAlert]);

  const value: AlertContextType = {
    alerts,
    showAlert,
    hideAlert,
    clearAllAlerts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};

// Custom hook to use alert context
export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

// Export context for advanced usage
export { AlertContext };
