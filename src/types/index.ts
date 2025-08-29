// Export all types
export * from './agency';
export * from './category';
export * from './product';
export * from './booking';

// Re-export common types
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

