'use client';

import { useState, useEffect } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import InputField from '@/components/form/input/InputField';
import { Setting } from '@/types/setting';
import { SETTING_KEYS, SETTING_LABELS, SETTING_VALIDATIONS } from '@/constants/settings';
import { updateSettings } from '@/api/setting';
import { useAlert } from '@/context/AlertContext';
import { AlertMessages, AlertConfigs } from '@/lib/alertMessages';
import { validatePhone, validateEmail } from '@/lib/validations';
import { HTTP_CODES } from '@/constants/http-codes';
import { getErrorMessage, getErrorTitle, isPermissionError } from '@/lib/errorHandler';

interface SettingFormProps {
  settings: Setting[];
  isError: boolean;
}

export default function SettingForm({ settings, isError }: SettingFormProps) {
  const { showSuccess, showError } = useAlert();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data from settings
  useEffect(() => {
    const initialData: Record<string, string> = {};
    settings.forEach(setting => {
      initialData[setting.key] = setting.value || '';
    });
    setFormData(initialData);
  }, [settings]);

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    Object.entries(formData).forEach(([key, value]) => {
      const validationType = SETTING_VALIDATIONS[key as keyof typeof SETTING_VALIDATIONS] ?? '';
      
      if (!value.trim()) {
        newErrors[key] = `${SETTING_LABELS[key as keyof typeof SETTING_LABELS] || key} is required`;
        return;
      }

      if (validationType === 'tel' && !validatePhone(value)) {
        newErrors[key] = 'Please enter a valid phone number';
      }

      if (validationType === 'email' && !validateEmail(value)) {
        newErrors[key] = 'Please enter a valid email address';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData = {
        settings: Object.entries(formData).map(([key, value]) => ({
          key,
          value: value.trim()
        }))
      };

      const response = await updateSettings(updateData);

      if (response.status === HTTP_CODES.SUCCESS && response.data.message) {
        showSuccess(
          AlertMessages.SUCCESS.SETTINGS_UPDATED.title,
          AlertMessages.SUCCESS.SETTINGS_UPDATED.message,
          AlertConfigs.SUCCESS
        );
      } else {
        showError(
          AlertMessages.ERROR.SETTINGS_UPDATE_ERROR.title,
          AlertMessages.ERROR.SETTINGS_UPDATE_ERROR.message,
          AlertConfigs.ERROR
        );
      }
    } catch (error) {
      console.error('Error updating settings:', error);
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

  if (isError) {
    return (
      <div className="space-y-6">
        <ComponentCard title="Error">
          <div className="p-6 text-center">
            <p className="text-red-500 mb-4">Failed to load settings. Please try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </ComponentCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ComponentCard title="General Information">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {
              Object.keys(SETTING_KEYS).map(key => (
                <div key={key}>
                  <label htmlFor={key} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {SETTING_LABELS[key as keyof typeof SETTING_LABELS]} <span className="text-red-500">*</span>
                  </label>
                  <InputField
                    type={SETTING_VALIDATIONS[key as keyof typeof SETTING_VALIDATIONS]}
                    id={key}
                    name={key}
                    value={formData[key] || ''}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    placeholder={SETTING_LABELS[key as keyof typeof SETTING_LABELS]}
                    error={!!errors[key]}
                    hint={errors[key]}
                  />
                </div>
              ))
            }

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Updating...' : 'Update Settings'}
              </button>
            </div>
          </form>
      </ComponentCard>
    </div>
  );
}
