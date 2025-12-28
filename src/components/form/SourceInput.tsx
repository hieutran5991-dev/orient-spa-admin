'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { ChevronDownIcon } from '@/icons';
import { SourceOption } from '@/types/source';

interface SourceInputProps {
  id: string;
  label: string;
  sourceId: string;
  sources: SourceOption[];
  onSourceChange: (sourceId: string) => void;
  placeholder?: string;
  error?: boolean;
  hint?: string;
}

export default function SourceInput({
  id,
  label,
  sourceId,
  sources,
  onSourceChange,
  placeholder = 'Select source',
  error,
  hint,
}: SourceInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectedSource = sources.find(source => source.value.toString() === sourceId);

  // Filter sources based on search query
  const filteredSources = useMemo(() => {
    if (!searchQuery.trim()) {
      return sources;
    }
    const query = searchQuery.toLowerCase().trim();
    return sources.filter(
      source => source.label.toLowerCase().includes(query)
    );
  }, [searchQuery, sources]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus search input when dropdown opens
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSourceSelect = (sourceIdValue: string) => {
    onSourceChange(sourceIdValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <Link
          href="/settings/sources"
          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          onClick={(e) => e.stopPropagation()}
        >
          Manage sources
        </Link>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`h-11 w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:focus:border-brand-800 flex items-center justify-between ${
            sourceId ? 'text-gray-800 dark:text-white/90' : 'text-gray-400 dark:text-gray-400'
          } ${error ? 'border-red-500 dark:border-red-500' : ''}`}
        >
          <span>{selectedSource ? selectedSource.label : placeholder}</span>
          <ChevronDownIcon className="size-4" />
        </button>
        
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => {
                setIsOpen(false);
                setSearchQuery('');
              }}
            />
            <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
              {/* Search Input */}
              <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search source..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white/90 placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>
              
              {/* Sources List */}
              <div className="max-h-48 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => handleSourceSelect('')}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    !sourceId
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {placeholder}
                </button>
                {filteredSources.length > 0 ? (
                  filteredSources.map((source) => (
                    <button
                      key={source.value}
                      type="button"
                      onClick={() => handleSourceSelect(source.value.toString())}
                      className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        sourceId === source.value.toString()
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {source.label}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    No sources found
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      {hint && (
        <p className={`mt-1 text-sm ${error ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
          {hint}
        </p>
      )}
    </div>
  );
}

