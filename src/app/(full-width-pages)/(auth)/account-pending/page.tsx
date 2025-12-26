'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ComponentCard from '@/components/common/ComponentCard';

export default function AccountPendingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    // If user is authenticated and active, redirect to dashboard
    if (isAuthenticated && user?.is_active) {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <ComponentCard title="Tài khoản đang chờ duyệt">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            <div className="text-center space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Tài khoản của bạn đang chờ duyệt
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Tài khoản của bạn đã được tạo thành công nhưng chưa được kích hoạt bởi quản trị viên.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Vui lòng chờ quản trị viên duyệt tài khoản của bạn. Bạn sẽ có thể đăng nhập sau khi tài khoản được kích hoạt.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">Thông tin quan trọng:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
                    <li>Bạn sẽ nhận được thông báo khi tài khoản được kích hoạt</li>
                    <li>Nếu có thắc mắc, vui lòng liên hệ quản trị viên</li>
                    <li>Bạn có thể đăng xuất và thử lại sau</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => {
                  // Clear any stored auth data
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('user_data');
                  }
                  router.push('/signin');
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Đăng xuất
              </button>
              <button
                onClick={() => router.push('/signin')}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}

