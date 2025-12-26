"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

const publicRoutes = ['/signin', '/signup', '/404', '/500', '/account-pending'];

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user, validateToken } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (isLoading) {
        return;
      }

      const isPublicRoute = publicRoutes.includes(pathname);

      // If user is authenticated but inactive, redirect to account-pending
      if (isAuthenticated && user && user.is_active === false) {
        if (pathname !== '/account-pending') {
          router.push('/account-pending');
        }
        setIsValidating(false);
        return;
      }

      if (!isAuthenticated && !isPublicRoute) {
        router.push('/signin');
        return;
      }

      if (isAuthenticated && pathname === '/signin') {
        router.push('/');
        return;
      }

      setIsValidating(false);
    };

    checkAuth();
  }, [isLoading, isAuthenticated, user, pathname, router, validateToken]);

  // Show loading when validating
  if (isLoading || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
