"use client";

import { getLanguages } from '@/api/language';
import { Language } from '@/types/language';
import { DEFAULT_FALLBACK_LANGUAGE } from '@/constants/languages';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface LanguageContextType {
  availableLanguages: Language[];
  defaultLanguage: Language;
  getLanguageName: (code: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([DEFAULT_FALLBACK_LANGUAGE]);

  useEffect(() => {
    const fetchLanguages = async () => {
      const response = await getLanguages();
      setAvailableLanguages(response.data.data);
    };
    fetchLanguages();
  }, []);

  const getLanguageName = (code: string): string => {
    const language = availableLanguages.find(lang => lang.code === code);
    return language?.name || code;
  };

  const value: LanguageContextType = {
    availableLanguages,
    defaultLanguage: availableLanguages.find(lang => lang.is_default) || availableLanguages[0],
    getLanguageName,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
