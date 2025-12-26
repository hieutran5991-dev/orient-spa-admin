'use client';

import Link from "next/link";
import ComponentCard from "../common/ComponentCard";
import DataTable, { Column } from "../tables/DataTable";
import { Agency } from "@/types/agency";
import PencilIcon from "@/icons/pencil.svg";
import TrashIcon from "@/icons/trash.svg";
import { PaginationInfo } from "@/types/booking";
import { ChevronLeftIcon } from "@/icons";

interface ListPageProps {
  agencies: Agency[];
  pagination: PaginationInfo | null;
  isError: boolean;
  isLoading: boolean;
  onPageChange: (page: number) => void;
}

export default function ListPage({ agencies, pagination, isError, isLoading, onPageChange }: ListPageProps) {
        // Define table columns
        const columns: Column[] = isError ? [] : [
            {
              key: 'name',
              header: 'Agency Name',
              sortable: true,
              width: '18%',
            },
            {
              key: 'address',
              header: 'Address',
              sortable: true,
              width: '18%',
            },
            {
              key: 'phone',
              header: 'Phone',
              sortable: false,
              width: '10%',
            },
            {
              key: 'email',
              header: 'Email',
              sortable: true,
              width: '12%',
            },
            {
              key: 'open_time',
              header: 'Open Time',
              sortable: false,
              width: '8%',
            },
            {
              key: 'close_time',
              header: 'Close Time',
              sortable: false,
              width: '8%',
            },
            {
              key: 'capacity',
              header: 'Capacity',
              sortable: true,
              render: (value: unknown) => (
                <span className="font-medium text-blue-600">{String(value)} people</span>
              ),
              width: '8%',
            },
            {
              key: 'actions',
              header: 'Actions',
              sortable: false,
              width: '18%',
              render: (value: unknown, row: Record<string, unknown>) => (
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/agencies/${row.id}/edit`}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Agency"
                  >
                    <PencilIcon className="w-5 h-5 fill-current" />
                  </Link>
                  <button
                    onClick={() => handleDeleteAgency(row.id as number)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Agency"
                  >
                    <TrashIcon className="w-5 h-5 fill-current" />
                  </button>
                </div>
              ),
            },
          ];

    // Handle delete agency
    const handleDeleteAgency = (id: number) => {
      if (confirm('Are you sure you want to delete this agency?')) {
        // TODO: Implement delete API call
        console.log('Deleting agency with ID:', id);
      }
    };
    
    return <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Agencies List
      </h1>
      <Link
        href="/agencies/create"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add New Agency
      </Link>
    </div>
    
    <ComponentCard title="Agencies">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500 dark:text-gray-400">Loading agencies...</div>
        </div>
      ) : (
        <>
          <DataTable
            data={agencies as unknown as Record<string, unknown>[]}
            columns={columns}
            itemsPerPage={pagination?.per_page || 10}
            searchable={true}
            sortable={true}
            emptyMessage={isError ? "Failed to load agencies. Please try again later." : "No agencies found. Create your first agency to get started."}
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
}