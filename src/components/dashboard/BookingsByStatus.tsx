'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import ComponentCard from '../common/ComponentCard';
import type { BookingsByStatus } from '@/types/report';
import { useTheme } from '@/context/ThemeContext';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface BookingsByStatusProps {
  bookingsByStatus: BookingsByStatus;
}

export default function BookingsByStatus({ bookingsByStatus }: BookingsByStatusProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const total = useMemo(() => bookingsByStatus.booked + bookingsByStatus.done + bookingsByStatus.cancelled, [bookingsByStatus]);

  const isDark = theme === 'dark';
  const textColor = isDark ? '#9CA3AF' : '#6B7280';

  const chartOptions = useMemo(() => ({
    chart: {
      type: 'pie' as const,
      height: 400,
      toolbar: {
        show: true,
        tools: {
          download: true,
        },
      },
    },
    colors: ['#3B82F6', '#10B981', '#EF4444'], // Blue for Booked, Green for Done, Red for Cancelled
    labels: ['Booked', 'Done', 'Cancelled'],
    legend: {
      show: true,
      position: 'bottom' as const,
      horizontalAlign: 'center' as const,
      fontSize: '14px',
      fontFamily: 'inherit',
      fontWeight: 500,
      labels: {
        colors: textColor,
        useSeriesColors: false,
      },
      markers: {
        size: 8,
        strokeWidth: 0,
      },
      itemMargin: {
        horizontal: 15,
        vertical: 5,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '14px',
        fontFamily: 'inherit',
        fontWeight: 600,
      },
      formatter: (val: number) => {
        return `${val.toFixed(1)}%`;
      },
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: isDark ? 'dark' : 'light',
      y: {
        formatter: (value: number) => {
          return `${value.toLocaleString('en-US')} bookings`;
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '16px',
              fontFamily: 'inherit',
              fontWeight: 600,
              color: textColor,
            },
            value: {
              show: true,
              fontSize: '24px',
              fontFamily: 'inherit',
              fontWeight: 700,
              color: '#1F2937',
              formatter: (val: string) => {
                return val;
              },
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '16px',
              fontFamily: 'inherit',
              fontWeight: 600,
              color: textColor,
              formatter: () => {
                return total.toLocaleString('en-US');
              },
            },
          },
        },
      },
    },
    theme: {
      mode: theme as 'light' | 'dark',
    },
  }), [total, theme, textColor, isDark]);

  const chartSeries = useMemo(() => [
    bookingsByStatus.booked,
    bookingsByStatus.done,
    bookingsByStatus.cancelled,
  ], [bookingsByStatus]);

  if (total === 0) {
    return (
      <ComponentCard title="Bookings by Status">
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No bookings data available
        </div>
      </ComponentCard>
    );
  }

  return (
    <ComponentCard title="Bookings by Status">
      {isMounted && (
        <div className="w-full">
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="pie"
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

