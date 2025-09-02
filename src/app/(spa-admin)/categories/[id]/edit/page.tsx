import { Metadata } from 'next';
import EditCategoryForm from '@/components/categories/EditCategoryForm';

export const metadata: Metadata = {
  title: 'Edit Category - SPA Admin Dashboard',
  description: 'Edit category information in the SPA admin system.',
  keywords: 'edit category, spa admin, category management, update category',
  openGraph: {
    title: 'Edit Category - SPA Admin Dashboard',
    description: 'Edit category information in the SPA admin system.',
    type: 'website',
  },
};

export default function EditCategoryPage() {
  return <EditCategoryForm />;
}
