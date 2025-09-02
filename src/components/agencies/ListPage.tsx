'use client';

import Link from "next/link";
import ComponentCard from "../common/ComponentCard";
import DataTable, { Column } from "../tables/DataTable";
import { Agency } from "@/types/agency";
import PencilIcon from "@/icons/pencil.svg";
import TrashIcon from "@/icons/trash.svg";

export default function ListPage({ agencies, isError }: { agencies: Agency[], isError: boolean }) {
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
      <DataTable
        data={agencies as unknown as Record<string, unknown>[]}
        columns={columns}
        itemsPerPage={10}
        searchable={true}
        sortable={true}
        emptyMessage={isError ? "Failed to load agencies. Please try again later." : "No agencies found. Create your first agency to get started."}
      />
    </ComponentCard>
  </div>
}