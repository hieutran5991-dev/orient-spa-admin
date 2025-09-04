'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import PageBreadcrumb from '../common/PageBreadCrumb';
import ComponentCard from '../common/ComponentCard';
import { MultiLanguageInput } from '../form/MultiLanguageInput';
import { MultiLanguageTextarea } from '../form/MultiLanguageTextarea';
import { getAgency, updateAgency } from '@/api/agency';
import { Agency, AgencyLanguages } from '@/types/agency';
import { validateAgencyForm, AgencyFormData, AgencyFormErrors } from '@/lib/validations';
import { useAlert } from '@/context/AlertContext';
import { AlertMessages, AlertConfigs } from '@/lib/alertMessages';
import { HTTP_CODES } from '@/constants/http-codes';
import { useLanguage } from '@/context/LanguageContext';
import { MultiLanguageValue } from '@/types/language';

export default function EditAgencyForm() {
  const router = useRouter();
  const params = useParams();
  const agencyId = params.id as string;
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
  const [isLoading, setIsLoading] = useState(true);
  const [agency, setAgency] = useState<Agency | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Fetch agency data on component mount
  useEffect(() => {
    const fetchAgency = async () => {
      try {
        setIsLoading(true);
        const response = await getAgency(parseInt(agencyId));
        
        // Handle different response structures
        let agencyData: Agency | null = null;
        
        if (response.status === HTTP_CODES.SUCCESS) {
          // If response is directly the agency object
          agencyData = response.data.data;
        }
        
        if (agencyData) {
          setAgency(agencyData);
          
          // Populate form with existing data
          setFormData({
            name: agencyData.translations.reduce((acc, translation) => {
              acc[translation.language_code] = translation.name;
              return acc;
            }, {} as MultiLanguageValue),
            address: agencyData.translations.reduce((acc, translation) => {
              acc[translation.language_code] = translation.address;
              return acc;
            }, {} as MultiLanguageValue),
            phone: agencyData.phone || '',
            email: agencyData.email || '',
            open_time: agencyData.open_time || '',
            close_time: agencyData.close_time || '',
            capacity: agencyData.capacity?.toString() || '',
          });
        } else {
          setLoadError('Agency not found');
          showError(
            AlertMessages.ERROR.AGENCY_NOT_FOUND.title,
            AlertMessages.ERROR.AGENCY_NOT_FOUND.message,
            AlertConfigs.ERROR
          );
        }
      } catch (error) {
        console.error('Error fetching agency:', error);
        setLoadError('Failed to load agency data');
        showError(
          AlertMessages.ERROR.LOAD_ERROR.title,
          AlertMessages.ERROR.LOAD_ERROR.message,
          AlertConfigs.ERROR
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (agencyId) {
      fetchAgency();
    }
  }, [agencyId, showError]);

  const validateForm = (): boolean => {
    const newErrors = validateAgencyForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      const response = await updateAgency(parseInt(agencyId), {
        id: parseInt(agencyId),
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

      if (response.status === HTTP_CODES.SUCCESS) {
        showSuccess(
          AlertMessages.SUCCESS.AGENCY_UPDATED.title,
          AlertMessages.SUCCESS.AGENCY_UPDATED.message,
          AlertConfigs.SUCCESS
        );

        router.push('/agencies');
      } else {
        console.error('Failed to update agency:', response.data);
        showError(
          AlertMessages.ERROR.SAVE_ERROR.title,
          AlertMessages.ERROR.SAVE_ERROR.message,
          AlertConfigs.ERROR
        );
      }
    } catch (error) {
      console.error('Error updating agency:', error);
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
        <PageBreadcrumb pageTitle="Edit Agency" />
        <div className="space-y-6">
          <ComponentCard title="Loading Agency Data">
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading agency information...</p>
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
        <PageBreadcrumb pageTitle="Edit Agency" />
        <div className="space-y-6">
          <ComponentCard title="Error">
            <div className="p-6 text-center">
              <p className="text-red-600 mb-4">{loadError}</p>
              <Link
                href="/agencies"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Agencies List
              </Link>
            </div>
          </ComponentCard>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle={`Edit Agency: ${agency?.name || 'Loading...'}`} />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Agency: {agency?.name || 'Loading...'}
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
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                  placeholder="+1234567890"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                  placeholder="agency@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Operating Hours Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Open Time */}
              <div>
                <label htmlFor="open_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Open Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="open_time"
                  name="open_time"
                  value={formData.open_time}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.open_time ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                />
                {errors.open_time && (
                  <p className="mt-1 text-sm text-red-600">{errors.open_time}</p>
                )}
              </div>

              {/* Close Time */}
              <div>
                <label htmlFor="close_time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Close Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="close_time"
                  name="close_time"
                  value={formData.close_time}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.close_time ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                />
                {errors.close_time && (
                  <p className="mt-1 text-sm text-red-600">{errors.close_time}</p>
                )}
              </div>
            </div>

            {/* Capacity */}
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Capacity (Number of People) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.capacity ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-800 text-gray-900 dark:text-white`}
                placeholder="Enter maximum capacity"
              />
              {errors.capacity && (
                <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
              )}
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
                {isSubmitting ? 'Updating...' : 'Update Agency'}
              </button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  );
}
