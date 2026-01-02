'use client';

import { useEffect, useState, useRef } from 'react';
import ListPage from '@/components/products/ListPage';
import { getProducts } from '@/api/product';
import { getCategoryOptions } from '@/api/category';
import { Product } from '@/types/product';
import { CategoryOption } from '@/types/category';
import { PaginationInfo } from '@/types/booking';
import { useAlert } from '@/context/AlertContext';
import { AlertMessages, AlertConfigs } from '@/lib/alertMessages';
import { isPermissionError } from '@/lib/errorHandler';

export default function ProductsClient() {
  const { showError } = useAlert();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [perPage] = useState<number>(10);
  const hasShownErrorRef = useRef<boolean>(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when search changes
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchProducts = async (page: number, search?: string) => {
    setIsLoading(true);
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        getProducts(page, perPage, search),
        getCategoryOptions()
      ]);
      
      if (productsResponse.data?.data && productsResponse.data?.pagination) {
        setProducts(productsResponse.data.data);
        setPagination(productsResponse.data.pagination);
        setIsError(false);
        hasShownErrorRef.current = false; // Reset on success
      } else {
        setIsError(true);
      }
      
      if (categoriesResponse.data?.data) {
        setCategories(categoriesResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
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
    fetchProducts(currentPage, debouncedSearchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
  };

  return (
    <ListPage 
      products={products} 
      categories={categories}
      pagination={pagination}
      isError={isError}
      isLoading={isLoading}
      onPageChange={handlePageChange}
      searchTerm={searchTerm}
      onSearchChange={handleSearchChange}
    />
  );
}

