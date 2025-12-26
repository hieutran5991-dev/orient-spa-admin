'use client';

interface TimeSlotPickerProps {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
  selectedDate?: Date | null;
  error?: string;
}

interface TimeSlot {
  time: string;
  label: string;
}

const generateTimeSlots = (): { period: string; slots: TimeSlot[] }[] => {
  const morning: TimeSlot[] = [];
  const afternoon: TimeSlot[] = [];
  const evening: TimeSlot[] = [];

  // Generate time slots from 10:00 to 20:30 with 30-minute intervals
  for (let hour = 10; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 20 && minute > 30) break; // Stop at 20:30
      
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const slot: TimeSlot = { time, label: time };

      if (hour < 12) {
        morning.push(slot);
      } else if (hour < 19) {
        afternoon.push(slot);
      } else {
        evening.push(slot);
      }
    }
  }

  return [
    { period: 'Morning', slots: morning },
    { period: 'Afternoon', slots: afternoon },
    { period: 'Evening', slots: evening },
  ];
};

export default function TimeSlotPicker({ selectedTime, onTimeSelect, selectedDate, error }: TimeSlotPickerProps) {
  const timeSlotGroups = generateTimeSlots();

  const getDateLabel = () => {
    if (selectedDate) {
      return selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    return new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleTimeClick = (time: string) => {
    onTimeSelect(time);
  };

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6 shadow-lg">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-6">
          Availability for {getDateLabel()}
        </h3>

        <div className="space-y-6">
          {timeSlotGroups.map((group) => (
            <div key={group.period}>
              <div className="mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {group.period}:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.slots.map((slot) => {
                  const isSelected = selectedTime === slot.time;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => handleTimeClick(slot.time)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white/90 dark:hover:bg-gray-600'
                      }`}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

