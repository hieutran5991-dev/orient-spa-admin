import request from "@/lib/axios";
import { AxiosResponse } from "axios";
import {
  UserListResponse,
  UserByIdResponse,
  UpdateUserRoleRequest,
  UpdateUserActiveStatusRequest,
  UserResponse,
} from "@/types/user";

// Get list of users
export const getUsers = async (): Promise<AxiosResponse<UserListResponse>> => {
  return await request.get('users');
};

// Get single user by ID
export const getUser = async (id: number): Promise<AxiosResponse<UserByIdResponse>> => {
  return await request.get(`users/${id}`);
};

// Update user role
export const updateUserRole = async (id: number, data: UpdateUserRoleRequest): Promise<AxiosResponse<UserResponse>> => {
  return await request.put(`users/${id}/role`, data);
};

// Update user active status
export const updateUserActiveStatus = async (id: number, data: UpdateUserActiveStatusRequest): Promise<AxiosResponse<UserResponse>> => {
  return await request.put(`users/${id}/active`, data);
};

