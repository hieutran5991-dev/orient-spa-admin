'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import PageBreadcrumb from '../common/PageBreadCrumb';
import ComponentCard from '../common/ComponentCard';
import { getCategory, updateCategory } from '@/api/category';
import { Category, CategoryLanguages  } from '@/types/category';
import { validateCategoryForm, CategoryFormData, CategoryFormErrors } from '@/lib/validations';
import { useAlert } from '@/context/AlertContext';
import { AlertMessages, AlertConfigs } from '@/lib/alertMessages';
import { HTTP_CODES } from '@/constants/http-codes';
import { MultiLanguageInput } from '../form/MultiLanguageInput';
import { MultiLanguageTextarea } from '../form/MultiLanguageTextarea';
import { MultiLanguageValue } from '@/types/language';
import { useLanguage } from '@/context/LanguageContext';

export default function EditCategoryForm() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params.id as string;
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
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<Category | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Fetch category data on component mount
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoading(true);
        const response = await getCategory(parseInt(categoryId));
        
        if (response.status === HTTP_CODES.SUCCESS) {
          const categoryData = response.data.data;
          setCategory(categoryData);
          setFormData({
            name: categoryData.translations.reduce((acc, translation) => {
              acc[translation.language_code] = translation.name;
              return acc;
            }, {} as MultiLanguageValue),
            description: categoryData.translations.reduce((acc, translation) => {
              acc[translation.language_code] = translation.description;
              return acc;
            }, {} as MultiLanguageValue),
          });
        } else {
          setLoadError('Category not found');
          showError(
            AlertMessages.ERROR.CATEGORY_NOT_FOUND.title,
            AlertMessages.ERROR.CATEGORY_NOT_FOUND.message,
            AlertConfigs.ERROR
          );
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        setLoadError('Failed to load category data');
        showError(
          AlertMessages.ERROR.LOAD_ERROR.title,
          AlertMessages.ERROR.LOAD_ERROR.message,
          AlertConfigs.ERROR
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId, showError]);

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
      const response = await updateCategory(parseInt(categoryId), {
        id: parseInt(categoryId),
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

      if (response.status === HTTP_CODES.SUCCESS) {
        showSuccess(
          AlertMessages.SUCCESS.CATEGORY_UPDATED.title,
          AlertMessages.SUCCESS.CATEGORY_UPDATED.message,
          AlertConfigs.SUCCESS
        );
        // Redirect to categories list after a short delay

        router.push('/categories');
      } else {
        console.error('Failed to update category:', response.data);
        showError(
          AlertMessages.ERROR.SAVE_ERROR.title,
          AlertMessages.ERROR.SAVE_ERROR.message,
          AlertConfigs.ERROR
        );
      }
    } catch (error) {
      console.error('Error updating category:', error);
      showError(
        AlertMessages.ERROR.NETWORK_ERROR.title,
        AlertMessages.ERROR.NETWORK_ERROR.message,
        AlertConfigs.ERROR
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit Category" />
        <div className="space-y-6">
          <ComponentCard title="Loading Category">
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading category data...</span>
            </div>
          </ComponentCard>
        </div>
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit Category" />
        <div className="space-y-6">
          <ComponentCard title="Error Loading Category">
            <div className="p-6 text-center">
              <p className="text-red-500 mb-4">{loadError}</p>
              <Link
                href="/categories"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
              >
                Back to Categories
              </Link>
            </div>
          </ComponentCard>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle={`Edit Category: ${category?.name || 'Loading...'}`} />
      
      <div className="space-y-6">
        <ComponentCard title="Edit Category Information">
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
                {isSubmitting ? 'Updating...' : 'Update Category'}
              </button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  );
}