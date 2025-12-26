'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageBreadcrumb from '../common/PageBreadCrumb';
import ComponentCard from '../common/ComponentCard';
import { getProduct, initializeFormData, updateProduct } from '@/api/product';
import { Product } from '@/types/product';
import { CategoryOption } from '@/types/category';
import { validateProductForm, ProductFormData, ProductFormErrors } from '@/lib/validations';
import { useAlert } from '@/context/AlertContext';
import { AlertMessages, AlertConfigs } from '@/lib/alertMessages';
import { HTTP_CODES } from '@/constants/http-codes';
import { getErrorMessage, getErrorTitle, isPermissionError } from '@/lib/errorHandler';
import { MultiLanguageInput } from '../form/MultiLanguageInput';
import { MultiLanguageTextarea } from '../form/MultiLanguageTextarea';
import { MultiLanguageValue } from '@/types/language';
import { useLanguage } from '@/context/LanguageContext';
import InputField from '../form/input/InputField';
import Select from '../form/Select';
import FileInput from '../form/input/FileInput';
import Checkbox from '../form/input/Checkbox';
import ImagePreview from '../form/ImagePreview';

export default function EditProductForm({ categories }: { categories: CategoryOption[] }) {
  const params = useParams();
  const productId = params.id as string;
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
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch product data on component mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await getProduct(parseInt(productId));
        
        if (response.status === HTTP_CODES.SUCCESS) {
          const productData = response.data.data;
          setProduct(productData);
          
          setFormData({
            name: productData.translations.reduce((acc, translation) => {
              acc[translation.language_code] = translation.name;
              return acc;
            }, {} as MultiLanguageValue),
            description: productData.translations.reduce((acc, translation) => {
              acc[translation.language_code] = translation.description;
              return acc;
            }, {} as MultiLanguageValue),
            category_id: productData.category_id?.toString() || '',
            duration: productData.duration?.toString() || '',
            prices: {
              VND: productData.prices?.VND?.toString() || '0',
              USD: productData.prices?.USD?.toString() || '0'
            },
            is_featured: productData.is_featured || false,
            featured_product_description: productData.translations.reduce((acc, translation) => {
              acc[translation.language_code] = translation.featured_product_description || '';
              return acc;
            }, {} as MultiLanguageValue),
            featured_product_detail: productData.translations.reduce((acc, translation) => {
              acc[translation.language_code] = translation.featured_product_detail || '';
              return acc;
            }, {} as MultiLanguageValue),
            image: undefined, // New image file (if user selects one)
          });
        } else {
          setLoadError('Product not found');
          showError(
            AlertMessages.ERROR.PRODUCT_NOT_FOUND.title,
            AlertMessages.ERROR.PRODUCT_NOT_FOUND.message,
            AlertConfigs.ERROR
          );
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoadError('Failed to load product data');
        showError(
          AlertMessages.ERROR.LOAD_ERROR.title,
          AlertMessages.ERROR.LOAD_ERROR.message,
          AlertConfigs.ERROR
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, showError]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submitData = initializeFormData(formData, availableLanguages);
      submitData.append('id', productId);

      const response = await updateProduct(parseInt(productId), submitData);

      if (response.status === HTTP_CODES.SUCCESS) {
        showSuccess(
          AlertMessages.SUCCESS.PRODUCT_UPDATED.title,
          AlertMessages.SUCCESS.PRODUCT_UPDATED.message,
          AlertConfigs.SUCCESS
        );
      } else {
        console.error('Failed to update product:', response.data);
        showError(
          AlertMessages.ERROR.SAVE_ERROR.title,
          AlertMessages.ERROR.SAVE_ERROR.message,
          AlertConfigs.ERROR
        );
      }
    } catch (error) {
      console.error('Error updating product:', error);
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

  // Loading state
  if (isLoading) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Edit Product" />
        <div className="space-y-6">
          <ComponentCard title="Loading Product">
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading product data...</span>
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
        <PageBreadcrumb pageTitle="Edit Product" />
        <div className="space-y-6">
          <ComponentCard title="Error Loading Product">
            <div className="p-6 text-center">
              <p className="text-red-500 mb-4">{loadError}</p>
              <Link
                href="/products"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
              >
                Back to Products
              </Link>
            </div>
          </ComponentCard>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle={`Edit Product: ${product?.name || 'Loading...'}`} />
      
      <div className="space-y-6">
        <ComponentCard title="Edit Product Information">
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
                className={errors.category_id ? 'border-red-500 dark:border-red-400' : ''}
              />
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.category_id}</p>
              )}
            </div>

            {/* Duration Field */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration (minutes) <span className="text-red-500 dark:text-red-400">*</span>
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
                {selectedFile 
                  ? "Select a new image to replace the current one. Supported formats: JPEG, PNG, GIF, WebP. Maximum size: 5MB"
                  : "Supported formats: JPEG, PNG, GIF, WebP. Maximum size: 5MB"
                }
              </p>
              {errors.image && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.image}</p>
              )}
              
              {/* Enhanced Image Preview */}
              {(selectedFile || product?.image_url) && (
                <div className="mt-4">
                  <ImagePreview
                    imageUrl={selectedFile ? URL.createObjectURL(selectedFile) : product?.image_url || ''}
                    fileName={selectedFile?.name}
                    fileSize={selectedFile?.size}
                    isNewImage={!!formData.image}
                    onRemove={formData.image ? handleRemoveImage : undefined}
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
            {(formData.is_featured || Object.values(formData.featured_product_description || {}).some(value => value !== '')) && (
              <MultiLanguageTextarea
                label="Featured Product Description"
                value={formData.featured_product_description || initialMultiLanguageValue}
                onChange={(value) => handleMultiLanguageChange('featured_product_description', value)}
                placeholder="Enter featured product description"
                required={formData.is_featured}
                error={errors.featured_product_description}
                rows={3}
              />
            )}

            {/* Featured Product Detail Field */}
            {(formData.is_featured || Object.values(formData.featured_product_detail || {}).some(value => value !== '')) && (
              <MultiLanguageTextarea
                label="Featured Product Detail"
                value={formData.featured_product_detail || initialMultiLanguageValue}
                onChange={(value) => handleMultiLanguageChange('featured_product_detail', value)}
                placeholder="Enter featured product detail"
                required={formData.is_featured}
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
                {isSubmitting ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </div>
  );
}