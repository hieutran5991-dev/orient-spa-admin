'use client';

import { useEffect, useState, useRef } from 'react';
import SourcesListPage from '@/components/sources/SourcesListPage';
import { getSources } from '@/api/source';
import { Source } from '@/types/source';
import { PaginationInfo } from '@/types/booking';
import { useAlert } from '@/context/AlertContext';
import { AlertMessages, AlertConfigs } from '@/lib/alertMessages';
import { isPermissionError } from '@/lib/errorHandler';

export default function SourcesClient() {
  const { showError } = useAlert();
  const [sources, setSources] = useState<Source[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage] = useState<number>(10);
  const hasShownErrorRef = useRef<boolean>(false);

  const fetchSources = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await getSources(page, perPage);
      if (response.data && response.data.data && response.data.pagination) {
        // Ensure data is an array
        const sourcesData = Array.isArray(response.data.data) 
          ? response.data.data 
          : [];
        setSources(sourcesData as Source[]);
        setPagination(response.data.pagination);
        setIsError(false);
        hasShownErrorRef.current = false; // Reset on success
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error('Error fetching sources:', error);
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
    fetchSources(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = () => {
    fetchSources(currentPage);
  };

  return (
    <SourcesListPage 
      sources={sources} 
      pagination={pagination}
      isError={isError}
      isLoading={isLoading}
      onPageChange={handlePageChange}
      onRefresh={handleRefresh}
    />
  );
}

