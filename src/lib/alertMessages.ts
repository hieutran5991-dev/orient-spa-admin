// Common alert messages for the system

export type AlertMessage = {
  title: string;
  message: string;
  [key: string]: string | boolean | number | undefined;
};

export const AlertMessages: {
  SUCCESS: {
    [key: string]: AlertMessage;
  },
  ERROR: {
    [key: string]: AlertMessage;
  },
  WARNING: {
    [key: string]: AlertMessage;
  },
} = {
  // Success messages
  SUCCESS: {
    AGENCY_CREATED: {
      title: 'Agency Created Successfully!',
      message: 'The new agency has been created and added to the system.'
    },
    AGENCY_UPDATED: {
      title: 'Agency Updated Successfully!',
      message: 'The agency information has been updated and saved.'
    },
    AGENCY_DELETED: {
      title: 'Agency Deleted Successfully!',
      message: 'The agency has been removed from the system.'
    },
    CATEGORY_CREATED: {
      title: 'Category Created Successfully!',
      message: 'The new category has been created and added to the system.'
    },
    CATEGORY_UPDATED: {
      title: 'Category Updated Successfully!',
      message: 'The category information has been updated and saved.'
    },
    CATEGORY_DELETED: {
      title: 'Category Deleted Successfully!',
      message: 'The category has been removed from the system.'
    },
    PRODUCT_CREATED: {
      title: 'Product Created Successfully!',
      message: 'The new product has been created and added to the system.'
    },
    PRODUCT_UPDATED: {
      title: 'Product Updated Successfully!',
      message: 'The product information has been updated and saved.'
    },
    PRODUCT_DELETED: {
      title: 'Product Deleted Successfully!',
      message: 'The product has been removed from the system.'
    },
    BOOKING_CREATED: {
      title: 'Booking Created Successfully!',
      message: 'The new booking has been created and added to the system.'
    },
    BOOKING_UPDATED: {
      title: 'Booking Updated Successfully!',
      message: 'The booking information has been updated and saved.'
    },
    LOGIN_SUCCESS: {
      title: 'Login Successful!',
      message: 'Welcome back! You have been logged in successfully.'
    },
    SETTINGS_UPDATED: {
      title: 'Settings Updated Successfully!',
      message: 'The settings have been updated and saved.'
    },
  },

  // Error messages
  ERROR: {
    NETWORK_ERROR: {
      title: 'Network Error',
      message: 'An error occurred while connecting to the server. Please check your connection and try again.'
    },
    SERVER_ERROR: {
      title: 'Server Error',
      message: 'An unexpected error occurred on the server. Please try again later.'
    },
    VALIDATION_ERROR: {
      title: 'Validation Error',
      message: 'Please check your input and correct the highlighted errors.'
    },
    NOT_FOUND: {
      title: 'Not Found',
      message: 'The requested resource could not be found. Please check the URL and try again.'
    },
    UNAUTHORIZED: {
      title: 'Unauthorized Access',
      message: 'You do not have permission to perform this action.'
    },
    FORBIDDEN: {
      title: 'Access Denied',
      message: 'You are not allowed to access this resource.'
    },
    AGENCY_NOT_FOUND: {
      title: 'Agency Not Found',
      message: 'The requested agency could not be found. Please check the URL and try again.'
    },
    CATEGORY_NOT_FOUND: {
      title: 'Category Not Found',
      message: 'The requested category could not be found. Please check the URL and try again.'
    },
    PRODUCT_NOT_FOUND: {
      title: 'Product Not Found',
      message: 'The requested product could not be found. Please check the URL and try again.'
    },
    BOOKING_NOT_FOUND: {
      title: 'Booking Not Found',
      message: 'The requested booking could not be found. Please check the URL and try again.'
    },
    LOAD_ERROR: {
      title: 'Load Error',
      message: 'Failed to load data. Please check your connection and try again.'
    },
    SAVE_ERROR: {
      title: 'Save Error',
      message: 'Failed to save data. Please check your input and try again.'
    },
    DELETE_ERROR: {
      title: 'Delete Error',
      message: 'Failed to delete the item. Please try again.'
    },
    LOGIN_ERROR: {
      title: 'Login Failed',
      message: 'Invalid credentials. Please check your email and password and try again.'
    },
    SESSION_EXPIRED: {
      title: 'Session Expired',
      message: 'Your session has expired. Please log in again.'
    },
    SETTINGS_UPDATE_ERROR: {
      title: 'Settings Update Error',
      message: 'Failed to update the settings. Please check your input and try again.'
    },
  },

  // Warning messages
  WARNING: {
    UNSAVED_CHANGES: {
      title: 'Unsaved Changes',
      message: 'You have unsaved changes. Are you sure you want to leave this page?'
    },
    DELETE_CONFIRMATION: {
      title: 'Confirm Deletion',
      message: 'Are you sure you want to delete this item? This action cannot be undone.'
    },
    AGENCY_DELETE_WARNING: {
      title: 'Delete Agency',
      message: 'Are you sure you want to delete this agency? This will also remove all associated bookings.'
    },
    CATEGORY_DELETE_WARNING: {
      title: 'Delete Category',
      message: 'Are you sure you want to delete this category? This will affect all products in this category.'
    },
    PRODUCT_DELETE_WARNING: {
      title: 'Delete Product',
      message: 'Are you sure you want to delete this product? This will affect all future bookings.'
    },
    BOOKING_DELETE_WARNING: {
      title: 'Delete Booking',
      message: 'Are you sure you want to delete this booking? This action cannot be undone.'
    },
    CAPACITY_EXCEEDED: {
      title: 'Capacity Exceeded',
      message: 'The number of people exceeds the agency capacity. Please adjust the booking.'
    },
    TIME_CONFLICT: {
      title: 'Time Conflict',
      message: 'This time slot is already booked. Please choose a different time.'
    },
    SETTINGS_UPDATE_WARNING: {
      title: 'Settings Update Warning',
      message: 'Are you sure you want to update the settings? This action cannot be undone.'
    },
  },
};

// Common alert configurations
export const AlertConfigs = {
  SUCCESS: {
    duration: 5000,
    persistent: false
  },
  ERROR: {
    duration: 0,
    persistent: true
  },
  WARNING: {
    duration: 5000,
    persistent: false
  }
};
