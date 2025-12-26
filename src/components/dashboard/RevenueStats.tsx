'use client';

import ComponentCard from '../common/ComponentCard';
import type { RevenueStats } from '@/types/report';
import { formatPriceWithCurrency } from '@/lib/currency';

interface RevenueStatsProps {
  revenue: RevenueStats;
}

export default function RevenueStats({ revenue }: RevenueStatsProps) {
  const revenueItems = [
    {
      label: 'Total Revenue',
      vnd: revenue.total_vnd,
      usd: revenue.total_usd,
      bgGradient: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/20',
      borderColor: 'border-indigo-300 dark:border-indigo-700',
      textColor: 'text-indigo-700 dark:text-indigo-300',
      icon: '💎'
    },
    {
      label: 'Today',
      vnd: revenue.today_vnd,
      usd: revenue.today_usd,
      bgGradient: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20',
      borderColor: 'border-emerald-300 dark:border-emerald-700',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      icon: '📈'
    },
    {
      label: 'This Week',
      vnd: revenue.this_week_vnd,
      usd: revenue.this_week_usd,
      bgGradient: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-800/20',
      borderColor: 'border-cyan-300 dark:border-cyan-700',
      textColor: 'text-cyan-700 dark:text-cyan-300',
      icon: '📅'
    },
    {
      label: 'This Month',
      vnd: revenue.this_month_vnd,
      usd: revenue.this_month_usd,
      bgGradient: 'from-rose-500 to-rose-600',
      bgColor: 'bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/30 dark:to-rose-800/20',
      borderColor: 'border-rose-300 dark:border-rose-700',
      textColor: 'text-rose-700 dark:text-rose-300',
      icon: '📊'
    }
  ];

  return (
    <ComponentCard title="Revenue Statistics" className="border-2 border-indigo-200 dark:border-indigo-800 shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {revenueItems.map((item) => (
          <div
            key={item.label}
            className={`p-6 rounded-xl border-2 ${item.bgColor} ${item.borderColor} hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden group`}
          >
            <div className="flex items-center justify-between mb-4">
              <p className={`text-sm font-bold uppercase tracking-wide ${item.textColor}`}>
                {item.label}
              </p>
              <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
            </div>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
              {formatPriceWithCurrency(item.vnd, 'VND')}
            </p>
            <p className={`text-sm font-semibold ${item.textColor} opacity-90`}>
              {formatPriceWithCurrency(item.usd, 'USD')}
            </p>
            <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br ${item.bgGradient} opacity-15 rounded-full -mr-12 -mb-12 group-hover:opacity-20 transition-opacity duration-300`}></div>
            <div className={`absolute top-0 left-0 w-16 h-16 bg-gradient-to-br ${item.bgGradient} opacity-5 rounded-full -ml-8 -mt-8`}></div>
          </div>
        ))}
      </div>
    </ComponentCard>
  );
}

