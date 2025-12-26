import { PaginationInfo } from "./booking";

export interface CategoryLanguages {
  [languageCode: string]: {
    name: string;
    description: string;
  };
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
  translations: CategoryLanguage[];
}

export interface CategoryLanguage {
  language_code: string;
  name: string;
  description: string;
}

export interface CategoryListResponse {
  message: string;
  data: Category[];
  pagination: PaginationInfo;
}

export interface CategoryOption {
  id: number;
  name: string;
}

export interface CategoryOptionsResponse {
  message: string;
  data: CategoryOption[];
}

export interface CreateCategoryRequest {
  translations: CategoryLanguages;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: number;
}

export interface CategoryResponse {
  message: string;
  data: Category;
}

export interface CategoryDeleteResponse {
  message: string;
}