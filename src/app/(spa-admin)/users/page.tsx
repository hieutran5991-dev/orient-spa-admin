import Link from 'next/link';

export default function UsersPage() {
  return (
    <div>
      <h1>Users Management</h1>
      <div className="mt-4 space-y-2">
        <Link 
          href="/users/admin" 
          className="block p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
        >
          Manage Admins
        </Link>
        {/* Other user management links can be added here */}
      </div>
    </div>
  );
}
