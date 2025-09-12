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
import { LANGUAGES } from "@/constants/languages";

export default function ListPage({ products, categories, isError }: { products: Product[], categories: CategoryOption[], isError: boolean }) {
  const { showSuccess, showError, showWarning } = useAlert();
  
  // Define table columns
  const columns: Column[] = isError ? [] : [
    {
      key: 'name',
      header: 'Product Name',
      sortable: true,
      width: '25%',
      render: (value: unknown, row: Record<string, unknown>) => {
        const product = row as unknown as Product;
        return (
          <div className="space-y-1">
            <div className="font-medium text-gray-900 dark:text-white">
              {product.name}
            </div>
            {product.translations && product.translations.length > 0 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                {product.translations
                  .filter(t => t.language_code !== LANGUAGES.EN)
                  .map((translation, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <span className="text-xs font-medium">
                        {translation.language_code.toUpperCase()}:
                      </span>
                      <span>{translation.name}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'category_id',
      header: 'Category',
      sortable: true,
      width: '20%',
      render: (value: unknown) => (
        <span className="font-medium text-gray-700 dark:text-gray-300">{categories.find(category => category.id === value)?.name}</span>
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
      header: 'Price',
      sortable: true,
      width: '15%',
      render: (value: unknown, row: Record<string, unknown>) => {
        const product = row as unknown as Product;
        return (
          <div className="space-y-1">
            <div className="font-medium text-gray-900 dark:text-white">
              {product.price} {product.currency}
            </div>
            {product.translations && product.translations.length > 0 && (
              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                {product.translations
                  .filter(t => t.language_code !== LANGUAGES.EN)
                  .map((translation, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <span className="text-xs font-medium">
                        {translation.language_code.toUpperCase()}:
                      </span>
                      <span>{translation.price} {translation.currency}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'is_featured',
      header: 'Featured',
      sortable: true,
      width: '8%',
      render: (value: unknown) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        }`}>
          {value ? 'Yes' : 'No'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      width: '12%',
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