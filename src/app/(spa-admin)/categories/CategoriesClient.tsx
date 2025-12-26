'use client';

import { useEffect, useState } from 'react';
import ListPage from '@/components/categories/ListPage';
import { getCategories } from '@/api/category';
import { Category } from '@/types/category';
import { PaginationInfo } from '@/types/booking';

export default function CategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage] = useState<number>(10);

  const fetchCategories = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await getCategories(page, perPage);
      if (response.data?.data && response.data?.pagination) {
        setCategories(response.data.data);
        setPagination(response.data.pagination);
        setIsError(false);
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <ListPage 
      categories={categories} 
      pagination={pagination}
      isError={isError}
      isLoading={isLoading}
      onPageChange={handlePageChange}
    />
  );
}

