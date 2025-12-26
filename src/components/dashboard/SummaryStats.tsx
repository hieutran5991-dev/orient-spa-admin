'use client';

import ComponentCard from '../common/ComponentCard';
import { ReportSummary, BookingsByStatus } from '@/types/report';
import { formatPriceWithCurrency } from '@/lib/currency';

interface SummaryStatsProps {
  summary: ReportSummary;
  bookingsByStatus: BookingsByStatus;
}

export default function SummaryStats({ summary, bookingsByStatus }: SummaryStatsProps) {
  const stats = [
    {
      label: 'Total Bookings',
      value: summary.total_bookings.toLocaleString(),
      icon: '📅',
      bgGradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      showBreakdown: true
    },
    {
      label: 'Total Revenue',
      value: `${formatPriceWithCurrency(summary.total_revenue_vnd, 'VND')} / ${formatPriceWithCurrency(summary.total_revenue_usd, 'USD')}`,
      icon: '💰',
      bgGradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      textColor: 'text-green-600 dark:text-green-400',
      iconBg: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      label: 'Average Booking',
      value: `${formatPriceWithCurrency(summary.average_booking_vnd, 'VND')} / ${formatPriceWithCurrency(summary.average_booking_usd, 'USD')}`,
      icon: '📊',
      bgGradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800',
      textColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      label: 'Total Customers',
      value: summary.total_customers.toLocaleString(),
      icon: '👥',
      bgGradient: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      textColor: 'text-orange-600 dark:text-orange-400',
      iconBg: 'bg-orange-100 dark:bg-orange-900/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <ComponentCard key={index} title={stat.label} className="p-0 overflow-hidden">
          <div className={`p-6 ${stat.bgColor} border-t-4 ${stat.borderColor} relative`}>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex-1">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                {stat.showBreakdown && (
                  <div className="mt-3 space-y-1.5 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">Booked:</span>
                      <span className="text-gray-700 dark:text-gray-300 font-semibold">{bookingsByStatus.booked.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-green-600 dark:text-green-400 font-medium">Done:</span>
                      <span className="text-gray-700 dark:text-gray-300 font-semibold">{bookingsByStatus.done.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-red-600 dark:text-red-400 font-medium">Cancelled:</span>
                      <span className="text-gray-700 dark:text-gray-300 font-semibold">{bookingsByStatus.cancelled.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className={`w-16 h-16 rounded-full ${stat.iconBg} flex items-center justify-center text-3xl ${stat.textColor}`}>
                {stat.icon}
              </div>
            </div>
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.bgGradient} opacity-10 rounded-full -mr-16 -mt-16`}></div>
          </div>
        </ComponentCard>
      ))}
    </div>
  );
}

