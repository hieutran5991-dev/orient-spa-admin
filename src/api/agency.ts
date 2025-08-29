import request from "@/lib/axios";
import { AxiosResponse } from "axios";
import {
  CreateAgencyRequest,
  UpdateAgencyRequest,
  AgencyListResponse,
  AgencyResponse,
} from "@/types/agency";

// Get list of agencies
export const getAgencies = async (): Promise<AxiosResponse<AgencyListResponse>> => {
  return await request.get('api/agencies');
};

// Get single agency by ID
export const getAgency = async (id: number): Promise<AxiosResponse<AgencyResponse>> => {
  return await request.get(`api/agencies/${id}`);
};

// Create new agency
export const createAgency = async (data: CreateAgencyRequest): Promise<AxiosResponse<AgencyResponse>> => {
  return await request.post('api/agencies', data);
};

// Update agency
export const updateAgency = async (id: number, data: UpdateAgencyRequest): Promise<AxiosResponse<AgencyResponse>> => {
  return await request.put(`api/agencies/${id}`, data);
};

// Delete agency / Only ones with no bookings
export const deleteAgency = async (id: number): Promise<AxiosResponse<void>> => {
  return await request.delete(`api/agencies/${id}`);
};
