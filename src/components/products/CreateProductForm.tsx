'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PageBreadcrumb from '../common/PageBreadCrumb';
import ComponentCard from '../common/ComponentCard';
import { createProduct, initialFormData } from '@/api/product';
import { validateProductForm, ProductFormData, ProductFormErrors } from '@/lib/validations';
import { useAlert } from '@/context/AlertContext';
import { AlertMessages, AlertConfigs } from '@/lib/alertMessages';
import { HTTP_CODES } from '@/constants/http-codes';
import { CategoryOption } from '@/types/category';
import { MultiLanguageInput } from '../form/MultiLanguageInput';
import { MultiLanguageTextarea } from '../form/MultiLanguageTextarea';
import { MultiLanguageValue } from '@/types/language';
import { useLanguage } from '@/context/LanguageContext';
import InputField from '../form/input/InputField';
import Select from '../form/Select';
import FileInput from '../form/input/FileInput';
import Checkbox from '../form/input/Checkbox';

export default function CreateProductForm({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter();
  const { showSuccess, showError } = useAlert();
  const { availableLanguages } = useLanguage();

  const initialMultiLanguageValue = availableLanguages.reduce((acc, language) => {
    acc[language.code] = '';
    return acc;
  }, {} as MultiLanguageValue);

  const initialPriceValue = availableLanguages.reduce((acc, language) => {
    acc[language.code] = '0';
    return acc;
  }, {} as MultiLanguageValue);

  const initialCurrencyValue = availableLanguages.reduce((acc, language) => {
    acc[language.code] = 'VND';
    return acc;
  }, {} as MultiLanguageValue);

  const [formData, setFormData] = useState<ProductFormData>({
    name: initialMultiLanguageValue,
    description: initialMultiLanguageValue,
    category_id: '',
    duration: '',
    price: initialPriceValue,
    currency: initialCurrencyValue,
    is_promoted: false,
    promotion_description: initialMultiLanguageValue,
    promotion_details: initialMultiLanguageValue,
    image: undefined,
  });

  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors = validateProductForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name as keyof ProductFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear error when user selects a file
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: undefined }));
      }
    }
  };

  const handleMultiLanguageChange = (field: 'name' | 'description' | 'price' | 'currency' | 'promotion_description' | 'promotion_details', value: MultiLanguageValue) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof ProductFormErrors]) {
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
      const submitData = initialFormData(formData, availableLanguages);

      const response = await createProduct(submitData);

      if (response.status === HTTP_CODES.CREATED) {
        showSuccess(
          AlertMessages.SUCCESS.PRODUCT_CREATED.title,
          AlertMessages.SUCCESS.PRODUCT_CREATED.message,
          AlertConfigs.SUCCESS
        );
        router.push('/products');
      } else {
        showError(
          AlertMessages.ERROR.SAVE_ERROR.title,
          AlertMessages.ERROR.SAVE_ERROR.message,
          AlertConfigs.ERROR
        );
      }
    } catch (error) {
      console.error('Error creating product:', error);
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
      <PageBreadcrumb pageTitle="Create New Product" />
      
      <div className="space-y-6">
        <ComponentCard title="Product Information">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <MultiLanguageInput
              label="Product Name"
              value={formData.name}
              onChange={(value) => handleMultiLanguageChange('name', value)}
              placeholder="Enter product name"
              required={true}
              error={errors.name}
            />

            {/* Description Field */}
            <MultiLanguageTextarea
              label="Product Description"
              value={formData.description}
              onChange={(value) => handleMultiLanguageChange('description', value)}
              placeholder="Enter product description"
              required={true}
              error={errors.description}
              rows={4}
            />

            {/* Category Field */}
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <Select
                options={categories.map(category => ({
                  value: category.id.toString(),
                  label: category.name
                }))}
                placeholder="Select a category"
                value={formData.category_id}
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, category_id: value }));
                  if (errors.category_id) {
                    setErrors(prev => ({ ...prev, category_id: undefined }));
                  }
                }}
                className={errors.category_id ? 'border-red-500' : ''}
              />
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-500">{errors.category_id}</p>
              )}
            </div>

            {/* Duration Field */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration (minutes) <span className="text-red-500">*</span>
              </label>
              <InputField
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="30"
                max="300"
                placeholder="Enter duration in minutes (30-300)"
                error={!!errors.duration}
                hint={errors.duration || "Minimum: 30 minutes, Maximum: 300 minutes (5 hours)"}
              />
            </div>

            {/* Price Field */}
            <MultiLanguageInput
                label="Price"
                value={formData.price}
                onChange={(value) => handleMultiLanguageChange('price', value)}
                placeholder="Enter price"
                required={true}
                error={errors.price}
                type="number"
              />

            {/* Currency Field */}
            <MultiLanguageInput
                label="Currency"
                value={formData.currency}
                onChange={(value) => handleMultiLanguageChange('currency', value)}
                placeholder="Enter currency"
                required={true}
                error={errors.currency}
              />

            {/* Image Upload Field */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Image
              </label>
              <FileInput
                onChange={handleImageChange}
                className={errors.image ? 'border-red-500 dark:border-red-400' : ''}
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Supported formats: JPEG, PNG, GIF, WebP. Maximum size: 5MB
              </p>
              {errors.image && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.image}</p>
              )}
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</p>
                  <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Product preview"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Is Promoted Field */}
            <div className="flex items-center">
              <Checkbox
                id="is_promoted"
                checked={formData.is_promoted}
                onChange={(checked) => {
                  setFormData(prev => ({ ...prev, is_promoted: checked }));
                }}
              />
              <label htmlFor="is_promoted" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Promote this product
              </label>
            </div>

            {/* Promotion Description Field */}
            {formData.is_promoted && (
              <MultiLanguageTextarea
                label="Promotion Description"
                value={formData.promotion_description || initialMultiLanguageValue}
                onChange={(value) => handleMultiLanguageChange('promotion_description', value)}
                placeholder="Enter promotion description"
                required={true}
                error={errors.promotion_description}
                rows={3}
              />
            )}

            {/* Promotion Details Field */}
            {formData.is_promoted && (
              <MultiLanguageTextarea
                label="Promotion Details"
                value={formData.promotion_details || initialMultiLanguageValue}
                onChange={(value) => handleMultiLanguageChange('promotion_details', value)}
                placeholder="Enter promotion details"
                required={true}
                error={errors.promotion_details}
                rows={3}
              />
            )}

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/products"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Back to List
              </Link>
              
              <button
                type="submit"
                disabled={isSubmitting || categories.length === 0}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating...' : 'Create Product'}
              </button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  );
}