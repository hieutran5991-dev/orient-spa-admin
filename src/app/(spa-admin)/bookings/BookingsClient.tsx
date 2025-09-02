'use client';

import { useEffect, useState } from 'react';
import ListPage from '@/components/bookings/ListPage';
import { getBookings } from '@/api/booking';
import { Booking } from '@/types/booking';

export default function BookingsClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    getBookings().then((response) => {
      if (response.data?.data) {
        setBookings(response.data.data);
      } else {
        setIsError(true);
      }
    }).catch((error) => {
      console.error('Error fetching bookings:', error);
      setIsError(true);
    });
  }, []);

  return <ListPage bookings={bookings} isError={isError} />;
}
