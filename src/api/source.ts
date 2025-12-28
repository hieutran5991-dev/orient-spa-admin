import request from "@/lib/axios";
import { AxiosResponse } from "axios";
import { SourceOption, Source } from "@/types/source";
import { PaginationInfo } from "@/types/booking";

export interface SourceListResponse {
  message: string;
  data: Source[];
  pagination: PaginationInfo;
}

export interface SourceResponse {
  message: string;
  data: Source;
}

export interface CreateSourceRequest {
  name: string;
  is_active?: boolean;
}

export interface UpdateSourceRequest {
  name?: string;
  is_active?: boolean;
}

// Get list of sources
export const getSources = async (page: number = 1, perPage: number = 10): Promise<AxiosResponse<SourceListResponse>> => {
  return await request.get('sources', {
    params: {
      page,
      per_page: perPage,
    },
  });
};

// Get single source by ID
export const getSource = async (id: number): Promise<AxiosResponse<SourceResponse>> => {
  return await request.get(`sources/${id}`);
};

// Create new source
export const createSource = async (data: CreateSourceRequest): Promise<AxiosResponse<SourceResponse>> => {
  return await request.post('sources', data);
};

// Update source
export const updateSource = async (id: number, data: UpdateSourceRequest): Promise<AxiosResponse<SourceResponse>> => {
  return await request.put(`sources/${id}`, data);
};

// Delete source
export const deleteSource = async (id: number): Promise<AxiosResponse<{ message: string }>> => {
  return await request.delete(`sources/${id}`);
};

// Get source options for dropdowns
export const getSourceOptions = async (): Promise<AxiosResponse<{ data: SourceOption[] }>> => {
  return await request.get('sources/options');
};

