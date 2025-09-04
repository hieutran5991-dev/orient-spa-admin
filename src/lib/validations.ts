import { MultiLanguageValue } from '@/types/language';

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation - supports multiple formats
export const validatePhone = (phone: string): boolean => {
  // Allow formats: +1234567890, 123-456-7890, 123.456.7890, 1234567890
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)\.]/g, ''));
};

// Time validation - check if close time is after open time
export const validateTimeRange = (openTime: string, closeTime: string): boolean => {
  if (!openTime || !closeTime) return true; // Let required validation handle empty values
  
  const open = new Date(`2000-01-01T${openTime}`);
  const close = new Date(`2000-01-01T${closeTime}`);
  
  return close > open;
};

// Number validation - check if value is a positive number
export const validatePositiveNumber = (value: string): boolean => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
};

// Required field validation
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateTimeFormat = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

// Agency form validation
export interface AgencyFormData {
  name: MultiLanguageValue;
  address: MultiLanguageValue;
  phone: string;
  email: string;
  open_time: string;
  close_time: string;
  capacity: string;
}

export interface AgencyFormErrors {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  open_time?: string;
  close_time?: string;
  capacity?: string;
}

export const validateAgencyForm = (formData: AgencyFormData): AgencyFormErrors => {
  const errors: AgencyFormErrors = {};

  // Required fields validation
  if (!validateRequired(formData.name.en)) {
    errors.name = 'Agency name is required';
  }

  if (!validateRequired(formData.address.en)) {
    errors.address = 'Address is required';
  }

  if (!validateRequired(formData.phone)) {
    errors.phone = 'Phone number is required';
  } else if (!validatePhone(formData.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!validateRequired(formData.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validateRequired(formData.open_time)) {
    errors.open_time = 'Opening time is required';
  } else if (!validateTimeFormat(formData.open_time)) {
    errors.open_time = 'Please enter a valid time format (HH:MM)';
  }

  if (!validateRequired(formData.close_time)) {
    errors.close_time = 'Closing time is required';
  } else if (!validateTimeFormat(formData.close_time)) {
    errors.close_time = 'Please enter a valid time format (HH:MM)';
  }

  if (!validateRequired(formData.capacity)) {
    errors.capacity = 'Capacity is required';
  } else if (!validatePositiveNumber(formData.capacity)) {
    errors.capacity = 'Capacity must be a positive number';
  }

  // Time validation
  if (formData.open_time && formData.close_time && !validateTimeRange(formData.open_time, formData.close_time)) {
    errors.close_time = 'Close time must be after open time';
  }

  return errors;
};

// Category form validation
export interface CategoryFormData {
  name: MultiLanguageValue;
  description: MultiLanguageValue;
}

export interface CategoryFormErrors {
  name?: string;
  description?: string;
}

export const validateCategoryForm = (formData: CategoryFormData): CategoryFormErrors => {
  const errors: CategoryFormErrors = {};

  if (!validateRequired(formData.name.en)) {
    errors.name = 'Category name is required';
  }

  if (!validateRequired(formData.description.en)) {
    errors.description = 'Category description is required';
  }

  return errors;
};

// Product form validation
export interface ProductFormData {
  name: MultiLanguageValue;
  description: MultiLanguageValue;
  category_id: string;
  duration: string;
  price: MultiLanguageValue;
  currency: MultiLanguageValue;
  is_promoted: boolean;
  promotion_description?: MultiLanguageValue;
  promotion_details?: MultiLanguageValue;
}

export interface ProductFormErrors {
  name?: string;
  description?: string;
  category_id?: string;
  duration?: string;
  price?: string;
  currency?: string;
  promotion_description?: string;
  promotion_details?: string;
}

export const validateProductForm = (formData: ProductFormData): ProductFormErrors => {
  const errors: ProductFormErrors = {};

  if (!validateRequired(formData.name.en)) {
    errors.name = 'Product name is required';
  }

  if (!validateRequired(formData.description.en)) {
    errors.description = 'Product description is required';
  }

  if (!validateRequired(formData.category_id)) {
    errors.category_id = 'Category is required';
  }

  if (!validateRequired(formData.duration)) {
    errors.duration = 'Duration is required';
  } else if (!validatePositiveNumber(formData.duration)) {
    errors.duration = 'Duration must be a positive number';
  } else {
    const duration = parseInt(formData.duration);
    if (duration < 30 || duration > 300) {
      errors.duration = 'Duration must be between 30 and 300 minutes (5 hours)';
    }
  }

  if (!validateRequired(formData.price.en)) {
    errors.price = 'Price is required';
  } else if (!validatePositiveNumber(formData.price.en)) {
    errors.price = 'Price must be a positive number';
  }

  if (!validateRequired(formData.currency.en)) {
    errors.currency = 'Currency is required';
  }

  // Promotion fields validation
  if (formData.is_promoted) {
    if (!validateRequired(formData.promotion_description?.en || '')) {
      errors.promotion_description = 'Promotion description is required when product is promoted';
    }
    if (!validateRequired(formData.promotion_details?.en || '')) {
      errors.promotion_details = 'Promotion details is required when product is promoted';
    }
  }

  return errors;
};