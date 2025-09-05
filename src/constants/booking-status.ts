/**
 * Booking Status Constants
 */

// Booking Status Values
export const BOOKING_STATUS = {
  BOOKED: 0,
  DONE: 1,
  CANCELLED: 2,
} as const;

// Booking Status Type
export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

// Booking Status Configuration
export const BOOKING_STATUS_CONFIG = {
  [BOOKING_STATUS.BOOKED]: {
    text: 'Booked',
    class: 'bg-blue-100 text-center text-blue-800',
    color: 'blue',
  },
  [BOOKING_STATUS.DONE]: {
    text: 'Done',
    class: 'bg-green-100 text-center text-green-800',
    color: 'green',
  },
  [BOOKING_STATUS.CANCELLED]: {
    text: 'Cancelled',
    class: 'bg-red-100 text-center text-red-800',
    color: 'red',
  },
} as const;

// Expired Status Configuration
export const EXPIRED_STATUS_CONFIG = {
  text: 'Expired',
  class: 'bg-gray-100 text-center text-gray-600',
  color: 'gray',
} as const;

// Helper Functions
export const getBookingStatusConfig = (status: BookingStatus) => {
  return BOOKING_STATUS_CONFIG[status] || BOOKING_STATUS_CONFIG[BOOKING_STATUS.BOOKED];
};

export const isBookingExpired = (bookingDate: string, bookingTime: string): boolean => {
  const bookingDateTime = new Date(bookingDate);
  bookingDateTime.setHours(
    parseInt(bookingTime.split(":")[0]), 
    parseInt(bookingTime.split(":")[1]), 
    0, 
    0
  );
  const currentDateTime = new Date();
  return currentDateTime > bookingDateTime;
};

export const shouldShowExpired = (status: BookingStatus, isExpired: boolean): boolean => {
  return isExpired && status === BOOKING_STATUS.BOOKED;
};

// Status Labels for Forms/UI
export const BOOKING_STATUS_LABELS = {
  [BOOKING_STATUS.BOOKED]: 'Booked',
  [BOOKING_STATUS.DONE]: 'Done',
  [BOOKING_STATUS.CANCELLED]: 'Cancelled',
} as const;

// Status Transition Logic
export const getAvailableStatusTransitions = (
  currentStatus: BookingStatus, 
  isExpired: boolean
): BookingStatus[] => {
  if (isExpired) {
    switch (currentStatus) {
      case BOOKING_STATUS.BOOKED:
        return [BOOKING_STATUS.DONE, BOOKING_STATUS.CANCELLED];
      case BOOKING_STATUS.DONE:
        return [BOOKING_STATUS.CANCELLED];
      case BOOKING_STATUS.CANCELLED:
        return [BOOKING_STATUS.DONE];
      default:
        return [];
    }
  } else {
    switch (currentStatus) {
      case BOOKING_STATUS.BOOKED:
        return [BOOKING_STATUS.DONE, BOOKING_STATUS.CANCELLED];
      case BOOKING_STATUS.DONE:
        return [BOOKING_STATUS.BOOKED];
      case BOOKING_STATUS.CANCELLED:
        return [BOOKING_STATUS.BOOKED];
      default:
        return [];
    }
  }
};

export const BOOKING_STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: BOOKING_STATUS.BOOKED.toString(), label: BOOKING_STATUS_LABELS[BOOKING_STATUS.BOOKED] },
  { value: BOOKING_STATUS.DONE.toString(), label: BOOKING_STATUS_LABELS[BOOKING_STATUS.DONE] },
  { value: BOOKING_STATUS.CANCELLED.toString(), label: BOOKING_STATUS_LABELS[BOOKING_STATUS.CANCELLED] },
];
