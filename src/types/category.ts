export interface Category {
  id: number;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryListResponse {
  data: Category[];
}

export interface CategoryOption {
  id: number;
  name: string;
}

export interface CategoryOptionsResponse {
  data: CategoryOption[];
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: number;
}

export interface CategoryResponse {
  data: Category;
}

export interface CategoryDeleteResponse {
  message: string;
}
