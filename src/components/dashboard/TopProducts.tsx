'use client';

import ComponentCard from '../common/ComponentCard';
import { TopProduct } from '@/types/report';
import { formatPriceWithCurrency } from '@/lib/currency';

interface TopProductsProps {
  products: TopProduct[];
}

export default function TopProducts({ products }: TopProductsProps) {
  return (
    <ComponentCard title="Top Products">
      {products.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No products data available
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product, index) => {
            const colors = [
              { bg: 'bg-gradient-to-r from-blue-500 to-blue-600', badge: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', card: 'bg-blue-50/50 dark:bg-blue-900/10' },
              { bg: 'bg-gradient-to-r from-indigo-500 to-indigo-600', badge: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800', card: 'bg-indigo-50/50 dark:bg-indigo-900/10' },
              { bg: 'bg-gradient-to-r from-purple-500 to-purple-600', badge: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800', card: 'bg-purple-50/50 dark:bg-purple-900/10' },
              { bg: 'bg-gradient-to-r from-pink-500 to-pink-600', badge: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600 dark:text-pink-400', border: 'border-pink-200 dark:border-pink-800', card: 'bg-pink-50/50 dark:bg-pink-900/10' },
              { bg: 'bg-gradient-to-r from-cyan-500 to-cyan-600', badge: 'bg-cyan-100 dark:bg-cyan-900/30', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-200 dark:border-cyan-800', card: 'bg-cyan-50/50 dark:bg-cyan-900/10' },
            ];
            const color = colors[index % colors.length];
            return (
              <div
                key={product.product_id}
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
                      {product.product_name}
                    </p>
                    <p className={`text-xs font-medium ${color.text}`}>
                      {product.count} bookings
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {formatPriceWithCurrency(product.revenue_vnd, 'VND')}
                  </p>
                  <p className={`text-xs font-medium ${color.text}`}>
                    {formatPriceWithCurrency(product.revenue_usd, 'USD')}
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

