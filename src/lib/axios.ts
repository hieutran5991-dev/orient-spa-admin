import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Create axios instance
const request: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - automatically add token to header
request.interceptors.request.use(
  (config) => {
    // Add token only if on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý lỗi authentication
request.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        // If 401 (Unauthorized), clear token and redirect to signin
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            // Only redirect if not on signin page
            if (window.location.pathname !== '/signin') {
              window.location.href = '/signin';
            }
          }
        }
        
        return Promise.reject(error);
      }
);

export default request;
