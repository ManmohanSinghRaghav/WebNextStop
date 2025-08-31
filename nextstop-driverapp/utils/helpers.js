import { Alert } from 'react-native';
import { ERROR_MESSAGES, VALIDATION } from './constants';

// Time formatting utilities
export const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const formatDate = (date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date) => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

// Validation functions
export const validatePhone = (phone) => {
  return VALIDATION.PHONE_REGEX.test(phone);
};

export const validateLicense = (license) => {
  return license && license.length >= VALIDATION.LICENSE_MIN_LENGTH;
};

export const validateName = (name) => {
  return name && name.trim().length >= VALIDATION.NAME_MIN_LENGTH;
};

// Error handling utilities
export const showErrorAlert = (title, message = ERROR_MESSAGES.GENERIC_ERROR) => {
  Alert.alert(title, message, [{ text: 'OK' }]);
};

export const showSuccessAlert = (title, message) => {
  Alert.alert(title, message, [{ text: 'OK' }]);
};

export const showConfirmAlert = (title, message, onConfirm, onCancel) => {
  Alert.alert(
    title,
    message,
    [
      { text: 'Cancel', style: 'cancel', onPress: onCancel },
      { text: 'Confirm', onPress: onConfirm }
    ]
  );
};

// Loading state management
export const withLoading = async (asyncFunction, setLoading) => {
  try {
    setLoading(true);
    const result = await asyncFunction();
    return result;
  } catch (error) {
    throw error;
  } finally {
    setLoading(false);
  }
};

// Route calculation utilities
export const calculateRouteProgress = (completedStops, totalStops) => {
  return Math.round((completedStops / totalStops) * 100);
};

export const calculateOccupancyPercentage = (current, capacity) => {
  return Math.round((current / capacity) * 100);
};

export const getOccupancyStatus = (percentage) => {
  if (percentage >= 90) return 'critical';
  if (percentage >= 75) return 'high';
  if (percentage >= 50) return 'medium';
  return 'low';
};

// Distance and time utilities
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(2)}km`;
};

export const estimateArrivalTime = (distance, averageSpeed = 30) => {
  const hours = distance / averageSpeed;
  const minutes = Math.round(hours * 60);
  
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

// Data generation utilities (for demo purposes)
export const generateMockTrip = () => {
  const trips = [
    {
      id: `NS-${Date.now()}`,
      passengerName: 'Ahmed Hassan',
      pickupLocation: 'Central Station',
      dropLocation: 'Airport Terminal',
      distance: '12.5 Km',
      estimatedTime: '25 mins',
      fare: '$3.50',
    },
    {
      id: `NS-${Date.now() + 1}`,
      passengerName: 'Fatima Ali',
      pickupLocation: 'Shopping Mall',
      dropLocation: 'University Campus',
      distance: '8.2 Km',
      estimatedTime: '15 mins',
      fare: '$2.25',
    },
  ];
  
  return trips[Math.floor(Math.random() * trips.length)];
};

// Performance utilities
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
