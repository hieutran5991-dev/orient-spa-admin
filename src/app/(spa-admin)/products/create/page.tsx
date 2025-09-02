import { Metadata } from 'next';
import CreateProductForm from '@/components/products/CreateProductForm';
import { getCategoryOptions } from '@/api/category';
import { CategoryOption } from '@/types/category';

export const metadata: Metadata = {
  title: 'Create Product - SPA Admin Dashboard',
  description: 'Create a new product for the SPA admin system.',
  keywords: 'create product, spa admin, product management, add product',
  openGraph: {
    title: 'Create Product - SPA Admin Dashboard',
    description: 'Create a new product for the SPA admin system.',
    type: 'website',
  },
};

export default async function CreateProductPage() {
  let categories: CategoryOption[] = [];
  
  try {
    const response = await getCategoryOptions();
    categories = response.data.data ?? [];
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    categories = [];
  }

  return <CreateProductForm categories={categories}/>;
}
