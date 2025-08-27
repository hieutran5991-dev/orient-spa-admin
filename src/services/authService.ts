interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

class AuthService {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }

  async googleLogin(credential: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseURL}/auth/google/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
      });

      if (!response.ok) {
        throw new Error('Google authentication failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

//   async getGoogleRedirectURL(): Promise<string> {
//     try {
//       const response = await fetch(`${this.baseURL}/auth/google/redirect`);
//       if (!response.ok) {
//         throw new Error('Failed to get Google redirect URL');
//       }
//       const data = await response.json();
//       return data.url;
//     } catch (error) {
//       console.error('Error getting Google redirect URL:', error);
//       throw error;
//     }
//   }

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
    }
  }

  // Check if user is logged in
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
export type { User, AuthResponse };
