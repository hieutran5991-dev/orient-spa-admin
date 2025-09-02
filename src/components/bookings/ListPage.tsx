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
  BOOKING_STATUS,
  BOOKING_STATUS_LABELS
} from "@/constants/booking-status";
import StatusChangeModal from "./StatusChangeModal";
import { updateBookingStatus } from "@/api/booking";
import { useAlert } from "@/context/AlertContext";
import { AlertMessages, AlertConfigs } from "@/lib/alertMessages";
import { HTTP_CODES } from "@/constants/http-codes";

export default function ListPage({ bookings, isError }: { bookings: Booking[], isError: boolean }) {
  const { showSuccess, showError } = useAlert();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter states
  const [dateRange, setDateRange] = useState<{
    startDate: string;
    endDate: string;
  }>({
    startDate: '',
    endDate: ''
  });
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');

  // Filter bookings based on selected filters
  const filteredBookings = useMemo(() => {
    let filtered = [...bookings];

    // Filter by date range
    if (dateRange.startDate || dateRange.endDate) {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.created_at || booking.booking_date);
        let isInRange = true;

        if (dateRange.startDate) {
          const startDate = new Date(dateRange.startDate);
          isInRange = bookingDate >= startDate;
        }

        if (dateRange.endDate) {
          const endDate = new Date(dateRange.endDate);
          endDate.setHours(23, 59, 59, 999); // Include the entire end date
          isInRange = bookingDate <= endDate;
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
  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStatusFilterChange = (value: BookingStatus | 'all') => {
    setStatusFilter(value);
  };

  const clearFilters = () => {
    setDateRange({ startDate: '', endDate: '' });
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
        // Refresh the page to show updated data
        window.location.reload();
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

  // Open status change modal
  const openStatusChangeModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  // Close status change modal
  const closeStatusChangeModal = () => {
    setSelectedBooking(null);
    setIsModalOpen(false);
  };

  // Define table columns
  const columns: Column[] = isError ? [] : [
    {
      key: 'first_name',
      header: 'Customer Name',
      sortable: true,
      width: '15%',
      render: (value: unknown, row: Record<string, unknown>) => (
        <span className="font-medium">
          {String(value)} {row.last_name as string}
        </span>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      width: '15%',
    },
    {
      key: 'phone',
      header: 'Phone',
      sortable: false,
      width: '12%',
    },
    {
      key: 'booking_date',
      header: 'Date',
      sortable: true,
      width: '10%',
      render: (value: unknown) => (
        <span className="font-medium text-blue-600">
          {new Date(String(value)).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'booking_time',
      header: 'Time',
      sortable: false,
      width: '8%',
    },
    {
      key: 'number_of_people',
      header: 'People',
      sortable: true,
      width: '8%',
      render: (value: unknown) => (
        <span className="font-medium text-green-600">{String(value)}</span>
      ),
    },
    {
      key: 'total_price',
      header: 'Total Price (VND)',
      sortable: true,
      width: '10%'
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      width: '10%',
      render: (value: unknown, row: Record<string, unknown>) => {
        const status = Number(value) as BookingStatus;
        const bookingDate = String(row.booking_date);
        const bookingTime = String(row.booking_time);
        
        const config = getBookingStatusConfig(status);
        const expired = isBookingExpired(bookingDate, bookingTime);
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
      width: '22%',
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
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Start Date"
              />
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="End Date"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value === 'all' ? 'all' : parseInt(e.target.value) as BookingStatus)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Statuses</option>
              <option value={BOOKING_STATUS.BOOKED}>{BOOKING_STATUS_LABELS[BOOKING_STATUS.BOOKED]}</option>
              <option value={BOOKING_STATUS.DONE}>{BOOKING_STATUS_LABELS[BOOKING_STATUS.DONE]}</option>
              <option value={BOOKING_STATUS.CANCELLED}>{BOOKING_STATUS_LABELS[BOOKING_STATUS.CANCELLED]}</option>
            </select>
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
              Showing {filteredBookings.length} of {bookings.length} bookings
            </span>
          </div>
        </div>
      </ComponentCard>
      
      <ComponentCard title="Bookings">
        <DataTable
          data={filteredBookings as unknown as Record<string, unknown>[]}
          columns={columns}
          itemsPerPage={10}
          searchable={false}
          sortable={true}
          emptyMessage={isError ? "Failed to load bookings. Please try again later." : "No bookings found."}
        />
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
