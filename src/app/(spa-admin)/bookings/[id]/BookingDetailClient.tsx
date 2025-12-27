'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBooking } from '@/api/booking';
import { Booking } from '@/types/booking';
import ComponentCard from '@/components/common/ComponentCard';
import { useAlert } from '@/context/AlertContext';
import { AlertMessages, AlertConfigs } from '@/lib/alertMessages';
import { getErrorMessage, getErrorTitle, isPermissionError } from '@/lib/errorHandler';
import { 
  BookingStatus,
  BOOKING_STATUS_LABELS,
  getAvailableStatusTransitions,
  isBookingExpired,
  getBookingStatusConfig,
  BOOKING_STATUS
} from '@/constants/booking-status';
import Select from '@/components/form/Select';
import { formatPriceWithCurrency } from '@/lib/currency';
import { updateBookingStatus } from '@/api/booking';
import { HTTP_CODES } from '@/constants/http-codes';

export default function BookingDetailClient({ bookingId }: { bookingId: number }) {
  const { showSuccess, showError } = useAlert();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await getBooking(bookingId);
        if (response.data?.data) {
          setBooking(response.data.data);
        } else {
          setIsError(true);
        }
      } catch (error) {
        console.error('Error fetching booking:', error);
        setIsError(true);
        
        if (isPermissionError(error)) {
          showError(
            AlertMessages.ERROR.PERMISSION_DENIED.title,
            AlertMessages.ERROR.PERMISSION_DENIED.message,
            AlertConfigs.ERROR
          );
        } else {
          showError(
            getErrorTitle(error),
            getErrorMessage(error),
            AlertConfigs.ERROR
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, showError]);

  const handleStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedStatus === null || !booking) return;

    setIsSubmitting(true);
    try {
      const response = await updateBookingStatus(booking.id, selectedStatus);
      
      if (response.status === HTTP_CODES.SUCCESS) {
        showSuccess(
          AlertMessages.SUCCESS.BOOKING_UPDATED.title,
          AlertMessages.SUCCESS.BOOKING_UPDATED.message,
          AlertConfigs.SUCCESS
        );
        
        // Refresh booking data
        const refreshResponse = await getBooking(bookingId);
        if (refreshResponse.data?.data) {
          setBooking(refreshResponse.data.data);
          setSelectedStatus(null);
        }
      } else {
        showError(
          AlertMessages.ERROR.SAVE_ERROR.title,
          AlertMessages.ERROR.SAVE_ERROR.message,
          AlertConfigs.ERROR
        );
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      const errorTitle = isPermissionError(error) 
        ? AlertMessages.ERROR.PERMISSION_DENIED.title 
        : getErrorTitle(error);
      const errorMessage = getErrorMessage(error);
      showError(
        errorTitle,
        errorMessage,
        AlertConfigs.ERROR
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">Loading booking details...</div>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Booking Details
          </h1>
          <Link
            href="/bookings"
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Back to List
          </Link>
        </div>
        <ComponentCard title="Error">
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400">
              Failed to load booking details. Please try again later.
            </p>
          </div>
        </ComponentCard>
      </div>
    );
  }

  const isExpired = isBookingExpired(booking.booking_date, booking.booking_time);
  const availableTransitions = getAvailableStatusTransitions(booking.status, isExpired);
  const currentStatusConfig = getBookingStatusConfig(booking.status);

  const statusOptions = availableTransitions.map((status) => ({
    value: status.toString(),
    label: BOOKING_STATUS_LABELS[status]
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Booking Information #{booking.id}
        </h1>
        <Link
          href="/bookings"
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          Back to List
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Booking Information */}
        <div className="space-y-6">
          <ComponentCard title="Booking General Information">
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
                    <strong>{booking.tel_prefix}</strong>{booking.phone}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nation:
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {booking.nation || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Social Account ID:
                  </label>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {booking.social_account_id || 'Not Provided'}
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
                  <div className="mt-1 space-y-1">
                    {Object.entries(booking.total_prices || {}).map(
                      ([currencyCode, price]) => (
                        <div key={currencyCode} className="text-sm text-gray-900 dark:text-white">
                          {currencyCode.toUpperCase()}: {formatPriceWithCurrency(price, currencyCode)}
                        </div>
                      )
                    )}
                  </div>
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
          </ComponentCard>

          {/* Status Change Form */}
          {availableTransitions.length > 0 && (
            <ComponentCard title="Change Status">
              <form onSubmit={handleStatusChange} className="space-y-4">
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
                    type="submit"
                    disabled={selectedStatus === null || isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </form>
            </ComponentCard>
          )}
        </div>

        {/* Right Column - Booking Details */}
        <div>
          <ComponentCard title="Service Details">
            {booking.booking_details && Object.keys(booking.booking_details).length > 0 ? (
              <div className="space-y-4">
                {/* Group services by guest */}
                {Object.entries(booking.booking_details)
                  .filter(([, guestServices]) => guestServices && Array.isArray(guestServices))
                  .map(([guestKey, guestServices], index) => (
                    <div key={guestKey}>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Guest {index + 1}:
                      </h4>
                      <div className="space-y-1 mb-3">
                        {guestServices!.map((service, serviceIndex) => (
                          <div key={`${guestKey}-${serviceIndex}`} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700 dark:text-gray-300">
                              {service.name}
                            </span>
                            <div className="text-gray-900 dark:text-white font-medium space-y-1">
                              {Object.entries(service.prices || {}).map(
                                ([currencyCode, price]) => (
                                  <div key={currencyCode}>
                                    {currencyCode.toUpperCase()}: {formatPriceWithCurrency(price, currencyCode)}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      {index < Object.keys(booking.booking_details).length - 1 && (
                        <div className="border-b border-gray-200 dark:border-gray-700 mb-3"></div>
                      )}
                    </div>
                  ))}
                
                {/* Total Price */}
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Total price
                    </span>
                    <div className="text-right space-y-1">
                      {Object.entries(booking.total_prices || {}).map(
                        ([currencyCode, price]) => (
                          <div key={currencyCode} className="font-semibold text-gray-900 dark:text-white">
                            {currencyCode.toUpperCase()}: {formatPriceWithCurrency(price, currencyCode)}
                          </div>
                        )
                      )}
                    </div>
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
          </ComponentCard>
        </div>
      </div>
    </div>
  );
}

