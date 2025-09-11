'use client';

import React, { useState, useEffect } from 'react';
import { Booking } from '@/types/booking';
import { 
  BookingStatus,
  BOOKING_STATUS_LABELS,
  getAvailableStatusTransitions,
  isBookingExpired,
  getBookingStatusConfig,
  BOOKING_STATUS
} from '@/constants/booking-status';
import Select from '../form/Select';

interface StatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onStatusChange: (bookingId: number, newStatus: BookingStatus) => Promise<void>;
}

const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  isOpen,
  onClose,
  booking,
  onStatusChange,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen && booking) {
      setSelectedStatus(null);
      setIsSubmitting(false);
    }
  }, [isOpen, booking]);

  if (!isOpen || !booking) return null;

  const isExpired = isBookingExpired(booking.booking_date, booking.booking_time);
  const availableTransitions = getAvailableStatusTransitions(booking.status, isExpired);
  const currentStatusConfig = getBookingStatusConfig(booking.status);


  const statusOptions = availableTransitions.map((status) => ({
    value: status.toString(),
    label: BOOKING_STATUS_LABELS[status]
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedStatus === null) return;

    setIsSubmitting(true);
    try {
      await onStatusChange(booking.id, selectedStatus);
      onClose();
    } catch (error) {
      console.error('Error changing status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Booking Information #{booking.id}
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Booking Information */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Booking General Information
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Customer Name:
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {booking.full_name}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email:
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {booking.email}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone:
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {booking.phone} {booking.social_account_id ? `(${booking.social_account_id})` : ''}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Number of People:
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {booking.number_of_people}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Booking Date:
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {new Date(booking.booking_date).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Booking Time:
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {booking.booking_time}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Total Price:
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {booking.total_price.toLocaleString('vi-VN')} {booking.currency}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Current Status:
                      </label>
                      <div className="mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentStatusConfig.class}`}>
                          {currentStatusConfig.text}
                        </span>
                        {isExpired && booking.status === BOOKING_STATUS.BOOKED && (
                          <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Expired
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {booking.note && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Note:
                      </label>
                      <p className="mt-1 text-sm text-gray-900 dark:text-white">
                        {booking.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Change Form */}
              {availableTransitions.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Change Status
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Status:
                    </label>
                    <Select
                      placeholder="Select New Status"
                      options={statusOptions}
                      value={selectedStatus?.toString() || ''}
                      onChange={(value) => setSelectedStatus(Number(value) as BookingStatus)}
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {isExpired ? 'Expired' : 'Not expired'}
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={selectedStatus === null || isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Updating...' : 'Update Status'}
                    </button>
                  </div>
                </form>
              </div>
              )}
            </div>

            {/* Right Column - Booking Details */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Service Details
              </h3>
              {booking.booking_details && Object.keys(booking.booking_details).length > 0 ? (
                <div className="space-y-4">
                  {/* Group services by guest */}
                  {Object.entries(booking.booking_details).map(([guestKey, guestServices], index) => 
                     (
                      <div key={guestKey}>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Guest {index + 1}:
                        </h4>
                        <div className="space-y-1 mb-3">
                          {guestServices.map((service, serviceIndex) => (
                            <div key={`${guestKey}-${serviceIndex}`} className="flex justify-between items-center text-sm">
                              <span className="text-gray-700 dark:text-gray-300">
                                {service.name}
                              </span>
                              <span className="text-gray-900 dark:text-white font-medium">
                                {service.price.toLocaleString('vi-VN')} {service.currency}
                              </span>
                            </div>
                          ))}
                        </div>
                        {index < Object.keys(booking.booking_details).length - 1 && (
                          <div className="border-b border-gray-200 dark:border-gray-700 mb-3"></div>
                        )}
                      </div>
                    )
                  )}
                  
                  {/* Total Price */}
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        Total price
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {booking.total_price.toLocaleString('vi-VN')} {booking.currency}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No service details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusChangeModal;
