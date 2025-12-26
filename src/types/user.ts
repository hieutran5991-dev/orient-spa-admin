import { Permission } from './permission';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'staff';
  is_active: boolean;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  permissions?: string[]; // Array of permission slugs (e.g., ['agency.view', 'category.view'])
  permission_objects?: Permission[]; // Full permission objects (optional, for detailed views)
}

export interface UserListResponse {
  message: string;
  data: User[];
  status: number;
}

export interface UserByIdResponse {
  message: string;
  data: User;
  status: number;
}

export interface UpdateUserRoleRequest {
  role: 'admin' | 'staff';
}

export interface UpdateUserActiveStatusRequest {
  is_active: boolean;
}

export interface UserResponse {
  message: string;
  status: number;
}

