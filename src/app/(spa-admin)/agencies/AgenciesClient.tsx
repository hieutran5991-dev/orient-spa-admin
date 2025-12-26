'use client';

import { useEffect, useState, useRef } from 'react';
import ListPage from '@/components/agencies/ListPage';
import { getAgencies } from '@/api/agency';
import { Agency } from '@/types/agency';
import { PaginationInfo } from '@/types/booking';
import { useAlert } from '@/context/AlertContext';
import { AlertMessages, AlertConfigs } from '@/lib/alertMessages';
import { isPermissionError } from '@/lib/errorHandler';

export default function AgenciesClient() {
  const { showError } = useAlert();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage] = useState<number>(10);
  const hasShownErrorRef = useRef<boolean>(false);

  const fetchAgencies = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await getAgencies(page, perPage);
      if (response.data?.data && response.data?.pagination) {
        setAgencies(response.data.data);
        setPagination(response.data.pagination);
        setIsError(false);
        hasShownErrorRef.current = false; // Reset on success
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error('Error fetching agencies:', error);
      setIsError(true);
      
      // Show error alert if it's a permission error and only once
      if (isPermissionError(error) && !hasShownErrorRef.current) {
        hasShownErrorRef.current = true;
        showError(
          AlertMessages.ERROR.PERMISSION_DENIED.title,
          AlertMessages.ERROR.PERMISSION_DENIED.message,
          AlertConfigs.ERROR
        );
      }
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

