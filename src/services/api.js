import axios from 'axios';

// Base config
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const TIMEOUT = 10000;

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

// Request lifecycle (auth, timing)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error) => Promise.reject(error)
);

// Response lifecycle (logging, errors)
api.interceptors.response.use(
  (response) => {
    const duration = new Date() - response.config.metadata.startTime;
    console.debug(`API Request completed in ${duration}ms:`, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }
    if (error.response?.status >= 500) {
      console.error('Server error occurred');
    }
    return Promise.reject(error);
  }
);

// Expenses endpoints
export const expenseAPI = {
  getAll: (params = {}) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== '' && v != null)
    );
    return api.get('/expenses', { params: cleanParams });
  },
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
  getById: (id) => api.get(`/expenses/${id}`),
};

// Categories endpoints
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
  getById: (id) => api.get(`/categories/${id}`),
};

// Dashboard endpoints
export const dashboardAPI = {
  getData: (params = {}) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== '' && v != null)
    );
    return api.get('/dashboard', { params: cleanParams });
  },
  getMonthlyStats: (year) => api.get(`/dashboard/monthly/${year}`),
};

// Health endpoint
export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;
