export interface Category {
  id: number;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  id: number;
}

export interface CategoryListResponse {
  data: Category[];
  message: string;
  status: number;
}

export interface CategoryResponse {
  data: Category;
  message: string;
  status: number;
}

