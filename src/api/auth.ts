import request from "@/lib/axios";
import { AxiosResponse } from "axios";

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  permissions?: string[];
  is_active?: boolean;
}

export interface AuthResponse {
    data: {
        user: User;
        token: string;
        token_type: string;
    },
    message: string;
    status: number;
}

export const getMe = async (): Promise<AxiosResponse<{data: User}>> => {
  return await request.get('auth/me');
};

export const googleLogin = async (credential: string): Promise<AxiosResponse<AuthResponse>> => {
  return await request.post('auth/google/callback', { credential });
};

export const logout = async (): Promise<AxiosResponse<void>> => {
  return await request.post('auth/logout');
};
