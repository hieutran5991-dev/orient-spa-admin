'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PageBreadcrumb from '../common/PageBreadCrumb';
import ComponentCard from '../common/ComponentCard';
import { MultiLanguageInput } from '../form/MultiLanguageInput';
import { MultiLanguageTextarea } from '../form/MultiLanguageTextarea';
import InputField from '../form/input/InputField';
import { createAgency } from '@/api/agency';
import { validateAgencyForm, AgencyFormData, AgencyFormErrors } from '@/lib/validations';
import { useAlert } from '@/context/AlertContext';
import { AlertMessages, AlertConfigs } from '@/lib/alertMessages';
import { HTTP_CODES } from '@/constants/http-codes';
import { AgencyLanguages } from '@/types/agency';
import { useLanguage } from '@/context/LanguageContext';
import { MultiLanguageValue } from '@/types/language';

export default function CreateAgencyForm() {
  const router = useRouter();
  const { showSuccess, showError } = useAlert();
  const { availableLanguages } = useLanguage();

  const initialMultiLanguageValue = availableLanguages.reduce((acc, language) => {
    acc[language.code] = '';
    return acc;
  }, {} as MultiLanguageValue);

  const [formData, setFormData] = useState<AgencyFormData>({
    name: initialMultiLanguageValue,
    address: initialMultiLanguageValue,
    phone: '',
    email: '',
    open_time: '',
    close_time: '',
    capacity: '',
  });

  const [errors, setErrors] = useState<AgencyFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors = validateAgencyForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof AgencyFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleMultiLanguageChange = (field: 'name' | 'address', value: MultiLanguageValue) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof AgencyFormErrors]) {
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
      const response = await createAgency({
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        open_time: formData.open_time,
        close_time: formData.close_time,
        capacity: parseInt(formData.capacity),
        translations: availableLanguages.reduce((acc, language) => {
          if (formData.name[language.code] && formData.address[language.code]) {
            acc[language.code] = {
              name: formData.name[language.code],
              address: formData.address[language.code],
            };
          }
          return acc;
        }, {} as AgencyLanguages),
      });

      if (response.status === HTTP_CODES.CREATED) {
        showSuccess(
          AlertMessages.SUCCESS.AGENCY_CREATED.title,
          AlertMessages.SUCCESS.AGENCY_CREATED.message,
          AlertConfigs.SUCCESS
        );

        router.push('/agencies');
      } else {
        console.error('Failed to create agency:', response.data);
        showError(
          AlertMessages.ERROR.SAVE_ERROR.title,
          AlertMessages.ERROR.SAVE_ERROR.message,
          AlertConfigs.ERROR
        );
      }
    } catch (error) {
      console.error('Error creating agency:', error);
      showError(
        AlertMessages.ERROR.NETWORK_ERROR.title,
        AlertMessages.ERROR.NETWORK_ERROR.message,
        AlertConfigs.ERROR
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Create New Agency" />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create New Agency
          </h1>
          <Link
            href="/agencies"
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Back to List
          </Link>
        </div>
        
        <ComponentCard title="Agency Information">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Agency Name - Multi Language */}
            <MultiLanguageInput
              label="Agency Name"
              value={formData.name}
              onChange={(value) => handleMultiLanguageChange('name', value)}
              placeholder="Enter agency name"
              required={true}
              error={errors.name}
            />

            {/* Agency Address - Multi Language */}
            <MultiLanguageTextarea
              label="Agency Address"
              value={formData.address}
              onChange={(value) => handleMultiLanguageChange('address', value)}
              placeholder="Enter agency address"
              required={true}
              error={errors.address}
              rows={3}
            />

            {/* Phone and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <InputField
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+8412345678"
                  error={!!errors.phone}
                  hint={errors.phone}
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <InputField
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="agency@example.com"
                  error={!!errors.email}
                  hint={errors.email}
                />
              </div>
            </div>

            {/* Operating Hours Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Open Time */}
              <div>
                <label htmlFor="open_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Open Time <span className="text-red-500">*</span>
                </label>
                <InputField
                  type="time"
                  id="open_time"
                  name="open_time"
                  value={formData.open_time}
                  onChange={handleInputChange}
                  error={!!errors.open_time}
                  hint={errors.open_time}
                />
              </div>

              {/* Close Time */}
              <div>
                <label htmlFor="close_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Close Time <span className="text-red-500">*</span>
                </label>
                <InputField
                  type="time"
                  id="close_time"
                  name="close_time"
                  value={formData.close_time}
                  onChange={handleInputChange}
                  error={!!errors.close_time}
                  hint={errors.close_time}
                />
              </div>
            </div>

            {/* Capacity */}
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Capacity (Number of People) <span className="text-red-500">*</span>
              </label>
              <InputField
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="1"
                placeholder="Enter maximum capacity"
                error={!!errors.capacity}
                hint={errors.capacity}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/agencies"
                className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Creating...' : 'Create Agency'}
              </button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  );
}