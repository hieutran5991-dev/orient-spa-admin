'use client';

import ComponentCard from '../common/ComponentCard';
import { TopCategory } from '@/types/report';
import { formatPriceWithCurrency } from '@/lib/currency';

interface TopCategoriesProps {
  categories: TopCategory[];
}

export default function TopCategories({ categories }: TopCategoriesProps) {
  return (
    <ComponentCard title="Top Categories">
      {categories.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No categories data available
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((category, index) => {
            const colors = [
              { bg: 'bg-gradient-to-r from-green-500 to-green-600', badge: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', border: 'border-green-200 dark:border-green-800', card: 'bg-green-50/50 dark:bg-green-900/10' },
              { bg: 'bg-gradient-to-r from-teal-500 to-teal-600', badge: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-600 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800', card: 'bg-teal-50/50 dark:bg-teal-900/10' },
              { bg: 'bg-gradient-to-r from-emerald-500 to-emerald-600', badge: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', card: 'bg-emerald-50/50 dark:bg-emerald-900/10' },
              { bg: 'bg-gradient-to-r from-lime-500 to-lime-600', badge: 'bg-lime-100 dark:bg-lime-900/30', text: 'text-lime-600 dark:text-lime-400', border: 'border-lime-200 dark:border-lime-800', card: 'bg-lime-50/50 dark:bg-lime-900/10' },
              { bg: 'bg-gradient-to-r from-amber-500 to-amber-600', badge: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', card: 'bg-amber-50/50 dark:bg-amber-900/10' },
            ];
            const color = colors[index % colors.length];
            return (
              <div
                key={category.category_id}
                className={`flex items-center justify-between p-4 rounded-xl border-2 ${color.border} ${color.card} hover:shadow-md transition-all duration-300`}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full ${color.bg} flex items-center justify-center shadow-md`}>
                    <span className="text-sm font-bold text-white">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {category.category_name}
                    </p>
                    <p className={`text-xs font-medium ${color.text}`}>
                      {category.count} bookings
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatPriceWithCurrency(category.revenue_vnd, 'VND')}
                  </p>
                  <p className={`text-xs font-medium ${color.text}`}>
                    {formatPriceWithCurrency(category.revenue_usd, 'USD')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ComponentCard>
  );
}

