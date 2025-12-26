import { Metadata } from 'next'
import ProductsClient from './ProductsClient'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Products Management | SPA Admin Dashboard',
  description:
    'Manage spa products and services, view details, pricing, and handle product operations. Access comprehensive product information including categories, pricing, and featured products.',
  keywords: 'spa products, product management, spa services, pricing, featured products, service categories',
  openGraph: {
    title: 'Products Management | SPA Admin Dashboard',
    description: 'Manage spa products and services, view details, pricing, and handle product operations.',
    type: 'website'
  }
}

export default function ProductsPage() {
  return <ProductsClient />
}
