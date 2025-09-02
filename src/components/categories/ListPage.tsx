'use client';

import Link from "next/link";
import ComponentCard from "../common/ComponentCard";
import DataTable, { Column } from "../tables/DataTable";
import { Category } from "@/types/category";
import { deleteCategory } from "@/api/category";
import { useAlert } from "@/context/AlertContext";
import { AlertMessages, AlertConfigs } from "@/lib/alertMessages";
import PencilIcon from "@/icons/pencil.svg";
import TrashIcon from "@/icons/trash.svg";
import { HTTP_CODES } from '@/constants/http-codes';

export default function ListPage({ categories, isError }: { categories: Category[], isError: boolean }) {
  const { showSuccess, showError, showWarning } = useAlert();
  
  // Define table columns
  const columns: Column[] = isError ? [] : [
    {
      key: 'name',
      header: 'Category Name',
      sortable: true,
      width: '40%',
    },
    {
      key: 'description',
      header: 'Description',
      sortable: true,
      width: '40%',
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      width: '20%',
      render: (value: unknown, row: Record<string, unknown>) => (
        <div className="flex items-center space-x-2">
          <Link
            href={`/categories/${row.id}/edit`}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Category"
          >
            <PencilIcon className="w-5 h-5 fill-current" />
          </Link>
          <button
            onClick={() => handleDeleteCategory(row.id as number)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Category"
          >
            <TrashIcon className="w-5 h-5 fill-current" />
          </button>
        </div>
      ),
    },
  ];

  // Handle delete category
  const handleDeleteCategory = async (id: number) => {
    // Show warning confirmation
    showWarning(
      AlertMessages.WARNING.CATEGORY_DELETE_WARNING.title,
      AlertMessages.WARNING.CATEGORY_DELETE_WARNING.message,
      { persistent: true }
    );
    
    // For now, we'll use a simple confirm dialog
    // In a real app, you might want to create a custom confirmation modal
    if (confirm('Are you sure you want to delete this category? This will affect all products in this category.')) {
      try {
        const response = await deleteCategory(id);
        
        if (response.status === HTTP_CODES.SUCCESS) {
          showSuccess(
            AlertMessages.SUCCESS.CATEGORY_DELETED.title,
            AlertMessages.SUCCESS.CATEGORY_DELETED.message,
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
        console.error('Error deleting category:', error);
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
          Categories List
        </h1>
        <Link
          href="/categories/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Category
        </Link>
      </div>
      
      <ComponentCard title="Categories">
        <DataTable
          data={categories as unknown as Record<string, unknown>[]}
          columns={columns}
          itemsPerPage={10}
          searchable={true}
          sortable={true}
          emptyMessage={isError ? "Failed to load categories. Please try again later." : "No categories found. Create your first category to get started."}
        />
      </ComponentCard>
    </div>
  );
}
