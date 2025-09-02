import { Metadata } from 'next';
import EditProductForm from '@/components/products/EditProductForm';
import { getCategoryOptions } from '@/api/category';

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
  const response = await getCategoryOptions();
  
  return <EditProductForm categories={response.data.data ?? []} />;
}
