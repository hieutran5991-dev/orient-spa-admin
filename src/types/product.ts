import { Category } from "./category";
export interface Product {
  id: number;
  name: string;
  description: string;
  category_id: number;
  duration: number; // in minutes
  price: number;
  currency: string;
  version?: string;
  is_promoted: boolean;
  promotion_description?: string;
  promotion_details?: string;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  category?: Category;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  category_id: number;
  duration: number;
  price: number;
  currency: string;
  version?: string;
  is_promoted: boolean;
  promotion_description?: string;
  promotion_details?: string;
}

export interface ProductListResponse {
  data: Product[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  id: number;
}

export interface ProductResponse {
  data: Product;
}

