'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import ComponentCard from '../common/ComponentCard';
import { BookingByMonth } from '@/types/report';
import { formatPriceWithCurrency } from '@/lib/currency';
import { useTheme } from '@/context/ThemeContext';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface BookingsByMonthProps {
  bookingsByMonth: BookingByMonth[];
}

export default function BookingsByMonth({ bookingsByMonth }: BookingsByMonthProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!bookingsByMonth || bookingsByMonth.length === 0) {
    return (
      <ComponentCard title="Bookings by Month">
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No monthly bookings data available
        </div>
      </ComponentCard>
    );
  }

  // Prepare data for chart
  const months = bookingsByMonth.map((item) => {
    // Format month from "2025-11" to "Nov 2025"
    const [year, month] = item.month.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  });

  const bookingsCount = bookingsByMonth.map((item) => item.count);
  const revenueVnd = bookingsByMonth.map((item) => item.revenue_vnd);
  const revenueUsd = bookingsByMonth.map((item) => item.revenue_usd);

  const isDark = theme === 'dark';
  const textColor = isDark ? '#9CA3AF' : '#6B7280';
  const gridColor = isDark ? '#374151' : '#E5E7EB';

  const chartOptions = useMemo(() => ({
    chart: {
      type: 'bar' as const,
      height: 400,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: [textColor],
      },
      formatter: (val: number) => {
        return val.toLocaleString('en-US');
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    colors: ['#3B82F6', '#10B981'], // Blue for bookings, Green for revenue
    xaxis: {
      categories: months,
      labels: {
        style: {
          colors: textColor,
        },
      },
    },
    yaxis: [
      {
        title: {
          text: 'Bookings',
          style: {
            color: '#3B82F6',
          },
        },
        labels: {
          style: {
            colors: textColor,
          },
        },
      },
      {
        opposite: true,
        title: {
          text: 'Revenue (VND)',
          style: {
            color: '#10B981',
          },
        },
        labels: {
          style: {
            colors: textColor,
          },
          formatter: (value: number) => {
            if (value >= 1000000) {
              return `${(value / 1000000).toFixed(1)}M`;
            } else if (value >= 1000) {
              return `${(value / 1000).toFixed(1)}K`;
            }
            return value.toString();
          },
        },
      },
    ],
    fill: {
      opacity: 1,
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: isDark ? 'dark' : 'light',
      custom: ({ series, seriesIndex, dataPointIndex }: any) => {
        const bookings = series[0][dataPointIndex];
        const revenueVndValue = series[1][dataPointIndex];
        const revenueUsdValue = revenueUsd[dataPointIndex];
        const month = months[dataPointIndex];
        
        return `
          <div class="apexcharts-tooltip-title" style="font-family: inherit; font-size: 12px;">${month}</div>
          <div class="apexcharts-tooltip-series-group" style="order: 1; display: flex; flex-direction: column; padding: 0;">
            <span class="apexcharts-tooltip-text-y-label" style="font-size: 12px; color: #3B82F6;">Bookings: </span>
            <span class="apexcharts-tooltip-text-y-value" style="font-size: 12px; color: #3B82F6;">${bookings.toLocaleString('en-US')}</span>
          </div>
          <div class="apexcharts-tooltip-series-group" style="order: 2; display: flex; flex-direction: column; padding: 0;">
            <span class="apexcharts-tooltip-text-y-label" style="font-size: 12px; color: #10B981;">Revenue: </span>
            <span class="apexcharts-tooltip-text-y-value" style="font-size: 12px; color: #10B981;">${formatPriceWithCurrency(revenueVndValue, 'VND')} / ${formatPriceWithCurrency(revenueUsdValue, 'USD')}</span>
          </div>
        `;
      },
    },
    legend: {
      show: true,
      position: 'top' as const,
      horizontalAlign: 'left' as const,
      offsetY: -5,
      labels: {
        colors: textColor,
      },
      markers: {
        width: 12,
        height: 12,
        radius: 12,
      },
      itemMargin: {
        horizontal: 15,
        vertical: 0,
      },
    },
    grid: {
      borderColor: gridColor,
      strokeDashArray: 4,
    },
    theme: {
      mode: theme as 'light' | 'dark',
    },
  }), [months, revenueUsd, theme, textColor, gridColor, isDark]);

  const chartSeries = [
    {
      name: 'Bookings',
      data: bookingsCount,
    },
    {
      name: 'Revenue (VND)',
      data: revenueVnd,
    },
  ];

  return (
    <ComponentCard title="Bookings by Month">
      {isMounted && (
        <div className="w-full">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="bar"
            height={400}
          />
        </div>
      )}
      {!isMounted && (
        <div className="flex items-center justify-center h-[400px]">
          <div className="text-gray-500 dark:text-gray-400">Loading chart...</div>
        </div>
      )}
    </ComponentCard>
  );
}

