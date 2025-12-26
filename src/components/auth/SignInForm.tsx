"use client";

import React, { useState } from "react";
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function SignInForm() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      setError(null);
      if (credentialResponse.credential) {
        await login(credentialResponse.credential);
        
        // Only redirect to dashboard if login was successful and not redirected to pending page
        // (AuthContext will handle redirect to /account-pending if account is inactive)
        if (typeof window !== 'undefined' && !window.location.pathname.includes('account-pending')) {
          router.push('/');
        }
      }
    } catch (error: unknown) {
      console.error('Login failed:', error);
      
      // Don't show error if redirected to pending page
      const errorMessage = (error as { response?: { data?: { message?: string; error?: string } }; message?: string })?.response?.data?.message || 
                          (error as { response?: { data?: { message?: string; error?: string } }; message?: string })?.response?.data?.error || 
                          (error as { message?: string })?.message || '';
      if (errorMessage.toLowerCase().includes('inactive') || 
          errorMessage.toLowerCase().includes('account is inactive')) {
        // Will be redirected by AuthContext, don't show error
        return;
      }
      
      setError('Login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    setError('An error occurred while logging in with Google.');
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sign in to your account with Google to continue!
            </p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              {error}
            </div>
          )}
          
          <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5">
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  locale="vi"
                />
              </div>
            </div>
            
            {isLoading && (
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                  Processing login...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
