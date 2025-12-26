'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import ComponentCard from '../common/ComponentCard';
import { BookingByDate } from '@/types/report';
import { formatPriceWithCurrency } from '@/lib/currency';
import { useTheme } from '@/context/ThemeContext';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface BookingsByDateProps {
  bookingsByDate: BookingByDate[];
}

export default function BookingsByDate({ bookingsByDate }: BookingsByDateProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (bookingsByDate.length === 0) {
    return (
      <ComponentCard title="Bookings by Date">
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No bookings data available
        </div>
      </ComponentCard>
    );
  }

  // Prepare data for chart
  const dates = bookingsByDate.map((item) => {
    const date = new Date(item.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const bookingsCount = bookingsByDate.map((item) => item.count);
  const revenueVnd = bookingsByDate.map((item) => item.revenue_vnd);
  const revenueUsd = bookingsByDate.map((item) => item.revenue_usd);

  const isDark = theme === 'dark';
  const textColor = isDark ? '#9CA3AF' : '#6B7280';
  const gridColor = isDark ? '#374151' : '#E5E7EB';

  const chartOptions = useMemo(() => ({
    chart: {
      type: 'line' as const,
      height: 400,
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: true,
          selection: false,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      zoom: {
        enabled: true,
      },
    },
    stroke: {
      curve: 'smooth' as const,
      width: [3, 3],
    },
    colors: ['#3B82F6', '#10B981'], // Blue for bookings, Green for revenue
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      position: 'top' as const,
      horizontalAlign: 'left' as const,
      floating: false,
      fontSize: '14px',
      fontFamily: 'inherit',
      fontWeight: 500,
      offsetY: -5,
      offsetX: 0,
      labels: {
        colors: textColor,
        useSeriesColors: false,
      },
      markers: {
        size: 6,
        strokeWidth: 0,
      },
      itemMargin: {
        horizontal: 15,
        vertical: 0,
      },
    },
    xaxis: {
      categories: dates,
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
    tooltip: {
      shared: true,
      intersect: false,
      theme: isDark ? 'dark' : 'light',
      custom: ({ series, dataPointIndex }: any) => {
        if (dataPointIndex === undefined || dataPointIndex === null || dataPointIndex < 0) {
          return '';
        }
        
        const bookings = series[0]?.[dataPointIndex] ?? 0;
        const revenueVndValue = series[1]?.[dataPointIndex] ?? 0;
        const revenueUsdValue = revenueUsd[dataPointIndex] ?? 0;
        const date = dates[dataPointIndex] ?? '';
        
        return `
          <div class="apexcharts-tooltip-title" style="font-family: inherit; font-size: 12px;">${date}</div>
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
    grid: {
      borderColor: gridColor,
      strokeDashArray: 4,
    },
    theme: {
      mode: theme as 'light' | 'dark',
    },
  }), [dates, revenueUsd, theme, textColor, gridColor, isDark]);

  const chartSeries = [
    {
      name: 'Bookings',
      type: 'line',
      data: bookingsCount,
    },
    {
      name: 'Revenue (VND)',
      type: 'line',
      data: revenueVnd,
    },
  ];

  return (
    <ComponentCard title="Bookings by Date">
      {isMounted && (
        <div className="w-full">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="line"
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

