'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronDownIcon } from '@/icons';
import InputField from './input/InputField';
import { COUNTRIES, Country } from '@/constants/countries';

interface PhoneInputWithPrefixProps {
  id: string;
  label: string;
  value: string;
  prefix: string;
  onPrefixChange: (prefix: string) => void;
  onPhoneChange: (phone: string) => void;
  placeholder?: string;
  error?: boolean;
  hint?: string;
  required?: boolean;
}

export default function PhoneInputWithPrefix({
  id,
  label,
  value,
  prefix,
  onPrefixChange,
  onPhoneChange,
  placeholder = 'Phone number',
  error,
  hint,
  required = false,
}: PhoneInputWithPrefixProps) {
  const [isPrefixOpen, setIsPrefixOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find selected country
  const selectedCountry = COUNTRIES.find(country => country.dial === prefix) || COUNTRIES.find(country => country.dial === '+84');

  // Filter countries based on search query
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return COUNTRIES;
    }
    const query = searchQuery.toLowerCase().trim();
    return COUNTRIES.filter(
      country =>
        country.name.toLowerCase().includes(query) ||
        country.dial.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPrefixOpen(false);
        setSearchQuery('');
      }
    };
    if (isPrefixOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus search input when dropdown opens
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPrefixOpen]);

  const handleCountrySelect = (country: Country) => {
    onPrefixChange(country.dial);
    setIsPrefixOpen(false);
    setSearchQuery('');
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-2">
        {/* Country Code Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsPrefixOpen(!isPrefixOpen)}
            className="h-11 px-2 py-2.5 text-sm rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700 text-gray-800 dark:text-white/90 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:focus:border-brand-800 flex items-center gap-1 w-[85px]"
          >
            <span>{selectedCountry?.dial || prefix}</span>
            <ChevronDownIcon className="size-4" />
          </button>
          
          {isPrefixOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => {
                  setIsPrefixOpen(false);
                  setSearchQuery('');
                }}
              />
              <div className="absolute z-20 mt-1 w-80 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
                {/* Search Input */}
                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search country or code..."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                
                {/* Countries List */}
                <div className="max-h-64 overflow-y-auto">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <button
                        key={`${country.code}-${country.dial}`}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between ${
                          prefix === country.dial
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        <span className="flex-1">{country.name}</span>
                        <span className="ml-2 text-gray-500 dark:text-gray-400">{country.dial}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      No countries found
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Phone Number Input */}
        <div className="flex-1">
          <InputField
            type="tel"
            id={id}
            name={id}
            value={value}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder={placeholder}
            error={error}
            hint={hint}
          />
        </div>
      </div>
    </div>
  );
}

