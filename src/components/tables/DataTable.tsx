"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import { ChevronLeftIcon, ChevronUpIcon, ChevronDownIcon } from "@/icons";

export interface Column {
  key: string;
  header: string;
  render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface DataTableProps {
  data: Record<string, unknown>[];
  columns: Column[];
  itemsPerPage?: number;
  searchable?: boolean;
  sortable?: boolean;
  actions?: (row: Record<string, unknown>) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
  disablePagination?: boolean;
}

export default function DataTable({
  data,
  columns,
  itemsPerPage = 10,
  searchable = true,
  sortable = true,
  actions,
  emptyMessage = "No data available",
  className = "",
  disablePagination = false,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      // Handle different types for comparison
      if (typeof aValue === "number" && typeof bValue === "number") {
        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      }
      
      // Convert to string for comparison
      const aString = String(aValue || "");
      const bString = String(bValue || "");
      
      if (aString < bString) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aString > bString) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (disablePagination) {
      return sortedData;
    }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, itemsPerPage, disablePagination]);

  // Calculate pagination info
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, sortedData.length);

  // Handle sorting
  const handleSort = (key: string) => {
    if (!sortable) return;
    
    setSortConfig((current) => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Render cell content
  const renderCell = (column: Column, row: Record<string, unknown>) => {
    const value = row[column.key];
    
    if (column.render) {
      return column.render(value, row);
    }
    
    // Default rendering with HTML support
    if (typeof value === "string" && value.includes("<")) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: value }}
          className="text-gray-800 dark:text-white/90"
        />
      );
    }
    
    if (typeof value === "boolean") {
      return (
        <Badge
          size="sm"
          color={value ? "success" : "error"}
        >
          {value ? "Yes" : "No"}
        </Badge>
      );
    }
    
    if (typeof value === "number") {
      return <span className="font-medium text-gray-700 dark:text-gray-300">{value.toLocaleString()}</span>;
    }
    
    return <span className="text-gray-800 dark:text-white/90">{String(value)}</span>;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      {searchable && (
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {filteredData.length} of {data.length} items
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    isHeader
                    className={`px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 ${
                      column.width ? column.width : ""
                    } ${
                      sortable && column.sortable !== false
                        ? "cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                        : ""
                    }`}
                  >
                    <div 
                      className="flex items-center gap-2"
                      onClick={() => handleSort(column.key)}
                    >
                      {column.header}
                      {sortable && column.sortable !== false && (
                        <div className="flex flex-col items-center">
                          <ChevronUpIcon
                            className={`w-4 h-4 stroke-current ${
                              sortConfig?.key === column.key && sortConfig.direction === "asc"
                                ? "text-blue-500 stroke-2"
                                : "text-gray-400 stroke-1"
                            }`}
                          />
                          <ChevronDownIcon
                            className={`w-4 h-4 -mt-1 stroke-current ${
                              sortConfig?.key === column.key && sortConfig.direction === "desc"
                                ? "text-blue-500 stroke-2"
                                : "text-gray-400 stroke-1"
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </TableCell>
                ))}
                {actions && (
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-24"
                  >
                    Actions
                  </TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <TableRow key={String(row.id) || index}>
                    {columns.map((column) => (
                      <TableCell key={column.key} className="px-5 py-4">
                        {renderCell(column, row)}
                      </TableCell>
                    ))}
                    {actions && (
                      <TableCell className="px-5 py-4">
                        {actions(row)}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={columns.length + (actions ? 1 : 0)}
                    className="px-5 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {!disablePagination && totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Showing {startItem} to {endItem} of {sortedData.length} results
          </div>
          
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <ChevronLeftIcon className="w-4 h-4 stroke-current" />
            </button>
            
            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm font-medium rounded-lg ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
            
            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <div className="rotate-180">
                <ChevronLeftIcon className="w-4 h-4 stroke-current" />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
