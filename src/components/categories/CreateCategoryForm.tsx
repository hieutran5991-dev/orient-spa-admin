'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageBreadcrumb from '../common/PageBreadCrumb';
import ComponentCard from '../common/ComponentCard';
import { createCategory } from '@/api/category';
import { validateCategoryForm, CategoryFormData, CategoryFormErrors } from '@/lib/validations';
import { useAlert } from '@/context/AlertContext';
import { AlertMessages, AlertConfigs } from '@/lib/alertMessages';
import { HTTP_CODES } from '@/constants/http-codes';
import { getErrorMessage, getErrorTitle, isPermissionError } from '@/lib/errorHandler';
import { MultiLanguageInput } from '../form/MultiLanguageInput';
import { MultiLanguageTextarea } from '../form/MultiLanguageTextarea';
import { CategoryLanguages } from '@/types/category';
import { MultiLanguageValue } from '@/types/language';
import { useLanguage } from '@/context/LanguageContext';

export default function CreateCategoryForm() {
  const router = useRouter();
  const { showSuccess, showError } = useAlert();
  const { availableLanguages } = useLanguage();

  const initialMultiLanguageValue = availableLanguages.reduce((acc, language) => {
    acc[language.code] = '';
    return acc;
  }, {} as MultiLanguageValue);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialMultiLanguageValue,
    description: initialMultiLanguageValue,
  });

  const [errors, setErrors] = useState<CategoryFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors = validateCategoryForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMultiLanguageChange = (field: 'name' | 'description', value: MultiLanguageValue) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof CategoryFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await createCategory({
        translations: availableLanguages.reduce((acc, language) => {
          if (formData.name[language.code] && formData.description[language.code]) {
            acc[language.code] = {
              name: formData.name[language.code],
              description: formData.description[language.code],
            };
          }
          return acc;
        }, {} as CategoryLanguages),
      });

      if (response.status === HTTP_CODES.CREATED) {
        showSuccess(
          AlertMessages.SUCCESS.CATEGORY_CREATED.title,
          AlertMessages.SUCCESS.CATEGORY_CREATED.message,
          AlertConfigs.SUCCESS
        );
        // Redirect to categories list after a short delay
        router.push('/categories');
      } else {
        showError(
          AlertMessages.ERROR.SAVE_ERROR.title,
          AlertMessages.ERROR.SAVE_ERROR.message,
          AlertConfigs.ERROR
        );
      }
    } catch (error) {
      console.error('Error creating category:', error);
      const errorTitle = isPermissionError(error) 
        ? AlertMessages.ERROR.PERMISSION_DENIED.title 
        : getErrorTitle(error);
      const errorMessage = getErrorMessage(error);
      showError(
        errorTitle,
        errorMessage,
        AlertConfigs.ERROR
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Create New Category" />
      
      <div className="space-y-6">
        <ComponentCard title="Category Information">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <MultiLanguageInput
              label="Category Name"
              value={formData.name}
              onChange={(value) => handleMultiLanguageChange('name', value)}
              placeholder="Enter category name"
              required={true}
              error={errors.name}
            />

            {/* Description Field */}
            <MultiLanguageTextarea
              label="Category Description"
              value={formData.description}
              onChange={(value) => handleMultiLanguageChange('description', value)}
              placeholder="Enter category description"
              required={true}
              error={errors.description}
              rows={4}
            />

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/categories"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Back to List
              </Link>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Category'}
              </button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  );
}