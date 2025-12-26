'use client';

import { useEffect, useState } from 'react';
import ListPage from '@/components/bookings/ListPage';
import { getBookings } from '@/api/booking';
import { Booking, PaginationInfo } from '@/types/booking';

export default function BookingsClient() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage] = useState<number>(10);

  const fetchBookings = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await getBookings(page, perPage);
      if (response.data?.data && response.data?.pagination) {
        setBookings(response.data.data);
        setPagination(response.data.pagination);
        setIsError(false);
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <ListPage 
      bookings={bookings} 
      pagination={pagination}
      isError={isError}
      isLoading={isLoading}
      onPageChange={handlePageChange}
    />
  );
}
