'use client';

import Link from "next/link";
import ComponentCard from "../common/ComponentCard";
import DataTable, { Column } from "../tables/DataTable";
import { Product } from "@/types/product";
import { deleteProduct } from "@/api/product";
import { useAlert } from "@/context/AlertContext";
import { AlertMessages, AlertConfigs } from "@/lib/alertMessages";
import { HTTP_CODES } from "@/constants/http-codes";
import PencilIcon from "@/icons/pencil.svg";
import TrashIcon from "@/icons/trash.svg";
import { CategoryOption } from "@/types/category";

export default function ListPage({ products, categories, isError }: { products: Product[], categories: CategoryOption[], isError: boolean }) {
  const { showSuccess, showError, showWarning } = useAlert();
  
  // Define table columns
  const columns: Column[] = isError ? [] : [
    {
      key: 'name',
      header: 'Product Name',
      sortable: true,
      width: '25%',
    },
    {
      key: 'category_id',
      header: 'Category',
      sortable: true,
      width: '20%',
      render: (value: unknown) => (
        <span>{categories.find(category => category.id === value)?.name}</span>
      ),
    },
    {
      key: 'duration',
      header: 'Duration (minutes)',
      sortable: true,
      width: '8%',
      render: (value: unknown) => (
        <span className="font-medium text-green-600">{String(value)}</span>
      ),
    },
    {
      key: 'price',
      header: 'Price (VND)',
      sortable: true,
      width: '10%',
    },
    {
      key: 'is_promoted',
      header: 'Promoted',
      sortable: true,
      width: '8%',
      render: (value: unknown) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      width: '19%',
      render: (value: unknown, row: Record<string, unknown>) => (
        <div className="flex items-center space-x-2">
          <Link
            href={`/products/${row.id}/edit`}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Product"
          >
            <PencilIcon className="w-5 h-5 fill-current" />
          </Link>
          <button
            onClick={() => handleDeleteProduct(row.id as number)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Product"
          >
            <TrashIcon className="w-5 h-5 fill-current" />
          </button>
        </div>
      ),
    },
  ];

  // Handle delete product
  const handleDeleteProduct = async (id: number) => {
    // Show warning confirmation
    showWarning(
      AlertMessages.WARNING.PRODUCT_DELETE_WARNING.title,
      AlertMessages.WARNING.PRODUCT_DELETE_WARNING.message,
      { persistent: true }
    );
    
    // For now, we'll use a simple confirm dialog
    // In a real app, you might want to create a custom confirmation modal
    if (confirm('Are you sure you want to delete this product? This will affect all future bookings.')) {
      try {
        const response = await deleteProduct(id);
        
        if (response.status === HTTP_CODES.SUCCESS) {
          showSuccess(
            AlertMessages.SUCCESS.PRODUCT_DELETED.title,
            AlertMessages.SUCCESS.PRODUCT_DELETED.message,
            AlertConfigs.SUCCESS
          );
          // Refresh the page to show updated data
          window.location.reload();
        } else {
          showError(
            AlertMessages.ERROR.DELETE_ERROR.title,
            AlertMessages.ERROR.DELETE_ERROR.message,
            AlertConfigs.ERROR
          );
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        showError(
          AlertMessages.ERROR.NETWORK_ERROR.title,
          AlertMessages.ERROR.NETWORK_ERROR.message,
          AlertConfigs.ERROR
        );
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Products List
        </h1>
        <Link
          href="/products/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Product
        </Link>
      </div>
      
      <ComponentCard title="Products">
        <DataTable
          data={products as unknown as Record<string, unknown>[]}
          columns={columns}
          itemsPerPage={10}
          searchable={true}
          sortable={true}
          emptyMessage={isError ? "Failed to load products. Please try again later." : "No products found. Create your first product to get started."}
        />
      </ComponentCard>
    </div>
  );
}
