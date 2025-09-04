"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import Label from '@/components/form/Label';
import { LANGUAGES } from '@/constants/languages';
import { MultiLanguageValue } from '@/types/language';

interface MultiLanguageTextareaProps {
  label: string;
  value: MultiLanguageValue;
  onChange: (value: MultiLanguageValue) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  rows?: number;
}

export const MultiLanguageTextarea: React.FC<MultiLanguageTextareaProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  error,
  className = '',
  rows = 4,
}) => {
  const { availableLanguages, defaultLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>(defaultLanguage.code);

  const handleInputChange = (languageCode: string, inputValue: string) => {
    const newValue = {
      ...value,
      [languageCode]: inputValue,
    };
    onChange(newValue);
  };

  const getInputValue = (languageCode: string): string => {
    return value[languageCode] || '';
  };

  const isDefaultLanguageRequired = required && activeTab === (defaultLanguage.code || LANGUAGES.EN);
  const hasError = error && activeTab === (defaultLanguage.code || LANGUAGES.EN);

  return (
    <div className={`space-y-3 ${className}`}>
      <Label htmlFor={`${label}-${activeTab}`} className="text-theme-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {/* Language Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
        {availableLanguages.map((language) => (
          <button
            key={language.code}
            type="button"
            onClick={() => setActiveTab(language.code)}
            className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === language.code
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            {language.name}
            {language.is_default && (
              <span className="ml-1 text-xs text-gray-400">(Default)</span>
            )}
          </button>
        ))}
      </div>

      {/* Textarea Field */}
      <div className="relative">
        <textarea
          id={`${label}-${activeTab}`}
          value={getInputValue(activeTab)}
          onChange={(e) => handleInputChange(activeTab, e.target.value)}
          placeholder={`${placeholder} (${availableLanguages.find(lang => lang.code === activeTab)?.name})`}
          rows={rows}
          className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white ${
            hasError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
          }`}
          required={isDefaultLanguageRequired}
        />
        
        {/* Language indicator */}
        <div className="absolute right-3 top-3">
          <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {availableLanguages.find(lang => lang.code === activeTab)?.code.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Error message */}
      {hasError && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {/* Language completion indicator */}
      <div className="flex flex-wrap gap-2">
        {availableLanguages.map((language) => {
          const hasValue = getInputValue(language.code).trim() !== '';
          return (
            <div
              key={language.code}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${
                hasValue
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
              }`}
            >
              <span>{language.code.toUpperCase()}</span>
              {hasValue ? (
                <span className="text-green-600">✓</span>
              ) : (
                <span className="text-gray-400">○</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
