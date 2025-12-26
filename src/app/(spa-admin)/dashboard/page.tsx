import { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Dashboard | SPA Admin Dashboard',
  description: 'View comprehensive statistics and reports for your spa business including bookings, revenue, top products, and agencies.',
  keywords: 'dashboard, statistics, reports, bookings, revenue, spa management',
  openGraph: {
    title: 'Dashboard | SPA Admin Dashboard',
    description: 'View comprehensive statistics and reports for your spa business.',
    type: 'website'
  }
}

export default function DashboardPage() {
  return <DashboardClient />;
}

