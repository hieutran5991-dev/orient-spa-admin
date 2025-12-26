import request from "@/lib/axios";
import { AxiosResponse } from "axios";
import {
  PermissionListResponse,
  UserPermissionResponse,
  AssignPermissionsRequest,
  PermissionResponse,
} from "@/types/permission";

// Get list of all permissions
export const getPermissions = async (): Promise<AxiosResponse<PermissionListResponse>> => {
  return await request.get('permissions');
};

// Get permissions for a specific user
export const getUserPermissions = async (userId: number): Promise<AxiosResponse<UserPermissionResponse>> => {
  return await request.get(`permissions/users/${userId}`);
};

// Assign permissions to a user
export const assignPermissions = async (userId: number, data: AssignPermissionsRequest): Promise<AxiosResponse<PermissionResponse>> => {
  return await request.post(`permissions/users/${userId}/assign`, data);
};

// Initialize permissions (admin only)
export const initializePermissions = async (): Promise<AxiosResponse<PermissionResponse>> => {
  return await request.post('permissions/initialize');
};

