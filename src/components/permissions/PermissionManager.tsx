'use client';

import { useState, useEffect } from 'react';
import ComponentCard from "../common/ComponentCard";
import { Permission, User } from "@/types";
import { getUserPermissions, assignPermissions, getPermissions } from "@/api/permission";
import { useAlert } from "@/context/AlertContext";
import { AlertMessages, AlertConfigs } from "@/lib/alertMessages";
import { HTTP_CODES } from "@/constants/http-codes";
import { getErrorMessage, getErrorTitle, isPermissionError } from "@/lib/errorHandler";

interface PermissionManagerProps {
  user: User;
  onClose?: () => void;
}

export default function PermissionManager({ user, onClose }: PermissionManagerProps) {
  const { showSuccess, showError } = useAlert();
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [allPermsResponse, userPermsResponse] = await Promise.all([
        getPermissions(),
        getUserPermissions(user.id),
      ]);

      if (allPermsResponse.data?.data) {
        setAllPermissions(allPermsResponse.data.data);
      }

      if (userPermsResponse.data?.data) {
        const userPerms = userPermsResponse.data.data;
        setSelectedPermissionIds(userPerms.map(p => p.id));
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissionIds(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await assignPermissions(user.id, {
        permission_ids: selectedPermissionIds,
      });

      if (response.status === HTTP_CODES.SUCCESS) {
        showSuccess(
          AlertMessages.SUCCESS.UPDATE_SUCCESS?.title || 'Success',
          'Permissions updated successfully',
          AlertConfigs.SUCCESS
        );
        await fetchData();
        if (onClose) {
          setTimeout(() => onClose(), 1000);
        }
      } else {
        showError(
          AlertMessages.ERROR.UPDATE_ERROR?.title || 'Error',
          'Failed to update permissions',
          AlertConfigs.ERROR
        );
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
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
      setIsSaving(false);
    }
  };

  // Group permissions by category (based on slug prefix)
  const groupedPermissions = allPermissions.reduce((acc, permission) => {
    const category = permission.slug.split('.')[0] || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  if (user.role === 'admin') {
    return (
      <ComponentCard title={`Permissions for ${user.name}`}>
        <div className="p-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Admin users have all permissions automatically.
          </p>
        </div>
      </ComponentCard>
    );
  }

  return (
    <ComponentCard title={`Manage Permissions for ${user.name}`}>
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500 dark:text-gray-400">Loading permissions...</div>
        </div>
      ) : (
        <div className="space-y-6 p-6">
          {/* Permission Groups */}
          {Object.entries(groupedPermissions).map(([category, permissions]) => (
            <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 capitalize">
                {category} Permissions
              </h3>
              <div className="space-y-2">
                {permissions.map((permission) => {
                  const isSelected = selectedPermissionIds.includes(permission.id);
                  return (
                    <label
                      key={permission.id}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handlePermissionToggle(permission.id)}
                        className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {permission.name}
                        </div>
                        {permission.description && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {permission.description}
                          </div>
                        )}
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {permission.slug}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            {onClose && (
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Permissions'}
            </button>
          </div>
        </div>
      )}
    </ComponentCard>
  );
}

