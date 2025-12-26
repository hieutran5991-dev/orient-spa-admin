/**
 * Permission Constants
 * These match the permission slugs from the backend
 */

// Permission slugs for different actions
export const PERMISSIONS = {
  // Agency permissions
  AGENCY_VIEW: 'agency.view',
  AGENCY_CREATE: 'agency.create',
  AGENCY_UPDATE: 'agency.update',
  AGENCY_DELETE: 'agency.delete',

  // Category permissions
  CATEGORY_VIEW: 'category.view',
  CATEGORY_CREATE: 'category.create',
  CATEGORY_UPDATE: 'category.update',
  CATEGORY_DELETE: 'category.delete',

  // Product permissions
  PRODUCT_VIEW: 'product.view',
  PRODUCT_CREATE: 'product.create',
  PRODUCT_UPDATE: 'product.update',
  PRODUCT_DELETE: 'product.delete',

  // Booking permissions
  BOOKING_VIEW: 'booking.view',
  BOOKING_UPDATE: 'booking.update',
  BOOKING_DELETE: 'booking.delete',

  // Setting permissions
  SETTING_VIEW: 'setting.view',
  SETTING_UPDATE: 'setting.update',

  // Report permissions
  REPORT_VIEW: 'report.view',

  // User & Permission management (admin only)
  USER_VIEW: 'user.view',
  USER_UPDATE: 'user.update',
  PERMISSION_VIEW: 'permission.view',
  PERMISSION_MANAGE: 'permission.manage',
} as const;

// Permission type
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Menu item permission mapping
export const MENU_PERMISSIONS = {
  '/dashboard': PERMISSIONS.REPORT_VIEW,
  '/users': PERMISSIONS.USER_VIEW,
  '/agencies': PERMISSIONS.AGENCY_VIEW,
  '/categories': PERMISSIONS.CATEGORY_VIEW,
  '/products': PERMISSIONS.PRODUCT_VIEW,
  '/bookings': PERMISSIONS.BOOKING_VIEW,
  '/settings': PERMISSIONS.SETTING_VIEW,
} as const;

