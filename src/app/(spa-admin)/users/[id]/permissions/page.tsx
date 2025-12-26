'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import PermissionManager from '@/components/permissions/PermissionManager';
import { getUser } from '@/api/user';
import { User } from '@/types/user';
import { useAlert } from '@/context/AlertContext';
import { AlertMessages, AlertConfigs } from '@/lib/alertMessages';
import { getErrorMessage, getErrorTitle, isPermissionError } from '@/lib/errorHandler';

export default function UserPermissionsPage() {
  const params = useParams();
  const router = useRouter();
  const { showError } = useAlert();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const userId = parseInt(params.id as string);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await getUser(userId);
      if (response.data?.data) {
        setUser(response.data.data);
      } else {
        showError(
          AlertMessages.ERROR.FETCH_ERROR?.title || 'Error',
          'Failed to load user information',
          AlertConfigs.ERROR
        );
        router.push('/users');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      const errorTitle = isPermissionError(error) 
        ? AlertMessages.ERROR.PERMISSION_DENIED.title 
        : getErrorTitle(error);
      const errorMessage = getErrorMessage(error);
      showError(
        errorTitle,
        errorMessage,
        AlertConfigs.ERROR
      );
      router.push('/users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    router.push('/users');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      <PageBreadcrumb pageTitle={`Manage Permissions - ${user.name}`} />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Permissions
          </h1>
          <Link
            href="/users"
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to Users
          </Link>
        </div>
        
        <PermissionManager user={user} onClose={handleClose} />
      </div>
    </div>
  );
}

