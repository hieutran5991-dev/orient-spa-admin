'use client';

import { useState } from 'react';
import Link from 'next/link';
import PageBreadcrumb from '../common/PageBreadCrumb';
import ComponentCard from '../common/ComponentCard';
import { createProduct, initializeFormData } from '@/api/product';
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
import ImagePreview from '../form/ImagePreview';

export default function CreateProductForm({ categories }: { categories: CategoryOption[] }) {
  const { showSuccess, showError } = useAlert();
  const { availableLanguages } = useLanguage();

  const initialMultiLanguageValue = availableLanguages.reduce((acc, language) => {
    acc[language.code] = '';
    return acc;
  }, {} as MultiLanguageValue);

  const initialPricesValue = {
    VND: '0',
    USD: '0'
  };

  const [formData, setFormData] = useState<ProductFormData>({
    name: initialMultiLanguageValue,
    description: initialMultiLanguageValue,
    category_id: '',
    duration: '',
    prices: initialPricesValue,
    is_featured: false,
    featured_product_description: initialMultiLanguageValue,
    featured_product_detail: initialMultiLanguageValue,
    image: undefined,
  });

  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      // Clear error when user selects a file
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: undefined }));
      }
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: undefined }));
    setSelectedFile(null);
    
    // Clear the file input
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleMultiLanguageChange = (field: 'name' | 'description' | 'featured_product_description' | 'featured_product_detail', value: MultiLanguageValue) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof ProductFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePriceChange = (currency: 'VND' | 'USD', value: string) => {
    setFormData(prev => ({
      ...prev,
      prices: {
        ...prev.prices,
        [currency]: value
      }
    }));
    
    // Clear error when user starts typing
    if (errors.prices?.[currency]) {
      setErrors(prev => ({
        ...prev,
        prices: {
          ...prev.prices,
          [currency]: undefined
        }
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submitData = initializeFormData(formData, availableLanguages);

      const response = await createProduct(submitData);

      if (response.status === HTTP_CODES.CREATED) {
        showSuccess(
          AlertMessages.SUCCESS.PRODUCT_CREATED.title,
          AlertMessages.SUCCESS.PRODUCT_CREATED.message,
          AlertConfigs.SUCCESS
        );
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

            {/* Price Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* VND Price Field */}
              <div>
                <label htmlFor="price_vnd" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price (VND) <span className="text-red-500">*</span>
                </label>
                <InputField
                  type="number"
                  id="price_vnd"
                  name="price_vnd"
                  value={formData.prices.VND}
                  onChange={(e) => handlePriceChange('VND', e.target.value)}
                  placeholder="Enter price in VND"
                  error={!!errors.prices?.VND}
                  hint={errors.prices?.VND || "Enter price in Vietnamese Dong"}
                />
              </div>

              {/* USD Price Field */}
              <div>
                <label htmlFor="price_usd" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price (USD) <span className="text-red-500">*</span>
                </label>
                <InputField
                  type="number"
                  id="price_usd"
                  name="price_usd"
                  value={formData.prices.USD}
                  onChange={(e) => handlePriceChange('USD', e.target.value)}
                  placeholder="Enter price in USD"
                  error={!!errors.prices?.USD}
                  hint={errors.prices?.USD || "Enter price in US Dollar"}
                  step={0.01}
                />
              </div>
            </div>

            {/* Image Upload Field */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Image
              </label>
              <FileInput
                id="image"
                onChange={handleImageChange}
                className={errors.image ? 'border-red-500 dark:border-red-400' : ''}
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Supported formats: JPEG, PNG, GIF, WebP. Maximum size: 5MB
              </p>
              {errors.image && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.image}</p>
              )}
              
              {/* Enhanced Image Preview */}
              {selectedFile && (
                <div className="mt-4">
                  <ImagePreview
                    imageUrl={selectedFile ? URL.createObjectURL(selectedFile) : ''}
                    fileName={selectedFile?.name}
                    fileSize={selectedFile?.size}
                    isNewImage={true}
                    onRemove={handleRemoveImage}
                  />
                </div>
              )}
            </div>

            {/* Is Featured Field */}
            <div className="flex items-center">
              <Checkbox
                id="is_featured"
                checked={formData.is_featured}
                onChange={(checked) => {
                  setFormData(prev => ({ ...prev, is_featured: checked }));
                }}
              />
              <label htmlFor="is_featured" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Feature this product
              </label>
            </div>

            {/* Featured Product Description Field */}
            {formData.is_featured && (
              <MultiLanguageTextarea
                label="Featured Product Description"
                value={formData.featured_product_description || initialMultiLanguageValue}
                onChange={(value) => handleMultiLanguageChange('featured_product_description', value)}
                placeholder="Enter featured product description"
                required={true}
                error={errors.featured_product_description}
                rows={3}
              />
            )}

            {/* Featured Product Detail Field */}
            {formData.is_featured && (
              <MultiLanguageTextarea
                label="Featured Product Detail"
                value={formData.featured_product_detail || initialMultiLanguageValue}
                onChange={(value) => handleMultiLanguageChange('featured_product_detail', value)}
                placeholder="Enter featured product detail"
                required={true}
                error={errors.featured_product_detail}
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