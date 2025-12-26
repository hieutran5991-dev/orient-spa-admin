import { AxiosError } from 'axios';
import { AlertMessages, AlertConfigs } from './alertMessages';

export interface ApiErrorResponse {
  message?: string;
  errors?: unknown;
}

export interface HandleErrorOptions {
  showAlert?: (title: string, message: string, config?: unknown) => void;
  defaultTitle?: string;
  defaultMessage?: string;
}

/**
 * Extract error message from API error response
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    // Check if it's an Axios error
    if ('response' in error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.data?.message) {
        return axiosError.response.data.message;
      }
      if (axiosError.response?.status === 403) {
        return 'Bạn không có quyền thực hiện hành động này.';
      }
      if (axiosError.response?.status === 401) {
        return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      }
      if (axiosError.response?.status === 404) {
        return 'Không tìm thấy tài nguyên được yêu cầu.';
      }
      if (axiosError.response?.status === 500) {
        return 'Lỗi máy chủ. Vui lòng thử lại sau.';
      }
    }
    return error.message;
  }
  return 'Đã xảy ra lỗi không xác định.';
};

/**
 * Get error title based on status code
 */
export const getErrorTitle = (error: unknown): string => {
  if (error instanceof Error && 'response' in error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 403) {
      return AlertMessages.ERROR.PERMISSION_DENIED.title;
    }
    if (axiosError.response?.status === 401) {
      return AlertMessages.ERROR.UNAUTHORIZED.title;
    }
    if (axiosError.response?.status === 404) {
      return AlertMessages.ERROR.NOT_FOUND.title;
    }
    if (axiosError.response?.status === 500) {
      return AlertMessages.ERROR.SERVER_ERROR.title;
    }
  }
  return AlertMessages.ERROR.NETWORK_ERROR.title;
};

/**
 * Check if error is a permission error (403)
 */
export const isPermissionError = (error: unknown): boolean => {
  if (error instanceof Error && 'response' in error) {
    const axiosError = error as AxiosError;
    return axiosError.response?.status === 403;
  }
  return false;
};

/**
 * Check if error is an authentication error (401)
 */
export const isAuthenticationError = (error: unknown): boolean => {
  if (error instanceof Error && 'response' in error) {
    const axiosError = error as AxiosError;
    return axiosError.response?.status === 401;
  }
  return false;
};

/**
 * Handle error and show appropriate alert message
 * This is a convenience function to avoid duplicate error handling code
 */
export const handleApiError = (
  error: unknown,
  showError: (title: string, message: string, config?: unknown) => void,
  options?: {
    defaultTitle?: string;
    defaultMessage?: string;
  }
): void => {
  const errorTitle = isPermissionError(error) 
    ? AlertMessages.ERROR.PERMISSION_DENIED.title 
    : (options?.defaultTitle || getErrorTitle(error));
  const errorMessage = options?.defaultMessage || getErrorMessage(error);
  
  showError(
    errorTitle,
    errorMessage,
    AlertConfigs.ERROR
  );
};

