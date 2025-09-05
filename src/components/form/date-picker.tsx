import { useEffect, useState } from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Label from './Label';
import { CalenderIcon } from '../../icons';
import { createStartOfDay, formatDateForDisplay } from '@/lib/datetime';

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: (selectedDates: Date[]) => void;
  defaultDate?: string | Date;
  label?: string;
  placeholder?: string;
  value?: string; // Add value prop for controlled component
};

export default function DatePicker({
  id,
  mode,
  onChange,
  label,
  defaultDate,
  placeholder,
  value,
}: PropsType) {
  const [selectedDate, setSelectedDate] = useState<string>(value || '');

  // Update internal state when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedDate(value);
    }
  }, [value]);

  useEffect(() => {
    // Determine which date to use for initialization
    const initialDate = value || defaultDate;
    
    const flatPickr = flatpickr(`#${id}`, {
      mode: mode || "single",
      static: false,
      monthSelectorType: "static",
      dateFormat: "Y-m-d H:i:s",
      defaultDate: initialDate,
      onChange: (selectedDates) => {
        if (selectedDates && selectedDates.length > 0) {
          const selectedDate = selectedDates[0];
          const dateString = formatDateForDisplay(selectedDate, true);
          setSelectedDate(dateString);

          if (onChange) {
            // Return the date at start of day to avoid timezone issues
            const normalizedDate = createStartOfDay(selectedDate);
            onChange([normalizedDate]);
          }
        }
      },
    });

    return () => {
      if (!Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  }, [mode, onChange, id, defaultDate, value]);

  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative">
        <input
          id={id}
          value={selectedDate}
          placeholder={placeholder}
          readOnly
          className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
        />

        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );
}