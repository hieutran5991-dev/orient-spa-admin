'use client';

import { useEffect, useState, useRef } from 'react';
import UsersListPage from '@/components/users/UsersListPage';
import { getUsers } from '@/api/user';
import { User } from '@/types/user';
import { useAlert } from '@/context/AlertContext';
import { AlertMessages, AlertConfigs } from '@/lib/alertMessages';
import { getErrorMessage, getErrorTitle, isPermissionError } from '@/lib/errorHandler';

export default function UsersClient() {
  const { showError } = useAlert();
  const [users, setUsers] = useState<User[]>([]);
  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const hasShownErrorRef = useRef<boolean>(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getUsers();
      if (response.data?.data) {
        setUsers(response.data.data);
        setIsError(false);
        hasShownErrorRef.current = false; // Reset on success
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setIsError(true);
      
      // Show error message if it's a permission error and only once
      if (isPermissionError(error) && !hasShownErrorRef.current) {
        hasShownErrorRef.current = true;
        const errorTitle = AlertMessages.ERROR.PERMISSION_DENIED.title;
        const errorMessage = getErrorMessage(error);
        showError(
          errorTitle,
          errorMessage,
          AlertConfigs.ERROR
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UsersListPage 
      users={users} 
      isError={isError}
      isLoading={isLoading}
      onRefresh={fetchUsers}
    />
  );
}

