// App Constants and Configuration
export const APP_CONFIG = {
  name: 'NextStop',
  version: '1.0.0',
  supportPhone: '+8801712345678',
  emergencyNumber: '999',
};

// Navigation Constants
export const VIEWS = {
  DASHBOARD: 'dashboard',
  TRACKING: 'tracking',
  ROUTE: 'route',
  PASSENGERS: 'passengers',
  EMERGENCY: 'emergency',
  SCHEDULE: 'schedule',
  COMPLETED: 'completed',
  REGISTRATION: 'registration',
};

// Trip Status Constants
export const TRIP_STATUS = {
  ASSIGNED: 'assigned',
  PICKING_UP: 'picking_up',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Driver Status Constants
export const DRIVER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_DUTY: 'on_duty',
  OFF_DUTY: 'off_duty',
  BREAK: 'break',
};

// Default Values
export const DEFAULTS = {
  CAPACITY: 50,
  ROUTE_UPDATE_INTERVAL: 30000, // 30 seconds
  TRIP_TIMEOUT: 300000, // 5 minutes
};

// Validation Rules
export const VALIDATION = {
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  LICENSE_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  INVALID_LICENSE: 'License number must be at least 8 characters.',
  INVALID_NAME: 'Name must be at least 2 characters.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  TRIP_STARTED: 'Trip started successfully!',
  TRIP_COMPLETED: 'Trip completed successfully!',
  DUTY_STARTED: 'You are now on duty.',
  DUTY_ENDED: 'You are now off duty.',
  PROFILE_UPDATED: 'Profile updated successfully.',
};
