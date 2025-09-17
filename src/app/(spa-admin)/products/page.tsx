import { Metadata } from 'next'
import ListPage from '@/components/products/ListPage'
import { getProducts } from '@/api/product'
import { getCategoryOptions } from '@/api/category'

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

export default async function ProductsPage() {
  try {
    const response = await getProducts()
    const categoriesRes = await getCategoryOptions()

    const products = response.data?.data || []
    const categories = categoriesRes.data?.data || []

    return <ListPage products={products} categories={categories} isError={false} />
  } catch (error) {
    console.error('Error fetching products:', error)
    return <ListPage products={[]} categories={[]} isError={true} />
  }
}
