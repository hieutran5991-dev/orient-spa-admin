import { User, AuthResponse, googleLogin as apiGoogleLogin } from '@/api/auth';

class AuthService {
  // Save token to localStorage
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  // Get token from localStorage
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  // Remove token when logout
  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }

  // Save user data to localStorage
  setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(user));
    }
  }

  // Get user data from localStorage
  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch (error) {
          console.error('Error parsing user data:', error);
          return null;
        }
      }
    }
    return null;
  }

  // Check if user is logged in
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Google login using API
  async googleLogin(credential: string): Promise<AuthResponse> {
    try {
      const response = await apiGoogleLogin(credential);
      return response.data;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
export type { User, AuthResponse };
