'use client';

import { useState, useMemo } from "react";
import ComponentCard from "../common/ComponentCard";
import DataTable, { Column } from "../tables/DataTable";
import { Booking } from "@/types/booking";
import { InfoIcon } from "@/icons";
import { 
  getBookingStatusConfig, 
  isBookingExpired, 
  shouldShowExpired, 
  EXPIRED_STATUS_CONFIG,
  BookingStatus,
  BOOKING_STATUS_OPTIONS
} from "@/constants/booking-status";
import StatusChangeModal from "./StatusChangeModal";
import { updateBookingStatus } from "@/api/booking";
import { useAlert } from "@/context/AlertContext";
import { AlertMessages, AlertConfigs } from "@/lib/alertMessages";
import { HTTP_CODES } from "@/constants/http-codes";
import DatePicker from "../form/date-picker";
import Select from "../form/Select";
import { formatDateForDisplay } from "@/lib/datetime";
import { formatPriceWithCurrency } from "@/lib/currency";
import { PaginationInfo } from "@/types/booking";
import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";

interface ListPageProps {
  bookings: Booking[];
  pagination: PaginationInfo | null;
  isError: boolean;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export default function ListPage({ bookings, pagination, isError, isLoading, onPageChange }: ListPageProps) {
  const { showSuccess, showError } = useAlert();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter states
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null
  });
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');

  // Filter bookings based on selected filters
  const filteredBookings = useMemo(() => {
    let filtered = [...bookings];

    // Filter by date range
    if (dateRange.startDate || dateRange.endDate) {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.booking_date);
        let isInRange = true;

        if (dateRange.startDate) {
          const startDate = dateRange.startDate;
          isInRange = bookingDate >= startDate;
        }

        if (dateRange.endDate) {
          const endDate = dateRange.endDate;
          isInRange = isInRange && bookingDate <= endDate;
        }

        return isInRange;
      });
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    return filtered;
  }, [bookings, dateRange, statusFilter]);

  // Handle filter changes
  const handleDateRangeChange = (field: 'startDate' | 'endDate', selectedDates: Date[]) => {
    if (selectedDates && selectedDates.length > 0) {
      setDateRange(prev => ({
        ...prev,
        [field]: selectedDates[0]
      }));
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value === 'all' ? 'all' : parseInt(value) as BookingStatus);
  };

  const clearFilters = () => {
    setDateRange({ startDate: null, endDate: null });
    setStatusFilter('all');
  };

  // Handle status change
  const handleStatusChange = async (bookingId: number, newStatus: BookingStatus) => {
    try {
      const response = await updateBookingStatus(bookingId, newStatus);
      
      if (response.status === HTTP_CODES.SUCCESS) {
        showSuccess(
          AlertMessages.SUCCESS.BOOKING_UPDATED.title,
          AlertMessages.SUCCESS.BOOKING_UPDATED.message,
          AlertConfigs.SUCCESS
        );

        setInterval(() => {
          window.location.reload();
        }, 1000);
      } else {
        showError(
          AlertMessages.ERROR.SAVE_ERROR.title,
          AlertMessages.ERROR.SAVE_ERROR.message,
          AlertConfigs.ERROR
        );
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      showError(
        AlertMessages.ERROR.NETWORK_ERROR.title,
        AlertMessages.ERROR.NETWORK_ERROR.message,
        AlertConfigs.ERROR
      );
    }
  };

  // Modal handlers
  const openStatusChangeModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeStatusChangeModal = () => {
    setSelectedBooking(null);
    setIsModalOpen(false);
  };

  // Define table columns
  const columns: Column[] = isError ? [] : [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      width: '5%',
      render: (value: unknown) => (
        <span className="font-medium text-blue-600 dark:text-blue-400">#{String(value)}</span>
      ),
    },
    {
      key: 'customer_name',
      header: 'Customer',
      sortable: true,
      width: '15%',
      render: (value: unknown, row: Record<string, unknown>) => {
        const booking = row as unknown as Booking;
        return (
          <div className="space-y-1">
            <div className="font-medium text-gray-900 dark:text-white">
              {booking.full_name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {booking.email}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <strong>{booking.tel_prefix}</strong>{booking.phone} {booking.nation ? `(${booking.nation})` : ''}
            </div>
          </div>
        );
      },
    },
    {
      key: 'social_account_id',
      header: 'Social ID',
      sortable: true,
      width: '10%',
      render: (value: unknown) => (
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {value ? String(value) : 'Not Provided'}
        </span>
      ),
    },
    {
      key: 'booking_date',
      header: 'Booking Date & Time',
      sortable: true,
      width: '15%',
      render: (value: unknown, row: Record<string, unknown>) => {
        const booking = row as unknown as Booking;
        const bookingDate = new Date(booking.booking_date);
        const bookingTime = booking.booking_time;
        
        return (
          <div className="space-y-1">
            <div className="font-medium text-gray-900 dark:text-white">
              {bookingDate.toLocaleDateString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {bookingTime}
            </div>
          </div>
        );
      },
    },
    {
      key: 'number_of_people',
      header: 'Guests',
      sortable: true,
      width: '10%',
      render: (value: unknown) => (
        <span className="font-medium text-green-600 dark:text-green-400">{String(value)}</span>
      ),
    },
    {
      key: 'total_prices',
      header: 'Total Price',
      sortable: true,
      width: '15%',
      render: (value: unknown, row: Record<string, unknown>) => {
        const booking = row as unknown as Booking;
        return (
          <div className="text-left space-y-1">
            {Object.entries(booking.total_prices || {}).map(
              ([currencyCode, price]) => (
                <div key={currencyCode} className="font-medium text-gray-900 dark:text-white">
                  {currencyCode.toUpperCase()}: {formatPriceWithCurrency(price, currencyCode)}
                </div>
              )
            )}
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      width: '10%',
      render: (value: unknown, row: Record<string, unknown>) => {
        const booking = row as unknown as Booking;
        const status = booking.status as BookingStatus;
        const expired = isBookingExpired(booking.booking_date, booking.booking_time);
        const config = getBookingStatusConfig(status);
        const showExpired = shouldShowExpired(status, expired);
        
        return (
          <div className="flex flex-col space-y-1">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.class}`}>
              {config.text}
            </span>
            {showExpired && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${EXPIRED_STATUS_CONFIG.class}`}>
                {EXPIRED_STATUS_CONFIG.text}
              </span>
            )}
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      width: '20%',
      render: (value: unknown, row: Record<string, unknown>) => (
          <button
            onClick={() => openStatusChangeModal(row as unknown as Booking)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            title="Change Status"
          >
            <InfoIcon className="w-6 h-6 fill-current" />
          </button>
      ),
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Bookings List
        </h1>
      </div>
      
      {/* Filters Section */}
      <ComponentCard title="Filters">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {/* Date Range Filter */}
          <div className="space-y-2 md:col-span-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date Range
            </label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <DatePicker
                  id="startDate"
                  mode="single"
                  placeholder="Start Date"
                  defaultDate={dateRange.startDate || undefined}
                  value={dateRange.startDate ? formatDateForDisplay(dateRange.startDate, true) : ''}
                  onChange={(selectedDates) => handleDateRangeChange('startDate', selectedDates)}
                />
              </div>
              <div className="flex-1">
                <DatePicker
                  id="endDate"
                  mode="single"
                  placeholder="End Date"
                  defaultDate={dateRange.endDate || undefined}
                  value={dateRange.endDate ? formatDateForDisplay(dateRange.endDate, true, false) : ''}
                  onChange={(selectedDates) => handleDateRangeChange('endDate', selectedDates)}
                />
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <Select
              options={BOOKING_STATUS_OPTIONS}
              placeholder="Select Status"
              value={statusFilter === 'all' ? 'all' : statusFilter.toString()}
              onChange={handleStatusFilterChange}
            />
          </div>

          {/* Clear Filters Button */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Clear Filters
            </label>
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {pagination 
                ? `Showing ${pagination.from} to ${pagination.to} of ${pagination.total} bookings`
                : `Showing ${filteredBookings.length} of ${bookings.length} bookings`
              }
            </span>
            {(dateRange.startDate || dateRange.endDate) && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {dateRange.startDate && `From: ${dateRange.startDate.toLocaleDateString()}`}
                {dateRange.startDate && dateRange.endDate && ' | '}
                {dateRange.endDate && `To: ${dateRange.endDate.toLocaleDateString()}`}
              </span>
            )}
          </div>
        </div>
      </ComponentCard>
      
      <ComponentCard title="Bookings">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Bookings</h2>
          <Link
            href="/bookings/create"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            + Create Booking
          </Link>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500 dark:text-gray-400">Loading bookings...</div>
          </div>
        ) : (
          <>
            <DataTable
              data={filteredBookings as unknown as Record<string, unknown>[]}
              columns={columns}
              itemsPerPage={pagination?.per_page || 10}
              searchable={false}
              sortable={true}
              emptyMessage={isError ? "Failed to load bookings. Please try again later." : "No bookings found."}
              disablePagination={true}
            />
            
            {/* Server-side Pagination */}
            {pagination && pagination.last_page > 1 && (
              <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {pagination.from} to {pagination.to} of {pagination.total} results
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => onPageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    <ChevronLeftIcon className="w-4 h-4 stroke-current" />
                  </button>
                  
                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                    let page: number;
                    if (pagination.last_page <= 5) {
                      page = i + 1;
                    } else if (pagination.current_page <= 3) {
                      page = i + 1;
                    } else if (pagination.current_page >= pagination.last_page - 2) {
                      page = pagination.last_page - 4 + i;
                    } else {
                      page = pagination.current_page - 2 + i;
                    }
                    return page;
                  }).map((page) => (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        pagination.current_page === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  {/* Next Button */}
                  <button
                    onClick={() => onPageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    <div className="rotate-180">
                      <ChevronLeftIcon className="w-4 h-4 stroke-current" />
                    </div>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </ComponentCard>

      <StatusChangeModal
        isOpen={isModalOpen}
        onClose={closeStatusChangeModal}
        booking={selectedBooking}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}