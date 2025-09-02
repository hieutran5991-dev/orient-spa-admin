import { Metadata } from 'next';
import CreateCategoryForm from '@/components/categories/CreateCategoryForm';

export const metadata: Metadata = {
  title: 'Create Category - SPA Admin Dashboard',
  description: 'Create a new category for products and services in the SPA admin system.',
  keywords: 'create category, spa admin, category management, product categories',
  openGraph: {
    title: 'Create Category - SPA Admin Dashboard',
    description: 'Create a new category for products and services in the SPA admin system.',
    type: 'website',
  },
};

export default function CreateCategoryPage() {
  return <CreateCategoryForm />;
}
