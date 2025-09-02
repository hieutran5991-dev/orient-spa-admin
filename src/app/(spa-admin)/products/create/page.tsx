import { Metadata } from 'next';
import CreateProductForm from '@/components/products/CreateProductForm';
import { getCategoryOptions } from '@/api/category';

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
  const response = await getCategoryOptions();

  return <CreateProductForm categories={response.data.data ?? []}/>;
}
