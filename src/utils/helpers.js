import { format, parseISO, isValid } from 'date-fns';

// Currency formatting
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount == null || isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
};

// Date formatting (display)
export const formatDate = (date, pattern = 'MMM dd, yyyy') => {
  if (!date) return '';
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsed) ? format(parsed, pattern) : '';
  } catch {
    return '';
  }
};

// Date formatting (input value)
export const formatDateForInput = (date) => {
  if (!date) return '';
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsed) ? format(parsed, 'yyyy-MM-dd') : '';
  } catch {
    return '';
  }
};

// Debounce
export const debounce = (fn, wait) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
};

// Throttle
export const throttle = (fn, limit) => {
  let inThrottle = false;
  return function (...args) {
    if (inThrottle) return;
    fn.apply(this, args);
    inThrottle = true;
    setTimeout(() => (inThrottle = false), limit);
  };
};

// Percentage calculation
export const calculatePercentage = (part, total) => {
  if (!total) return 0;
  return Math.round((part / total) * 100);
};

// Random color picker
export const generateRandomColor = () => {
  const colors = [
    '#EF4444', '#3B82F6', '#8B5CF6', '#F59E0B', '#10B981',
    '#EC4899', '#6B7280', '#DC2626', '#059669', '#7C3AED',
    '#F97316', '#06B6D4', '#84CC16', '#F43F5E', '#8B5A2B',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Email validation
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Hex color validation
export const isValidHexColor = (color) => /^#[0-9A-Fa-f]{6}$/.test(color);

// Text truncation
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength).trim()}...`;
};

// Capitalize
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Deep clone (simple)
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map((v) => deepClone(v));
  const out = {};
  for (const k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) out[k] = deepClone(obj[k]);
  return out;
};

// Local storage helpers
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch {}
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch {}
  },
};

// Error message normalizer
export const getErrorMessage = (error) => {
  const apiMsg = error?.response?.data?.message;
  if (apiMsg) return apiMsg;

  const apiErrors = error?.response?.data?.errors;
  if (apiErrors) {
    const first = Object.values(apiErrors)[0];
    return Array.isArray(first) ? first[0] : first;
  }

  return error?.message || 'An unexpected error occurred';
};

// Unique ID generator
export const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);
