'use client';

import { useEffect, useState } from 'react';
import ListPage from '@/components/agencies/ListPage';
import { getAgencies } from '@/api/agency';
import { Agency } from '@/types/agency';
import { PaginationInfo } from '@/types/booking';

export default function AgenciesClient() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage] = useState<number>(10);

  const fetchAgencies = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await getAgencies(page, perPage);
      if (response.data?.data && response.data?.pagination) {
        setAgencies(response.data.data);
        setPagination(response.data.pagination);
        setIsError(false);
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error('Error fetching agencies:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencies(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <ListPage 
      agencies={agencies} 
      pagination={pagination}
      isError={isError}
      isLoading={isLoading}
      onPageChange={handlePageChange}
    />
  );
}

