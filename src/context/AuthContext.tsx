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
  // Initialize user as null to avoid hydration mismatch
  // We'll load from localStorage in useEffect (client-side only)
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const validateToken = async (): Promise<boolean> => {
    try {
      // Don't validate if we're on account-pending page
      if (typeof window !== 'undefined' && window.location.pathname.includes('account-pending')) {
        return false;
      }

      const token = authService.getToken();
      if (!token) {
        return false;
      }

      const response = await getMe();
      
      if (response.status === 200) {
        const userData = response.data.data;
        
        // Check if user is active
        if (userData && userData.is_active === false) {
          // User is not active, redirect to pending page (only if not already there)
          authService.removeToken();
          setUser(null);
          if (typeof window !== 'undefined' && !window.location.pathname.includes('account-pending')) {
            window.location.href = '/account-pending';
          }
          return false;
        }
        
        setUser(userData);
        authService.setUser(userData); // Save to localStorage
        return true;
      }
      return false;
    } catch (error: unknown) {
      console.error('Token validation failed:', error);
      
      // Check if error is about inactive account
      const errorMessage = (error as { response?: { data?: { message?: string; error?: string } }; message?: string })?.response?.data?.message || 
                          (error as { response?: { data?: { message?: string; error?: string } }; message?: string })?.response?.data?.error || 
                          (error as { message?: string })?.message || '';
      if (errorMessage.toLowerCase().includes('inactive') || 
          errorMessage.toLowerCase().includes('account is inactive')) {
        // Redirect to pending page (only if not already there)
        authService.removeToken();
        setUser(null);
        if (typeof window !== 'undefined' && !window.location.pathname.includes('account-pending')) {
          window.location.href = '/account-pending';
        }
        return false;
      }
      
      return false;
    }
  };

  // Load user from localStorage on client-side mount (to avoid hydration mismatch)
  useEffect(() => {
    const savedUser = authService.getUser();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  useEffect(() => {
    // Check if user is logged in when component mounts
    const checkAuth = async () => {
        // Don't validate if we're on account-pending or signin page
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          if (currentPath.includes('account-pending') || currentPath === '/signin') {
            setIsLoading(false);
            return;
          }
        }
        
        // Validate token with server
        const isValid = await validateToken();
        
        if (!isValid) {
          // validateToken already handles redirect to /account-pending if user is inactive
          // Only redirect to /signin if validation failed for other reasons (no token, invalid token, etc.)
          // and we're not already on signin or account-pending page
          if (typeof window !== "undefined") {
            const currentPath = window.location.pathname;
            if (currentPath !== "/signin" && !currentPath.includes('account-pending')) {
          authService.removeToken();
          setUser(null);
            window.location.href = "/signin";
            }
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
      
      // Backend returns token even if account is inactive
      // Check if user is active
      if (response.data.user && response.data.user.is_active === false) {
        // User is not active, don't save token, clear any existing token, redirect to pending page
        authService.removeToken();
        setUser(null);
        if (typeof window !== 'undefined') {
          window.location.href = '/account-pending';
        }
        return;
      }
      
      // User is active, save token and user data
      authService.setToken(response.data.token);
      authService.setUser(response.data.user);
      
      // Update user state
      setUser(response.data.user);
    } catch (error: unknown) {
      console.error('Login failed:', error);
      
      // Check if error is about inactive account
      const errorMessage = (error as { response?: { data?: { message?: string; error?: string } }; message?: string })?.response?.data?.message || 
                          (error as { response?: { data?: { message?: string; error?: string } }; message?: string })?.response?.data?.error || 
                          (error as { message?: string })?.message || '';
      if (errorMessage.toLowerCase().includes('inactive') || 
          errorMessage.toLowerCase().includes('account is inactive') ||
          errorMessage.toLowerCase().includes('chờ admin duyệt')) {
        // Redirect to pending page
        authService.removeToken();
        setUser(null);
        if (typeof window !== 'undefined') {
          window.location.href = '/account-pending';
        }
        return;
      }
      
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
