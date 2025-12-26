import request from "@/lib/axios";
import { AxiosResponse } from "axios";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryListResponse,
  CategoryResponse,
  CategoryOptionsResponse,
  CategoryDeleteResponse
} from "@/types/category";

// Get list of categories
export const getCategories = async (page: number = 1, perPage: number = 10): Promise<AxiosResponse<CategoryListResponse>> => {
  return await request.get('categories', {
    params: {
      page,
      per_page: perPage,
    },
  });
};

// Get single category by ID
export const getCategory = async (id: number): Promise<AxiosResponse<CategoryResponse>> => {
  return await request.get(`categories/${id}`);
};

// Create new category
export const createCategory = async (data: CreateCategoryRequest): Promise<AxiosResponse<CategoryResponse>> => {
  return await request.post('categories', data);
};

// Update category
export const updateCategory = async (id: number, data: UpdateCategoryRequest): Promise<AxiosResponse<CategoryResponse>> => {
  return await request.put(`categories/${id}`, data);
};

// Delete category / Only ones with no products
export const deleteCategory = async (id: number): Promise<AxiosResponse<CategoryDeleteResponse>> => {
  return await request.delete(`categories/${id}`);
};

// Get categories options
export const getCategoryOptions = async (): Promise<AxiosResponse<CategoryOptionsResponse>> => {
  return await request.get(`categories/options`)
}

