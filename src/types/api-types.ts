export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
  meta?: {
    total?: number
    page?: number
    limit?: number
  }
}


export interface ApiResponse<T> {
  success: boolean;
  data?: T;
}
