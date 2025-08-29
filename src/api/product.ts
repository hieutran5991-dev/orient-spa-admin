import request from "@/lib/axios";
import { AxiosResponse } from "axios";
import {
  CreateProductRequest,
  UpdateProductRequest,
  ProductListResponse,
  ProductResponse,
} from "@/types/product";

// Get list of products
export const getProducts = async (): Promise<AxiosResponse<ProductListResponse>> => {
  return await request.get('api/products');
};

// Get single product by ID
export const getProduct = async (id: number): Promise<AxiosResponse<ProductResponse>> => {
  return await request.get(`api/products/${id}`);
};

// Create new product
export const createProduct = async (data: CreateProductRequest): Promise<AxiosResponse<ProductResponse>> => {
  return await request.post('api/products', data);
};

// Update product
export const updateProduct = async (id: number, data: UpdateProductRequest): Promise<AxiosResponse<ProductResponse>> => {
  return await request.put(`api/products/${id}`, data);
};

// Delete product
export const deleteProduct = async (id: number): Promise<AxiosResponse<void>> => {
  return await request.delete(`api/products/${id}`);
};
