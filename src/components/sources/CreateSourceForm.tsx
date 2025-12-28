'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ComponentCard from '../common/ComponentCard';
import { createSource } from '@/api/source';
import { useAlert } from '@/context/AlertContext';
import { AlertMessages, AlertConfigs } from '@/lib/alertMessages';
import { HTTP_CODES } from '@/constants/http-codes';
import { getErrorMessage, getErrorTitle, isPermissionError } from '@/lib/errorHandler';
import InputField from '../form/input/InputField';

interface SourceFormData {
  name: string;
  is_active: boolean;
}

interface SourceFormErrors {
  name?: string;
}

export default function CreateSourceForm() {
  const router = useRouter();
  const { showSuccess, showError } = useAlert();

  const [formData, setFormData] = useState<SourceFormData>({
    name: '',
    is_active: true,
  });

  const [errors, setErrors] = useState<SourceFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: SourceFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Source name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof SourceFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await createSource({
        name: formData.name.trim(),
        is_active: formData.is_active,
      });

      if (response.status === HTTP_CODES.CREATED) {
        showSuccess(
          'Source Created',
          'Source has been created successfully',
          AlertConfigs.SUCCESS
        );
        router.push('/settings/sources');
      } else {
        showError(
          AlertMessages.ERROR.SAVE_ERROR.title,
          AlertMessages.ERROR.SAVE_ERROR.message,
          AlertConfigs.ERROR
        );
      }
    } catch (error) {
      console.error('Error creating source:', error);
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
    <div className="space-y-6">
      <ComponentCard title="Create New Source">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Source Name <span className="text-red-500">*</span>
            </label>
            <InputField
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter source name"
              error={!!errors.name}
              hint={errors.name}
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Active
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/settings/sources"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Creating...' : 'Create Source'}
            </button>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}

