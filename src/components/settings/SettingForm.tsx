'use client';

import { useState, useEffect } from 'react';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import InputField from '@/components/form/input/InputField';
import { Setting } from '@/types/setting';
import { SETTING_KEYS, SETTING_LABELS, SETTING_VALIDATIONS } from '@/constants/settings';
import { updateSettings } from '@/api/setting';
import { useAlert } from '@/context/AlertContext';
import { AlertMessages, AlertConfigs } from '@/lib/alertMessages';
import { validatePhone, validateEmail } from '@/lib/validations';
import { HTTP_CODES } from '@/constants/http-codes';

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

      if (validationType === 'phone' && !validatePhone(value)) {
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
      showError(
        AlertMessages.ERROR.NETWORK_ERROR.title,
        AlertMessages.ERROR.NETWORK_ERROR.message,
        AlertConfigs.ERROR
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isError) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Settings" />
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
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Spa Settings" />
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Spa Settings
          </h1>
        </div>
        
        <ComponentCard title="General Information">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Phone Number */}
            <div>
              <label htmlFor={SETTING_KEYS.PHONE_NUMBER} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {SETTING_LABELS[SETTING_KEYS.PHONE_NUMBER]} <span className="text-red-500">*</span>
              </label>
              <InputField
                type="tel"
                id={SETTING_KEYS.PHONE_NUMBER}
                name={SETTING_KEYS.PHONE_NUMBER}
                value={formData[SETTING_KEYS.PHONE_NUMBER] || ''}
                onChange={(e) => handleInputChange(SETTING_KEYS.PHONE_NUMBER, e.target.value)}
                placeholder="+8412345678"
                error={!!errors[SETTING_KEYS.PHONE_NUMBER]}
                hint={errors[SETTING_KEYS.PHONE_NUMBER]}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor={SETTING_KEYS.CONTACT_EMAIL} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {SETTING_LABELS[SETTING_KEYS.CONTACT_EMAIL]} <span className="text-red-500">*</span>
              </label>
              <InputField
                type="email"
                id={SETTING_KEYS.CONTACT_EMAIL}
                name={SETTING_KEYS.CONTACT_EMAIL}
                value={formData[SETTING_KEYS.CONTACT_EMAIL] || ''}
                onChange={(e) => handleInputChange(SETTING_KEYS.CONTACT_EMAIL, e.target.value)}
                placeholder="spa@example.com"
                error={!!errors[SETTING_KEYS.CONTACT_EMAIL]}
                hint={errors[SETTING_KEYS.CONTACT_EMAIL]}
              />
            </div>

            {/* Line Info */}
            <div>
              <label htmlFor={SETTING_KEYS.LINE_INFO} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {SETTING_LABELS[SETTING_KEYS.LINE_INFO]} <span className="text-red-500">*</span>
              </label>
              <InputField
                type="text"
                id={SETTING_KEYS.LINE_INFO}
                name={SETTING_KEYS.LINE_INFO}
                value={formData[SETTING_KEYS.LINE_INFO] || ''}
                onChange={(e) => handleInputChange(SETTING_KEYS.LINE_INFO, e.target.value)}
                placeholder="Enter Line information"
                error={!!errors[SETTING_KEYS.LINE_INFO]}
                hint={errors[SETTING_KEYS.LINE_INFO]}
              />
            </div>

            {/* Kakao Talk */}
            <div>
              <label htmlFor={SETTING_KEYS.KAKAO_TALK_INFO} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {SETTING_LABELS[SETTING_KEYS.KAKAO_TALK_INFO]} <span className="text-red-500">*</span>
              </label>
              <InputField
                type="text"
                id={SETTING_KEYS.KAKAO_TALK_INFO}
                name={SETTING_KEYS.KAKAO_TALK_INFO}
                value={formData[SETTING_KEYS.KAKAO_TALK_INFO] || ''}
                onChange={(e) => handleInputChange(SETTING_KEYS.KAKAO_TALK_INFO, e.target.value)}
                placeholder="Enter Kakao Talk information"
                error={!!errors[SETTING_KEYS.KAKAO_TALK_INFO]}
                hint={errors[SETTING_KEYS.KAKAO_TALK_INFO]}
              />
            </div>

            {/* Mail Destination */}
            <div>
              <label htmlFor={SETTING_KEYS.NOTIFY_MAIL} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {SETTING_LABELS[SETTING_KEYS.NOTIFY_MAIL]} <span className="text-red-500">*</span>
              </label>
              <InputField
                type="email"
                id={SETTING_KEYS.NOTIFY_MAIL}
                    name={SETTING_KEYS.NOTIFY_MAIL}
                value={formData[SETTING_KEYS.NOTIFY_MAIL] || ''}
                onChange={(e) => handleInputChange(SETTING_KEYS.NOTIFY_MAIL, e.target.value)}
                placeholder="destination@example.com"
                error={!!errors[SETTING_KEYS.NOTIFY_MAIL]}
                hint={errors[SETTING_KEYS.NOTIFY_MAIL]}
              />
            </div>

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
    </div>
  );
}
