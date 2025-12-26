import { Metadata } from 'next';
import CreateBookingPageForm from '@/components/bookings/CreateBookingPageForm';

export const metadata: Metadata = {
  title: 'Create Booking | SPA Admin Dashboard',
  description: 'Create a new booking with customer information, treatment selection, and scheduling details.',
  keywords: 'create booking, new booking, spa booking, booking form, appointment',
  openGraph: {
    title: 'Create Booking | SPA Admin Dashboard',
    description: 'Create a new booking with customer information and treatment selection.',
    type: 'website',
  },
};

export default function CreateBookingPage() {
  return <CreateBookingPageForm />;
}

