'use client';

import { useEffect, useState, useRef } from 'react';
import { getReport, ReportParams } from '@/api/report';
import { ReportData } from '@/types/report';
import SummaryStats from '@/components/dashboard/SummaryStats';
import RevenueStats from '@/components/dashboard/RevenueStats';
import TopProducts from '@/components/dashboard/TopProducts';
import TopCategories from '@/components/dashboard/TopCategories';
import BookingsByDate from '@/components/dashboard/BookingsByDate';
import BookingsByMonth from '@/components/dashboard/BookingsByMonth';
import DatePicker from '@/components/form/date-picker';
import { formatDateForDisplay, formatDateToAPI } from '@/lib/datetime';
import { useAlert } from '@/context/AlertContext';
import { AlertMessages, AlertConfigs } from '@/lib/alertMessages';
import { getErrorMessage, getErrorTitle, isPermissionError } from '@/lib/errorHandler';

export default function DashboardClient() {
  const { showError } = useAlert();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('Failed to load dashboard data. Please try again later.');
  const hasShownErrorRef = useRef<boolean>(false);
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null
  });

  const fetchReport = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const params: ReportParams = {};
      
      if (dateRange.startDate) {
        params.from_date = formatDateToAPI(dateRange.startDate);
      }
      if (dateRange.endDate) {
        params.to_date = formatDateToAPI(dateRange.endDate);
      }

      const response = await getReport(params);
      if (response.data?.data) {
        setReportData(response.data.data);
        setIsError(false);
        hasShownErrorRef.current = false; // Reset error flag on success
      } else {
        setIsError(true);
        setErrorMessage('Failed to load dashboard data. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      setIsError(true);
      
      const errorTitle = isPermissionError(error) 
        ? AlertMessages.ERROR.PERMISSION_DENIED.title 
        : getErrorTitle(error);
      const errorMsg = getErrorMessage(error);
      setErrorMessage(errorMsg);
      
      // Only show alert for permission errors and only once per error type
      if (isPermissionError(error) && !hasShownErrorRef.current) {
        hasShownErrorRef.current = true;
        showError(
          errorTitle,
          errorMsg,
          AlertConfigs.ERROR
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange.startDate, dateRange.endDate]);

  const handleDateRangeChange = (field: 'startDate' | 'endDate', selectedDates: Date[]) => {
    if (selectedDates && selectedDates.length > 0) {
      setDateRange(prev => ({
        ...prev,
        [field]: selectedDates[0]
      }));
    } else {
      setDateRange(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const clearFilters = () => {
    setDateRange({ startDate: null, endDate: null });
  };

  // Quick date range selectors
  const setQuickDateRange = (range: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    switch (range) {
      case 'today':
        startDate = new Date(today);
        endDate = new Date(today);
        break;
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        startDate = yesterday;
        endDate = yesterday;
        break;
      case 'last7days':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 6);
        endDate = new Date(today);
        break;
      case 'last30days':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 29);
        endDate = new Date(today);
        break;
      case 'last90days':
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 89);
        endDate = new Date(today);
        break;
      case 'thisWeek':
        const thisWeekStart = new Date(today);
        const dayOfWeek = thisWeekStart.getDay();
        // Calculate days to subtract to get to Monday (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
        // Monday (1): subtract 0 days, Tuesday (2): subtract 1 day, ..., Sunday (0): subtract 6 days
        const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        thisWeekStart.setDate(thisWeekStart.getDate() - daysToSubtract);
        startDate = thisWeekStart;
        endDate = new Date(today);
        break;
      case 'lastWeek':
        // First, find the start of this week (Monday)
        const thisWeekStartForLastWeek = new Date(today);
        const lastWeekDayOfWeek = thisWeekStartForLastWeek.getDay();
        const daysToSubtractForThisWeek = lastWeekDayOfWeek === 0 ? 6 : lastWeekDayOfWeek - 1;
        thisWeekStartForLastWeek.setDate(thisWeekStartForLastWeek.getDate() - daysToSubtractForThisWeek);
        
        // Last week ends on the day before this week starts (Sunday)
        const lastWeekEnd = new Date(thisWeekStartForLastWeek);
        lastWeekEnd.setDate(lastWeekEnd.getDate() - 1);
        
        // Last week starts 6 days before its end (Monday)
        const lastWeekStart = new Date(lastWeekEnd);
        lastWeekStart.setDate(lastWeekStart.getDate() - 6);
        
        startDate = lastWeekStart;
        endDate = lastWeekEnd;
        break;
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today);
        break;
      case 'lastMonth':
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        startDate = lastMonthStart;
        endDate = lastMonthEnd;
        break;
      case 'thisYear':
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today);
        break;
      case 'lastYear':
        const lastYearStart = new Date(today.getFullYear() - 1, 0, 1);
        const lastYearEnd = new Date(today.getFullYear() - 1, 11, 31);
        startDate = lastYearStart;
        endDate = lastYearEnd;
        break;
      default:
        return;
    }

    setDateRange({ startDate, endDate });
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Date Filter */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        
        {/* Compact Date Range Filter */}
        <div className="flex flex-col gap-3">
          {/* Quick Select Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setQuickDateRange('today')}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => setQuickDateRange('yesterday')}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Yesterday
            </button>
            <button
              onClick={() => setQuickDateRange('last7days')}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setQuickDateRange('thisWeek')}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              This Week
            </button>
            <button
              onClick={() => setQuickDateRange('lastWeek')}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Last Week
            </button>
            <button
              onClick={() => setQuickDateRange('thisMonth')}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              This Month
            </button>
            <button
              onClick={() => setQuickDateRange('lastMonth')}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Last Month
            </button>
            <button
              onClick={() => setQuickDateRange('last30days')}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Last 30 Days
            </button>
            <button
              onClick={() => setQuickDateRange('thisYear')}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              This Year
            </button>
          </div>
          
          {/* Custom Date Range */}
          <div className="flex flex-wrap gap-2 items-end">
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                From Date
              </label>
              <DatePicker
                id="startDate"
                mode="single"
                placeholder="From"
                defaultDate={dateRange.startDate || undefined}
                value={dateRange.startDate ? formatDateForDisplay(dateRange.startDate, false) : ''}
                onChange={(selectedDates) => handleDateRangeChange('startDate', selectedDates)}
              />
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                To Date
              </label>
              <DatePicker
                id="endDate"
                mode="single"
                placeholder="To"
                defaultDate={dateRange.endDate || undefined}
                value={dateRange.endDate ? formatDateForDisplay(dateRange.endDate, false) : ''}
                onChange={(selectedDates) => handleDateRangeChange('endDate', selectedDates)}
              />
            </div>
            <button
              onClick={clearFilters}
              className="h-11 px-4 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors whitespace-nowrap flex items-center"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500 dark:text-gray-400">Loading dashboard data...</div>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-red-500 dark:text-red-400 text-center max-w-md">
            <p className="font-semibold mb-2">Không thể tải dữ liệu dashboard</p>
            <p className="text-sm">{errorMessage}</p>
          </div>
        </div>
      ) : reportData ? (
        <>
          {/* Revenue Stats - First Priority */}
          <RevenueStats revenue={reportData.revenue} />

          {/* Summary Stats */}
          <SummaryStats summary={reportData.summary} bookingsByStatus={reportData.bookings_by_status} />

          {/* Top Products and Top Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopProducts products={reportData.top_products} />
            <TopCategories categories={reportData.top_categories} />
          </div>

          {/* Bookings by Month */}
          {reportData.bookings_by_month && reportData.bookings_by_month.length > 0 && (
            <BookingsByMonth bookingsByMonth={reportData.bookings_by_month} />
          )}

          {/* Bookings by Date */}
          <BookingsByDate bookingsByDate={reportData.bookings_by_date} />
        </>
      ) : null}
    </div>
  );
}

