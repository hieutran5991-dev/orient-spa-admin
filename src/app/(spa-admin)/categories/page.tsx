import { Metadata } from 'next';
import CategoriesClient from './CategoriesClient';

export const dynamic = 'force-dynamic'
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

export default function CategoriesPage() {
  return <CategoriesClient />;
}
