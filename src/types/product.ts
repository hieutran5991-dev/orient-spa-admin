import { Category } from "./category";

export interface ProductLanguages {
  [languageCode: string]: {
    name: string;
    description: string;
    featured_product_description?: string;
    featured_product_detail?: string;
  };
}

export interface ProductPrices {
  [currencyCode: string]: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  category_id: number;
  duration: number; // in minutes
  is_featured: boolean;
  featured_no?: number;
  featured_product_description?: string;
  featured_product_detail?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  translations: ProductLanguage[];
  prices: ProductPrices;
  
  // Relations
  category?: Category;
}

export interface ProductLanguage {
  language_code: string;
  name: string;
  description: string;
  featured_product_description?: string;
  featured_product_detail?: string;
}

export interface CreateProductRequest {
  category_id: number;
  duration: number;
  is_featured: boolean;
  image?: File;
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
  is_featured: boolean;
  image?: File;
  translations: ProductLanguages;
}

export interface ProductResponse {
  message: string;
  data: Product;
}

export interface ProductDeleteResponse {
  message: string;
}

export interface UpdateFeaturedOrderRequest {
  product_ids: number[];
}

export interface UpdateFeaturedOrderResponse {
  message: string;
}