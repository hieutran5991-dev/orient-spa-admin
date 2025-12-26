'use client';

import React, { useEffect } from 'react';
import { useAlert } from '@/context/AlertContext';
import Alert from '@/components/ui/alert/Alert';
import { AlertConfigs } from '@/lib/alertMessages';

// Alert container component to display all alerts
const AlertContainer: React.FC = () => {
  const { alerts, hideAlert, showError } = useAlert();

  // Listen for API errors from axios interceptor
  useEffect(() => {
    const handleApiError = (event: CustomEvent) => {
      const { title, message, type } = event.detail;
      if (type === 'error') {
        showError(title, message, {
          ...AlertConfigs.ERROR,
          persistent: true, // Permission errors should be persistent
        });
      }
    };

    window.addEventListener('showApiError', handleApiError as EventListener);

    return () => {
      window.removeEventListener('showApiError', handleApiError as EventListener);
    };
  }, [showError]);

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-[100000] pointer-events-none space-y-3 max-w-sm w-full">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="relative animate-in slide-in-from-right-full duration-300 pointer-events-auto"
        >
          <Alert
            variant={alert.type}
            title={alert.title}
            message={alert.message}
            showLink={alert.showLink}
            linkHref={alert.linkHref}
            linkText={alert.linkText}
          />
          
          {/* Close button */}
          <button
            onClick={() => hideAlert(alert.id)}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close alert"
          >
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default AlertContainer;
