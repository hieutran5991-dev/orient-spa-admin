'use client';

import { useState } from 'react';
import ComponentCard from "../common/ComponentCard";
import DataTable, { Column } from "../tables/DataTable";
import { User } from "@/types/user";
import { updateUserRole, updateUserActiveStatus } from "@/api/user";
import { useAlert } from "@/context/AlertContext";
import { AlertMessages, AlertConfigs } from "@/lib/alertMessages";
import { HTTP_CODES } from "@/constants/http-codes";
import { getErrorMessage, getErrorTitle, isPermissionError } from "@/lib/errorHandler";

interface UsersListPageProps {
  users: User[];
  isError: boolean;
  isLoading: boolean;
  onRefresh: () => void;
}

export default function UsersListPage({ users, isError, isLoading, onRefresh }: UsersListPageProps) {
  const { showSuccess, showError } = useAlert();
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  // Define table columns
  const columns: Column[] = isError ? [] : [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      width: '20%',
      render: (value: unknown, row: Record<string, unknown>) => {
        const user = row as unknown as User;
        return (
          <div className="flex items-center space-x-3">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <span className="text-gray-600 dark:text-gray-300 font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
          </div>
        );
      },
    },
    {
      key: 'email',
      header: 'Email',
      sortable: true,
      width: '20%',
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      width: '10%',
      render: (value: unknown, row: Record<string, unknown>) => {
        const user = row as unknown as User;
        const isUpdating = updatingUserId === user.id;
        return (
          <select
            value={user.role}
            onChange={(e) => handleRoleChange(user.id, e.target.value as 'admin' | 'staff')}
            disabled={isUpdating}
            className={`px-3 py-1 rounded-lg border ${
              user.role === 'admin'
                ? 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700'
                : 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700'
            } font-medium text-sm cursor-pointer disabled:opacity-50`}
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        );
      },
    },
    {
      key: 'is_active',
      header: 'Status',
      sortable: true,
      width: '10%',
      render: (value: unknown, row: Record<string, unknown>) => {
        const user = row as unknown as User;
        const isUpdating = updatingUserId === user.id;
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={user.is_active}
              onChange={(e) => handleStatusChange(user.id, e.target.checked)}
              disabled={isUpdating}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 disabled:opacity-50"></div>
            <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
              {user.is_active ? 'Active' : 'Inactive'}
            </span>
          </label>
        );
      },
    },
    {
      key: 'permissions',
      header: 'Permissions',
      sortable: false,
      width: '20%',
      render: (value: unknown, row: Record<string, unknown>) => {
        const user = row as unknown as User;
        const permissionCount = user.permissions?.length || 0;
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {user.role === 'admin' ? (
              <span className="font-medium text-purple-600 dark:text-purple-400">All Permissions</span>
            ) : (
              `${permissionCount} permission${permissionCount !== 1 ? 's' : ''}`
            )}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      width: '20%',
      render: (value: unknown, row: Record<string, unknown>) => {
        const user = row as unknown as User;
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleManagePermissions(user.id)}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Manage Permissions"
            >
              Manage Permissions
            </button>
          </div>
        );
      },
    },
  ];

  const handleRoleChange = async (userId: number, newRole: 'admin' | 'staff') => {
    setUpdatingUserId(userId);
    try {
      const response = await updateUserRole(userId, { role: newRole });
      // Check both response.status (HTTP status code) and response.data.status (if exists)
      const isSuccess = response.status === HTTP_CODES.SUCCESS || 
                       (response.data?.status === HTTP_CODES.SUCCESS) ||
                       (response.status >= 200 && response.status < 300);
      
      if (isSuccess) {
        showSuccess(
          AlertMessages.SUCCESS.UPDATE_SUCCESS?.title || 'Success',
          'User role updated successfully',
          AlertConfigs.SUCCESS
        );
        onRefresh();
      } else {
        showError(
          AlertMessages.ERROR.UPDATE_ERROR?.title || 'Error',
          'Failed to update user role',
          AlertConfigs.ERROR
        );
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      const errorTitle = isPermissionError(error) 
        ? AlertMessages.ERROR.PERMISSION_DENIED.title 
        : getErrorTitle(error);
      const errorMessage = getErrorMessage(error);
      showError(
        errorTitle,
        errorMessage,
        AlertConfigs.ERROR
      );
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleStatusChange = async (userId: number, isActive: boolean) => {
    setUpdatingUserId(userId);
    try {
      const response = await updateUserActiveStatus(userId, { is_active: isActive });
      // Check both response.status (HTTP status code) and response.data.status (if exists)
      const isSuccess = response.status === HTTP_CODES.SUCCESS || 
                       (response.data?.status === HTTP_CODES.SUCCESS) ||
                       (response.status >= 200 && response.status < 300);
      
      if (isSuccess) {
        showSuccess(
          AlertMessages.SUCCESS.UPDATE_SUCCESS?.title || 'Success',
          `User ${isActive ? 'activated' : 'deactivated'} successfully`,
          AlertConfigs.SUCCESS
        );
        onRefresh();
      } else {
        showError(
          AlertMessages.ERROR.UPDATE_ERROR?.title || 'Error',
          'Failed to update user status',
          AlertConfigs.ERROR
        );
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      const errorTitle = isPermissionError(error) 
        ? AlertMessages.ERROR.PERMISSION_DENIED.title 
        : getErrorTitle(error);
      const errorMessage = getErrorMessage(error);
      showError(
        errorTitle,
        errorMessage,
        AlertConfigs.ERROR
      );
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleManagePermissions = (userId: number) => {
    window.location.href = `/users/${userId}/permissions`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Users Management
        </h1>
      </div>

      <ComponentCard title="Users">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500 dark:text-gray-400">Loading users...</div>
          </div>
        ) : (
          <DataTable
            data={users as unknown as Record<string, unknown>[]}
            columns={columns}
            itemsPerPage={10}
            searchable={true}
            sortable={true}
            emptyMessage={isError ? "Failed to load users. Please try again later." : "No users found."}
            disablePagination={false}
          />
        )}
      </ComponentCard>
    </div>
  );
}

