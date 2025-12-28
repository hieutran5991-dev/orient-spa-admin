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
  const [cancellationReason, setCancellationReason] = useState('');
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

    // Validate cancellation reason if status is CANCELLED
    if (selectedStatus === BOOKING_STATUS.CANCELLED && !cancellationReason.trim()) {
      showError(
        'Validation Error',
        'Cancellation reason is required when cancelling a booking',
        AlertConfigs.ERROR
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateBookingStatus(
        booking.id, 
        selectedStatus,
        selectedStatus === BOOKING_STATUS.CANCELLED ? cancellationReason : undefined
      );
      
      if (response.status === HTTP_CODES.SUCCESS) {
        showSuccess(
          AlertMessages.SUCCESS.BOOKING_UPDATED.title,
          AlertMessages.SUCCESS.BOOKING_UPDATED.message,
          AlertConfigs.SUCCESS
        );
        
        // Update booking data from response
        if (response.data?.data) {
          setBooking(response.data.data);
          setSelectedStatus(null);
          setCancellationReason('');
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading booking details...</p>
        </div>
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
            ← Back to List
          </Link>
        </div>
        <ComponentCard title="Error">
          <div className="text-center py-12">
            <div className="text-red-500 dark:text-red-400 text-4xl mb-4">⚠️</div>
            <p className="text-red-500 dark:text-red-400 font-medium">
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Booking Details
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Booking ID: #{booking.id}
          </p>
        </div>
        <Link
          href="/bookings"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          ← Back to List
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Booking Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information Card */}
          <ComponentCard title="Customer Information">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Full Name
                  </label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {booking.full_name}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Email
                  </label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white break-all">
                    {booking.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    <span className="text-gray-600 dark:text-gray-400">{booking.tel_prefix}</span>
                    {booking.phone}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Nation
                  </label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {booking.nation || 'N/A'}
                  </p>
                </div>
                {booking.vn_phone_number && (
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      VN Phone Number
                    </label>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      +84 {booking.vn_phone_number}
                    </p>
                  </div>
                )}
                {booking.social_app && (
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Social App
                    </label>
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {booking.social_app === 'kakaotalk' ? 'KakaoTalk' : 
                       booking.social_app === 'whatsapp' ? 'WhatsApp' :
                       booking.social_app === 'line' ? 'Line' :
                       booking.social_app === 'zalo' ? 'Zalo' :
                       booking.social_app}
                    </p>
                  </div>
                )}
                {booking.social_account_id && (
                  <div className="space-y-1 sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Social Account ID
                    </label>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {booking.social_app && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mr-2 capitalize">
                          {booking.social_app === 'kakaotalk' ? 'KakaoTalk' : 
                           booking.social_app === 'whatsapp' ? 'WhatsApp' :
                           booking.social_app === 'line' ? 'Line' :
                           booking.social_app === 'zalo' ? 'Zalo' :
                           booking.social_app}
                        </span>
                      )}
                      {booking.social_account_id}
                    </p>
                  </div>
                )}
                {booking.source && (
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Source
                    </label>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {booking.source.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ComponentCard>

          {/* Booking Details Card */}
          <ComponentCard title="Booking Information">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Booking Date
                  </label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(booking.booking_date).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Booking Time
                  </label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {booking.booking_time}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Number of People
                  </label>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {booking.number_of_people} {booking.number_of_people === 1 ? 'person' : 'people'}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Status
                  </label>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${currentStatusConfig.class}`}>
                      {currentStatusConfig.text}
                    </span>
                    {isExpired && booking.status === BOOKING_STATUS.BOOKED && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                        Expired
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {booking.note && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Note
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    {booking.note}
                  </p>
                </div>
              )}
            </div>
          </ComponentCard>

          {/* Service Details Card */}
          <ComponentCard title="Service Details">
            {booking.booking_details && Object.keys(booking.booking_details).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(booking.booking_details)
                  .filter(([, guestServices]) => guestServices && Array.isArray(guestServices))
                  .map(([guestKey, guestServices], index) => (
                    <div key={guestKey} className={index > 0 ? 'pt-4 border-t border-gray-200 dark:border-gray-700' : ''}>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Guest {index + 1}
                      </h4>
                      <div className="space-y-2">
                        {guestServices!.map((service, serviceIndex) => (
                          <div 
                            key={`${guestKey}-${serviceIndex}`} 
                            className="flex justify-between items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {service.name}
                              </p>
                              {service.description && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {service.description}
                                </p>
                              )}
                              {service.duration && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  Duration: {service.duration} minutes
                                </p>
                              )}
                            </div>
                            <div className="text-right ml-4">
                              {Object.entries(service.prices || {}).map(
                                ([currencyCode, price]) => (
                                  <div key={currencyCode} className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {formatPriceWithCurrency(price, currencyCode)}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                
                {/* Total Price */}
                <div className="pt-4 mt-4 border-t-2 border-gray-300 dark:border-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900 dark:text-white">
                      Total Price
                    </span>
                    <div className="text-right space-y-1">
                      {Object.entries(booking.total_prices || {}).map(
                        ([currencyCode, price]) => (
                          <div key={currencyCode} className="text-base font-bold text-gray-900 dark:text-white">
                            {formatPriceWithCurrency(price, currencyCode)}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No service details available
                </p>
              </div>
            )}
          </ComponentCard>
        </div>

        {/* Right Column - Status Change */}
        <div className="lg:col-span-1">
          {availableTransitions.length > 0 && (
            <ComponentCard title="Update Status">
              <form onSubmit={handleStatusChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Status <span className="text-red-500">*</span>
                  </label>
                  <Select
                    placeholder="Select New Status"
                    options={statusOptions}
                    value={selectedStatus?.toString() || ''}
                    onChange={(value) => {
                      setSelectedStatus(Number(value) as BookingStatus);
                      if (Number(value) !== BOOKING_STATUS.CANCELLED) {
                        setCancellationReason('');
                      }
                    }}
                  />
                  {isExpired && (
                    <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>This booking has expired</span>
                    </p>
                  )}
                </div>

                {/* Cancellation Reason Field */}
                {selectedStatus === BOOKING_STATUS.CANCELLED && (
                  <div className="animate-in slide-in-from-top-2 duration-200">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cancellation Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                      placeholder="Please provide a reason for cancellation..."
                      rows={4}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      This field is required when cancelling a booking
                    </p>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={
                      selectedStatus === null || 
                      isSubmitting || 
                      (selectedStatus === BOOKING_STATUS.CANCELLED && !cancellationReason.trim())
                    }
                    className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                        Updating...
                      </span>
                    ) : (
                      'Update Status'
                    )}
                  </button>
                </div>
              </form>
            </ComponentCard>
          )}
        </div>
      </div>
    </div>
  );
}

