'use client';

import { useState, useEffect, useRef } from 'react';
import Label from './Label';
import { GroupIcon, ChevronDownIcon } from '@/icons';

type PropsType = {
  id: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  value?: string;
  error?: boolean;
  hint?: string;
  min?: number;
  max?: number;
};

export default function GuestPicker({
  id,
  onChange,
  label,
  placeholder = 'Select number of guests',
  value,
  error,
  hint,
  min = 1,
  max = 10,
}: PropsType) {
  const [selectedValue, setSelectedValue] = useState<string>(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // Generate guest options from min to max
  const guestOptions = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  // Update internal state when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleGuestSelect = (guestNumber: string) => {
    setSelectedValue(guestNumber);
    setIsOpen(false);
    if (onChange) {
      onChange(guestNumber);
    }
  };

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative" ref={inputRef}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 cursor-pointer dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800 ${
            error ? 'border-red-500 dark:border-red-500' : ''
          } ${
            selectedValue ? 'text-gray-800 dark:text-white/90' : 'text-gray-400 dark:text-gray-400'
          }`}
        >
          {selectedValue ? selectedValue : placeholder}
        </div>

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400 flex items-center gap-1">
          <GroupIcon className="size-5" />
          <ChevronDownIcon className="size-4" />
        </span>

        {/* Popup */}
        {isOpen && (
          <div className="absolute z-[9999] mt-2 w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg" ref={popupRef}>
            <div className="py-2 max-h-64 overflow-y-auto">
              {guestOptions.map((number) => {
                const isSelected = selectedValue === number.toString();
                return (
                  <button
                    key={number}
                    type="button"
                    onClick={() => handleGuestSelect(number.toString())}
                    className={`w-full px-4 py-2.5 text-sm text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {number}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {hint && !isOpen && (
        <p className={`mt-1 text-sm ${error ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {hint}
        </p>
      )}
    </div>
  );
}

