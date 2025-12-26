'use client';

import { useState, useEffect, useRef } from 'react';
import Label from './Label';
import { TimeIcon } from '@/icons';
import TimeSlotPicker from '../bookings/TimeSlotPicker';

type PropsType = {
  id: string;
  onChange?: (time: string) => void;
  label?: string;
  placeholder?: string;
  value?: string;
  selectedDate?: Date | null;
  error?: boolean;
  hint?: string;
};

export default function TimePicker({
  id,
  onChange,
  label,
  placeholder = 'Select time',
  value,
  selectedDate,
  error,
  hint,
}: PropsType) {
  const [selectedTime, setSelectedTime] = useState<string>(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);

  // Update internal state when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedTime(value);
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

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setIsOpen(false);
    if (onChange) {
      onChange(time);
    }
  };

  const formatTimeForDisplay = (time: string): string => {
    if (!time) return '';
    return time;
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
            selectedTime ? 'text-gray-800 dark:text-white/90' : 'text-gray-400 dark:text-gray-400'
          }`}
        >
          {selectedTime ? formatTimeForDisplay(selectedTime) : placeholder}
        </div>

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <TimeIcon className="size-6" />
        </span>

        {/* Popup */}
        {isOpen && (
          <div className="absolute z-[9999] mt-2 w-full max-w-2xl" ref={popupRef}>
            <TimeSlotPicker
              selectedTime={selectedTime}
              selectedDate={selectedDate}
              onTimeSelect={handleTimeSelect}
              error={hint}
            />
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

