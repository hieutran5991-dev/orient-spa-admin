'use client';

import { useState, useEffect, useRef } from 'react';
import { Product } from '@/types/product';
import { formatPriceWithCurrency } from '@/lib/currency';
import { ChevronDownIcon, UserIcon } from '@/icons';

interface TreatmentSelectorProps {
  guestNumber: number;
  products: Product[];
  selectedProductIds: number[];
  onProductsChange: (productIds: number[]) => void;
  applyToAll: boolean;
  onApplyToAllChange: (apply: boolean) => void;
  isFirstGuest: boolean;
}

export default function TreatmentSelector({
  guestNumber,
  products,
  selectedProductIds,
  onProductsChange,
  applyToAll,
  onApplyToAllChange,
  isFirstGuest,
}: TreatmentSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedProducts = products.filter(p => selectedProductIds.includes(p.id));
  const selectedProductNames = selectedProducts.map(p => p.name).join(', ');

  const handleProductToggle = (productId: number) => {
    if (selectedProductIds.includes(productId)) {
      onProductsChange(selectedProductIds.filter(id => id !== productId));
    } else {
      onProductsChange([...selectedProductIds, productId]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Select treatment for Guest {guestNumber}
          </h3>
        </div>
      </div>

      {/* Treatment Dropdown */}
      <div className="relative">
        <div
          ref={triggerRef}
          onClick={() => setIsOpen(!isOpen)}
          className={`h-11 w-full rounded-lg border appearance-none px-4 py-2.5 pr-11 text-sm shadow-theme-xs cursor-pointer dark:bg-gray-900 dark:text-white/90 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 ${
            selectedProductIds.length > 0
              ? 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800'
              : 'bg-white'
          }`}
        >
          {selectedProductIds.length > 0 ? (
            <span className="text-gray-800 dark:text-white/90">{selectedProductNames}</span>
          ) : (
            <span className="text-gray-400 dark:text-gray-400">Select your treatment</span>
          )}
        </div>
        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
          <ChevronDownIcon className="size-5" />
        </span>

        {/* Dropdown Content */}
        {isOpen && (
          <div ref={dropdownRef} className="absolute z-[9999] mt-2 w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg max-h-96 overflow-y-auto">
            <div className="p-4 space-y-3">
              {products.map((product) => {
                const isSelected = selectedProductIds.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductToggle(product.id);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleProductToggle(product.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Duration: {product.duration} minutes
                          </span>
                          <div className="flex items-center gap-2">
                            {Object.entries(product.prices || {}).map(([currency, price]) => (
                              <span key={currency} className="text-gray-900 dark:text-white font-medium">
                                {formatPriceWithCurrency(price, currency)}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Apply to all guests checkbox - only show for first guest */}
      {isFirstGuest && (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`apply-to-all-${guestNumber}`}
            checked={applyToAll}
            onChange={(e) => onApplyToAllChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor={`apply-to-all-${guestNumber}`}
            className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
          >
            Apply this same treatment for all guests
          </label>
        </div>
      )}
    </div>
  );
}

