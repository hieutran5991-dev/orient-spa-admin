'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@/icons';
import InputField from './input/InputField';

interface AppIdInputProps {
  id: string;
  label: string;
  appType: string;
  appId: string;
  onAppTypeChange: (appType: string) => void;
  onAppIdChange: (appId: string) => void;
  placeholder?: string;
  error?: boolean;
  hint?: string;
}

const APP_TYPES = [
  { value: 'kakaotalk', label: 'KakaoTalk' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'line', label: 'Line' },
  { value: 'zalo', label: 'Zalo' },
];

export default function AppIdInput({
  id,
  label,
  appType,
  appId,
  onAppTypeChange,
  onAppIdChange,
  placeholder = 'app ID',
  error,
  hint,
}: AppIdInputProps) {
  const [isAppTypeOpen, setIsAppTypeOpen] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="flex gap-2">
        {/* App Type Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsAppTypeOpen(!isAppTypeOpen)}
            className={`h-11 px-4 py-2.5 text-sm rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:focus:border-brand-800 flex items-center gap-2 min-w-[140px] ${
              appType ? 'text-gray-800 dark:text-white/90' : 'text-gray-400 dark:text-gray-400'
            }`}
          >
            <span>{appType ? APP_TYPES.find(app => app.value === appType)?.label || appType : 'Select App'}</span>
            <ChevronDownIcon className="size-4" />
          </button>
          
          {isAppTypeOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsAppTypeOpen(false)}
              />
              <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg max-h-48 overflow-y-auto">
                {APP_TYPES.map((app) => (
                  <button
                    key={app.value}
                    type="button"
                    onClick={() => {
                      onAppTypeChange(app.value);
                      setIsAppTypeOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      appType === app.value
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {app.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* App ID Input */}
        <div className="flex-1">
          <InputField
            type="text"
            id={id}
            name={id}
            value={appId}
            onChange={(e) => onAppIdChange(e.target.value)}
            placeholder={placeholder}
            error={error}
            hint={hint}
          />
        </div>
      </div>
    </div>
  );
}

