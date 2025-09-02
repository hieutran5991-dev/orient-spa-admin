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
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

// Required field validation
export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// Agency form validation
export interface AgencyFormData {
  name: string;
  address: string;
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

  // Required field validation
  if (!validateRequired(formData.name)) {
    errors.name = 'Agency name is required';
  }

  if (!validateRequired(formData.address)) {
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
    errors.open_time = 'Open time is required';
  }

  if (!validateRequired(formData.close_time)) {
    errors.close_time = 'Close time is required';
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
  name: string;
  description: string;
}

export interface CategoryFormErrors {
  name?: string;
  description?: string;
}

export const validateCategoryForm = (formData: CategoryFormData): CategoryFormErrors => {
  const errors: CategoryFormErrors = {};

  if (!validateRequired(formData.name)) {
    errors.name = 'Category name is required';
  }

  return errors;
};

// Product form validation
export interface ProductFormData {
  name: string;
  description: string;
  category_id: string;
  duration: string;
  price: string;
  currency: string;
  is_promoted: boolean;
  promotion_description?: string;
  promotion_details?: string;
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

  if (!validateRequired(formData.name)) {
    errors.name = 'Product name is required';
  }

  if (!validateRequired(formData.description)) {
    errors.description = 'Description is required';
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

  if (!validateRequired(formData.price)) {
    errors.price = 'Price is required';
  } else if (!validatePositiveNumber(formData.price)) {
    errors.price = 'Price must be a positive number';
  }

  if (!validateRequired(formData.currency)) {
    errors.currency = 'Currency is required';
  }

  // Promotion fields validation
  if (formData.is_promoted) {
    if (!validateRequired(formData.promotion_description || '')) {
      errors.promotion_description = 'Promotion description is required when product is promoted';
    }
    if (!validateRequired(formData.promotion_details || '')) {
      errors.promotion_details = 'Promotion details is required when product is promoted';
    }
  }

  return errors;
};

// Booking form validation
export interface BookingFormData {
  agency_id: string;
  booking_date: string;
  booking_time: string;
  number_of_people: string;
  booking_details: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  note?: string;
  total_price: string;
  currency: string;
  status: string;
}

export interface BookingFormErrors {
  agency_id?: string;
  booking_date?: string;
  booking_time?: string;
  number_of_people?: string;
  booking_details?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  total_price?: string;
  currency?: string;
  status?: string;
}

export const validateBookingForm = (formData: BookingFormData): BookingFormErrors => {
  const errors: BookingFormErrors = {};

  if (!validateRequired(formData.agency_id)) {
    errors.agency_id = 'Agency is required';
  }

  if (!validateRequired(formData.booking_date)) {
    errors.booking_date = 'Booking date is required';
  }

  if (!validateRequired(formData.booking_time)) {
    errors.booking_time = 'Booking time is required';
  }

  if (!validateRequired(formData.number_of_people)) {
    errors.number_of_people = 'Number of people is required';
  } else if (!validatePositiveNumber(formData.number_of_people)) {
    errors.number_of_people = 'Number of people must be a positive number';
  }

  if (!validateRequired(formData.booking_details)) {
    errors.booking_details = 'Booking details is required';
  }

  if (!validateRequired(formData.first_name)) {
    errors.first_name = 'First name is required';
  }

  if (!validateRequired(formData.last_name)) {
    errors.last_name = 'Last name is required';
  }

  if (!validateRequired(formData.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validateRequired(formData.phone)) {
    errors.phone = 'Phone number is required';
  } else if (!validatePhone(formData.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (!validateRequired(formData.total_price)) {
    errors.total_price = 'Total price is required';
  } else if (!validatePositiveNumber(formData.total_price)) {
    errors.total_price = 'Total price must be a positive number';
  }

  if (!validateRequired(formData.currency)) {
    errors.currency = 'Currency is required';
  }

  if (!validateRequired(formData.status)) {
    errors.status = 'Status is required';
  }

  return errors;
};
