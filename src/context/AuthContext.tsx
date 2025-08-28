"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authService } from '@/services/authService';
import { getMe } from '@/api/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credential: string) => Promise<void>;
  logout: () => void;
  validateToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const validateToken = async (): Promise<boolean> => {
    try {
      const token = authService.getToken();
      if (!token) {
        return false;
      }

      const response = await getMe();
      if (response.status === 200) {
        setUser(response.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  };

  useEffect(() => {
    // Check if user is logged in when component mounts
    const checkAuth = async () => {
        // Validate token with server
        const isValid = await validateToken();
        if (!isValid) {
          authService.removeToken();
          setUser(null);
          if (typeof window !== "undefined" && window.location.pathname !== "/signin") {
            window.location.href = "/signin";
          }
        }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credential: string) => {
    try {
      setIsLoading(true);
      const response = await authService.googleLogin(credential);
      
      // Save token
      authService.setToken(response.data.token);
      
      // Update user state
      setUser(response.data.user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.removeToken();
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/signin";
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    validateToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
