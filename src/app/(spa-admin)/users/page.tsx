import { Metadata } from 'next';
import UsersClient from './UsersClient';

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: "Users Management | SPA Admin Dashboard",
  description: "Manage users, roles, and permissions. View and update user information, roles, and access permissions.",
  keywords: "user management, admin, staff, permissions, roles",
  openGraph: {
    title: "Users Management | SPA Admin Dashboard",
    description: "Manage users, roles, and permissions.",
    type: "website",
  },
};

export default function UsersPage() {
  return <UsersClient />;
}
