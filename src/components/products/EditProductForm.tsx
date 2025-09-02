'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import PageBreadcrumb from '../common/PageBreadCrumb';
import ComponentCard from '../common/ComponentCard';
import { getProduct, updateProduct } from '@/api/product';
import { Product } from '@/types/product';
import { CategoryOption } from '@/types/category';
import { validateProductForm, ProductFormData, ProductFormErrors } from '@/lib/validations';
import { useAlert } from '@/context/AlertContext';
import { AlertMessages, AlertConfigs } from '@/lib/alertMessages';
import { HTTP_CODES } from '@/constants/http-codes';

export default function EditProductForm({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter();
  const params = useParams();

  const productId = params.id as string;
  const { showSuccess, showError } = useAlert();

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category_id: '',
    duration: '',
    price: '',
    currency: 'VND',
    is_promoted: false,
    promotion_description: '',
    promotion_details: '',
  });

  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

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
            name: productData.name || '',
            description: productData.description || '',
            category_id: productData.category_id?.toString() || '',
            duration: productData.duration?.toString() || '',
            price: productData.price?.toString() || '',
            currency: productData.currency || 'VND',
            is_promoted: productData.is_promoted || false,
            promotion_description: productData.promotion_description || '',
            promotion_details: productData.promotion_details || '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submitData = {
        id: parseInt(productId),
        name: formData.name.trim(),
        description: formData.description.trim(),
        category_id: parseInt(formData.category_id),
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
        currency: formData.currency,
        is_promoted: formData.is_promoted,
        ...(formData.is_promoted && {
          promotion_description: formData.promotion_description?.trim() || '',
          promotion_details: formData.promotion_details?.trim() || '',
        }),
      };

      const response = await updateProduct(parseInt(productId), submitData);

      if (response.status === HTTP_CODES.SUCCESS) {
        showSuccess(
          AlertMessages.SUCCESS.PRODUCT_UPDATED.title,
          AlertMessages.SUCCESS.PRODUCT_UPDATED.message,
          AlertConfigs.SUCCESS
        );
        router.push('/products');
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
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                  errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter product name"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                  errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter product description"
                required
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Category Field */}
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
                disabled={categories.length === 0}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                  errors.category_id ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                } ${categories.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category_id && (
                <p className="mt-1 text-sm text-red-500">{errors.category_id}</p>
              )}
            </div>

            {/* Duration Field */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration (minutes) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="30"
                max="300"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                  errors.duration ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter duration in minutes (30-300)"
                required
              />
              <p className="mt-1 text-sm text-gray-500">Minimum: 30 minutes, Maximum: 300 minutes (5 hours)</p>
              {errors.duration && (
                <p className="mt-1 text-sm text-red-500">{errors.duration}</p>
              )}
            </div>

            {/* Price Field */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className={`flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                    errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter price"
                  required
                />
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {/* <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option> */}
                  <option value="VND">VND</option>
                </select>
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">{errors.price}</p>
              )}
            </div>

            {/* Is Promoted Field */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_promoted"
                name="is_promoted"
                checked={formData.is_promoted}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="is_promoted" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Promote this product
              </label>
            </div>

            {/* Promotion Description Field */}
            {(formData.is_promoted || formData.promotion_description) && (
              <div>
                <label htmlFor="promotion_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Promotion Description {formData.is_promoted && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  id="promotion_description"
                  name="promotion_description"
                  value={formData.promotion_description}
                  onChange={handleInputChange}
                  rows={3}
                  disabled={!formData.is_promoted}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                    errors.promotion_description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                  } ${!formData.is_promoted ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Enter promotion description"
                  required={formData.is_promoted}
                />
                {!formData.is_promoted && formData.promotion_description && (
                  <p className="mt-1 text-sm text-gray-500">This field is disabled because promotion is turned off</p>
                )}
                {errors.promotion_description && (
                  <p className="mt-1 text-sm text-red-500">{errors.promotion_description}</p>
                )}
              </div>
            )}

            {/* Promotion Details Field */}
            {(formData.is_promoted || formData.promotion_details) && (
              <div>
                <label htmlFor="promotion_details" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Promotion Details {formData.is_promoted && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  id="promotion_details"
                  name="promotion_details"
                  value={formData.promotion_details}
                  onChange={handleInputChange}
                  rows={3}
                  disabled={!formData.is_promoted}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
                    errors.promotion_details ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                  } ${!formData.is_promoted ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Enter promotion details"
                  required={formData.is_promoted}
                />
                {!formData.is_promoted && formData.promotion_details && (
                  <p className="mt-1 text-sm text-gray-500">This field is disabled because promotion is turned off</p>
                )}
                {errors.promotion_details && (
                  <p className="mt-1 text-sm text-red-500">{errors.promotion_details}</p>
                )}
              </div>
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
