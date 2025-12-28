'use client';

import Link from "next/link";
import ComponentCard from "../common/ComponentCard";
import DataTable, { Column } from "../tables/DataTable";
import { Source } from "@/types/source";
import { deleteSource } from "@/api/source";
import { useAlert } from "@/context/AlertContext";
import { AlertMessages, AlertConfigs } from "@/lib/alertMessages";
import { getErrorMessage, getErrorTitle, isPermissionError } from "@/lib/errorHandler";
import PencilIcon from "@/icons/pencil.svg";
import TrashIcon from "@/icons/trash.svg";
import { HTTP_CODES } from '@/constants/http-codes';
import { PaginationInfo } from "@/types/booking";
import { ChevronLeftIcon } from "@/icons";

interface SourcesListPageProps {
  sources: Source[];
  pagination: PaginationInfo | null;
  isError: boolean;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onRefresh?: () => void;
}

export default function SourcesListPage({ sources, pagination, isError, isLoading, onPageChange, onRefresh }: SourcesListPageProps) {
  const { showSuccess, showError } = useAlert();
  
  // Define table columns
  const columns: Column[] = isError ? [] : [
    {
      key: 'name',
      header: 'Source Name',
      sortable: true,
      width: '50%',
    },
    {
      key: 'is_active',
      header: 'Status',
      sortable: true,
      width: '30%',
      render: (value: unknown) => {
        const isActive = value as boolean;
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isActive 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      width: '20%',
      render: (value: unknown, row: Record<string, unknown>) => (
        <div className="flex items-center space-x-2">
          <Link
            href={`/settings/sources/${row.id}/edit`}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Source"
          >
            <PencilIcon className="w-5 h-5 fill-current" />
          </Link>
          <button
            onClick={() => handleDeleteSource(row.id as number)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Source"
          >
            <TrashIcon className="w-5 h-5 fill-current" />
          </button>
        </div>
      ),
    },
  ];

  // Handle delete source
  const handleDeleteSource = async (id: number) => {
    if (confirm('Are you sure you want to delete this source? This action cannot be undone.')) {
      try {
        const response = await deleteSource(id);
        
        if (response.status === HTTP_CODES.SUCCESS) {
          showSuccess(
            'Source Deleted',
            'Source has been deleted successfully',
            AlertConfigs.SUCCESS
          );
          // Refresh data
          if (onRefresh) {
            onRefresh();
          } else {
            window.location.reload();
          }
        } else {
          showError(
            AlertMessages.ERROR.DELETE_ERROR.title,
            AlertMessages.ERROR.DELETE_ERROR.message,
            AlertConfigs.ERROR
          );
        }
      } catch (error) {
        console.error('Error deleting source:', error);
        const errorTitle = isPermissionError(error) 
          ? AlertMessages.ERROR.PERMISSION_DENIED.title 
          : getErrorTitle(error);
        const errorMessage = getErrorMessage(error);
        showError(
          errorTitle,
          errorMessage,
          AlertConfigs.ERROR
        );
      }
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sources
        </h1>
        <Link
          href="/settings/sources/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Source
        </Link>
      </div>
      
      <ComponentCard title="Sources">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500 dark:text-gray-400">Loading sources...</div>
          </div>
        ) : (
          <>
            <DataTable
              data={sources as unknown as Record<string, unknown>[]}
              columns={columns}
              itemsPerPage={pagination?.per_page || 10}
              searchable={true}
              sortable={true}
              emptyMessage={isError ? "Failed to load sources. Please try again later." : "No sources found. Create your first source to get started."}
              disablePagination={true}
            />
            
            {/* Server-side Pagination */}
            {pagination && pagination.last_page > 1 && (
              <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {pagination.from} to {pagination.to} of {pagination.total} results
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => onPageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    <ChevronLeftIcon className="w-4 h-4 stroke-current" />
                  </button>
                  
                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                    let page: number;
                    if (pagination.last_page <= 5) {
                      page = i + 1;
                    } else if (pagination.current_page <= 3) {
                      page = i + 1;
                    } else if (pagination.current_page >= pagination.last_page - 2) {
                      page = pagination.last_page - 4 + i;
                    } else {
                      page = pagination.current_page - 2 + i;
                    }
                    return page;
                  }).map((page) => (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        pagination.current_page === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  {/* Next Button */}
                  <button
                    onClick={() => onPageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                  >
                    <div className="rotate-180">
                      <ChevronLeftIcon className="w-4 h-4 stroke-current" />
                    </div>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </ComponentCard>
    </div>
  );
}

