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
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20',
      borderColor: 'border-blue-300 dark:border-blue-700',
      textColor: 'text-blue-700 dark:text-blue-300',
      showBreakdown: true
    },
    {
      label: 'Total Revenue',
      vnd: summary.total_revenue_vnd,
      usd: summary.total_revenue_usd,
      icon: '💰',
      bgGradient: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20',
      borderColor: 'border-emerald-300 dark:border-emerald-700',
      textColor: 'text-emerald-700 dark:text-emerald-300'
    },
    {
      label: 'Average Booking',
      vnd: summary.average_booking_vnd,
      usd: summary.average_booking_usd,
      icon: '📊',
      bgGradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20',
      borderColor: 'border-purple-300 dark:border-purple-700',
      textColor: 'text-purple-700 dark:text-purple-300'
    },
    {
      label: 'Total Customers',
      value: summary.total_customers.toLocaleString(),
      icon: '👥',
      bgGradient: 'from-orange-500 to-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/20',
      borderColor: 'border-orange-300 dark:border-orange-700',
      textColor: 'text-orange-700 dark:text-orange-300'
    }
  ];

  return (
    <ComponentCard title="Summary Statistics" className="border-2 border-blue-200 dark:border-blue-800 shadow-lg">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`p-4 md:p-6 rounded-lg md:rounded-xl border-2 ${stat.bgColor} ${stat.borderColor} hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden group`}
          >
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <p className={`text-[10px] md:text-xs lg:text-sm font-bold uppercase tracking-wide ${stat.textColor}`}>
                {stat.label}
              </p>
              <span className="text-xl md:text-2xl lg:text-3xl group-hover:scale-110 transition-transform duration-300">{stat.icon}</span>
            </div>
            {stat.vnd !== undefined && stat.usd !== undefined ? (
              <>
                <p className="text-lg md:text-xl lg:text-2xl font-extrabold text-gray-900 dark:text-white mb-1 md:mb-2">
                  {formatPriceWithCurrency(stat.vnd, 'VND')}
                </p>
                <p className={`text-[10px] md:text-xs lg:text-sm font-semibold ${stat.textColor} opacity-90`}>
                  {formatPriceWithCurrency(stat.usd, 'USD')}
                </p>
              </>
            ) : (
              <p className="text-lg md:text-xl lg:text-2xl font-extrabold text-gray-900 dark:text-white mb-1 md:mb-2">
                {stat.value}
              </p>
            )}
            {stat.showBreakdown && (
              <div className="mt-2 md:mt-3 space-y-1 pt-2 md:pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center text-[9px] md:text-[10px] lg:text-xs">
                  <span className="text-blue-600 dark:text-blue-400 font-medium">Booked:</span>
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">{bookingsByStatus.booked.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[9px] md:text-[10px] lg:text-xs">
                  <span className="text-green-600 dark:text-green-400 font-medium">Done:</span>
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">{bookingsByStatus.done.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[9px] md:text-[10px] lg:text-xs">
                  <span className="text-red-600 dark:text-red-400 font-medium">Cancelled:</span>
                  <span className="text-gray-700 dark:text-gray-300 font-semibold">{bookingsByStatus.cancelled.toLocaleString()}</span>
                </div>
              </div>
            )}
            <div className={`absolute bottom-0 right-0 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br ${stat.bgGradient} opacity-15 rounded-full -mr-8 -mb-8 md:-mr-10 md:-mb-10 lg:-mr-12 lg:-mb-12 group-hover:opacity-20 transition-opacity duration-300`}></div>
            <div className={`absolute top-0 left-0 w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${stat.bgGradient} opacity-5 rounded-full -ml-6 -mt-6 md:-ml-7 md:-mt-7 lg:-ml-8 lg:-mt-8`}></div>
          </div>
        ))}
      </div>
    </ComponentCard>
  );
}

