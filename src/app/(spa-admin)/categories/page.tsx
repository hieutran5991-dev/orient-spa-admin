import { Metadata } from 'next';
import ListPage from '@/components/categories/ListPage';
import { getCategories } from '@/api/category';

export const metadata: Metadata = {
  title: "Categories Management | SPA Admin Dashboard",
  description: "Manage spa service categories, view details, and handle category operations. Access comprehensive category information including descriptions and service types.",
  keywords: "spa categories, category management, service types, spa services, category operations",
  openGraph: {
    title: "Categories Management | SPA Admin Dashboard",
    description: "Manage spa service categories, view details, and handle category operations.",
    type: "website",
  },
};

export default async function CategoriesPage() {
  try {
    const response = await getCategories();
    const categories = response.data?.data || [];

    return <ListPage categories={categories} isError={false} />;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return <ListPage categories={[]} isError={true} />;
  }
}
