/**
 * User Role Constants
 */

// User Role Values
export const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
} as const;

// User Role Type
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// User Role Configuration
export const USER_ROLE_CONFIG = {
  [USER_ROLES.ADMIN]: {
    text: 'Admin',
    class: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700',
    color: 'purple',
  },
  [USER_ROLES.STAFF]: {
    text: 'Staff',
    class: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700',
    color: 'blue',
  },
} as const;

// Helper Functions
export const getUserRoleConfig = (role: UserRole) => {
  return USER_ROLE_CONFIG[role] || USER_ROLE_CONFIG[USER_ROLES.STAFF];
};

// Role Labels for Forms/UI
export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Admin',
  [USER_ROLES.STAFF]: 'Staff',
} as const;

export const USER_ROLE_OPTIONS = [
  { value: USER_ROLES.ADMIN, label: USER_ROLE_LABELS[USER_ROLES.ADMIN] },
  { value: USER_ROLES.STAFF, label: USER_ROLE_LABELS[USER_ROLES.STAFF] },
];

