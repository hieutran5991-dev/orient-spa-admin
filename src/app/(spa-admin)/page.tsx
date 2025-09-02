import { Metadata } from 'next';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';

export const metadata: Metadata = {
  title: "SPA Admin Dashboard | Management Overview",
  description: "Welcome to the SPA Admin Dashboard. Manage agencies, categories, products, and bookings from a centralized location. Monitor operations and maintain spa services efficiently.",
  keywords: "spa admin dashboard, spa management, agency management, service management, booking management",
  openGraph: {
    title: "SPA Admin Dashboard | Management Overview",
    description: "Centralized management dashboard for spa operations and services.",
    type: "website",
  },
};

export default function SpaAdminPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="SPA Admin Dashboard" />
      <div className="space-y-6">
        <ComponentCard title="Welcome to SPA Admin Dashboard">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Agencies</h3>
                <p className="text-blue-600 dark:text-blue-300">Manage spa locations and branches</p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Categories</h3>
                <p className="text-green-600 dark:text-green-300">Organize services by categories</p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">Products</h3>
                <p className="text-purple-600 dark:text-purple-300">Manage spa services and pricing</p>
              </div>
              
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200">Bookings</h3>
                <p className="text-orange-600 dark:text-orange-300">Track appointments and reservations</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Quick Actions</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Use the sidebar navigation to access different management sections. Each section provides comprehensive tools for managing your spa operations.
              </p>
            </div>
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
