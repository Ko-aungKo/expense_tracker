import { useState, useEffect, useCallback } from 'react';
import { getErrorMessage } from '../utils/helpers';

// API hook with state management
export const useApi = (apiFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState(options.initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFunction(...args);
        const responseData = response.data;
        setData(responseData);
        return responseData;
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setData(options.initialData || null);
    setError(null);
    setLoading(false);
  }, [options.initialData]);

  useEffect(() => {
    if (options.executeOnMount !== false) {
      execute();
    }
  }, dependencies);

  return { data, loading, error, execute, reset, setData, setError };
};

// Pagination state
export const usePagination = (initialPage = 1, initialPerPage = 15) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);

  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, page));
  }, []);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const reset = useCallback(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  return { currentPage, perPage, setCurrentPage, setPerPage, goToPage, nextPage, prevPage, reset };
};

// Debounced value
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

// Local storage state
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch {}
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch {}
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};
