import { Metadata } from 'next';
import BookingsClient from '@/app/(spa-admin)/bookings/BookingsClient';

export const metadata: Metadata = {
  title: "Bookings Management | SPA Admin Dashboard",
  description: "Manage spa bookings and appointments, view customer details, and handle booking operations. Access comprehensive booking information including dates, times, and status.",
  keywords: "spa bookings, booking management, appointments, customer bookings, booking status, spa reservations",
  openGraph: {
    title: "Bookings Management | SPA Admin Dashboard",
    description: "Manage spa bookings and appointments, view customer details, and handle booking operations.",
    type: "website",
  },
};

export default function BookingsPage() {
  return <BookingsClient />;
}
