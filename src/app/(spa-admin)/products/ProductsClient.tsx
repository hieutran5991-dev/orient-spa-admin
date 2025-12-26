'use client';

import { useEffect, useState } from 'react';
import ListPage from '@/components/products/ListPage';
import { getProducts } from '@/api/product';
import { getCategoryOptions } from '@/api/category';
import { Product } from '@/types/product';
import { CategoryOption } from '@/types/category';
import { PaginationInfo } from '@/types/booking';

export default function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [perPage] = useState<number>(10);

  const fetchProducts = async (page: number) => {
    setIsLoading(true);
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        getProducts(page, perPage),
        getCategoryOptions()
      ]);
      
      if (productsResponse.data?.data && productsResponse.data?.pagination) {
        setProducts(productsResponse.data.data);
        setPagination(productsResponse.data.pagination);
        setIsError(false);
      } else {
        setIsError(true);
      }
      
      if (categoriesResponse.data?.data) {
        setCategories(categoriesResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <ListPage 
      products={products} 
      categories={categories}
      pagination={pagination}
      isError={isError}
      isLoading={isLoading}
      onPageChange={handlePageChange}
    />
  );
}

