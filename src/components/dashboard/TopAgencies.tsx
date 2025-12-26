'use client';

import ComponentCard from '../common/ComponentCard';
import { TopAgency } from '@/types/report';
import { formatPriceWithCurrency } from '@/lib/currency';

interface TopAgenciesProps {
  agencies: TopAgency[];
}

export default function TopAgencies({ agencies }: TopAgenciesProps) {
  return (
    <ComponentCard title="Top Agencies">
      {agencies.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No agencies data available
        </div>
      ) : (
        <div className="space-y-4">
          {agencies.map((agency, index) => (
            <div
              key={agency.agency_id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center space-x-4 flex-1">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    #{index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {agency.agency_name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {agency.count} bookings
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatPriceWithCurrency(agency.revenue_vnd, 'VND')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatPriceWithCurrency(agency.revenue_usd, 'USD')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </ComponentCard>
  );
}

