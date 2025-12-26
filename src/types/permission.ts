export interface Permission {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface PermissionListResponse {
  message: string;
  data: Permission[];
  status: number;
}

export interface UserPermissionResponse {
  message: string;
  data: Permission[];
  status: number;
}

export interface AssignPermissionsRequest {
  permission_ids: number[];
}

export interface PermissionResponse {
  message: string;
  status: number;
}

