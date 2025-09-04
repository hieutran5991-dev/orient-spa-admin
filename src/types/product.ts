import { Category } from "./category";

export interface ProductLanguages {
  [languageCode: string]: {
    name: string;
    description: string;
    price: number;
    currency: string;
    promotion_description?: string;
    promotion_details?: string;
  };
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category_id: number;
  duration: number; // in minutes
  price: number;
  currency: string;
  is_promoted: boolean;
  promotion_description?: string;
  promotion_details?: string;
  created_at?: string;
  updated_at?: string;
  translations: ProductLanguage[];
  
  // Relations
  category?: Category;
}

export interface ProductLanguage {
  language_code: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  promotion_description?: string;
  promotion_details?: string;
}

export interface CreateProductRequest {
  category_id: number;
  duration: number;
  is_promoted: boolean;
  translations: ProductLanguages;
}

export interface ProductListResponse {
  message: string;
  data: Product[];
}

export interface UpdateProductRequest {
  id: number;
  category_id: number;
  duration: number;
  is_promoted: boolean;
  translations: ProductLanguages;
}

export interface ProductResponse {
  message: string;
  data: Product;
}

export interface ProductDeleteResponse {
  message: string;
}