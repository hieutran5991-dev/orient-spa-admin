import { Metadata } from 'next';
import EditProductForm from '@/components/products/EditProductForm';
import { getCategoryOptions } from '@/api/category';
import { CategoryOption } from '@/types/category';

export const metadata: Metadata = {
  title: 'Edit Product - SPA Admin Dashboard',
  description: 'Edit product information in the SPA admin system.',
  keywords: 'edit product, spa admin, product management, update product',
  openGraph: {
    title: 'Edit Product - SPA Admin Dashboard',
    description: 'Edit product information in the SPA admin system.',
    type: 'website',
  },
};

export default async function EditProductPage() {
  let categories: CategoryOption[] = [];
  
  try {
    const response = await getCategoryOptions();
    categories = response.data.data ?? [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    categories = [];
  }
  
  return <EditProductForm categories={categories} />;
}
