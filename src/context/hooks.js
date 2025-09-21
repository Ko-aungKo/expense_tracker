import { useContext } from 'react';
import { AppContext } from './core';

/**
 * Base hook for accessing app context
 */
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};

/**
 * Expenses state/actions
 */
export const useExpenses = () => {
  const { state, actions } = useApp();
  return {
    expenses: state.expenses,
    loading: state.loading.expenses,
    error: state.error.expenses,
    setExpenses: actions.setExpenses,
    addExpense: actions.addExpense,
    updateExpense: actions.updateExpense,
    deleteExpense: actions.deleteExpense,
    setLoading: (v) => actions.setLoading('expenses', v),
    setError: (m) => actions.setError('expenses', m),
    clearError: () => actions.clearError('expenses'),
  };
};

/**
 * Categories state/actions
 */
export const useCategories = () => {
  const { state, actions } = useApp();
  return {
    categories: state.categories,
    loading: state.loading.categories,
    error: state.error.categories,
    setCategories: actions.setCategories,
    addCategory: actions.addCategory,
    updateCategory: actions.updateCategory,
    deleteCategory: actions.deleteCategory,
    setLoading: (v) => actions.setLoading('categories', v),
    setError: (m) => actions.setError('categories', m),
    clearError: () => actions.clearError('categories'),
  };
};

/**
 * Dashboard state/actions
 */
export const useDashboard = () => {
  const { state, actions } = useApp();
  return {
    dashboardData: state.dashboardData,
    loading: state.loading.dashboard,
    error: state.error.dashboard,
    setDashboardData: actions.setDashboardData,
    setLoading: (v) => actions.setLoading('dashboard', v),
    setError: (m) => actions.setError('dashboard', m),
    clearError: () => actions.clearError('dashboard'),
  };
};

/**
 * Filters state/actions
 */
export const useFilters = () => {
  const { state, actions } = useApp();
  return {
    filters: state.filters,
    setFilters: actions.setFilters,
    resetFilters: actions.resetFilters,
  };
};

/**
 * Modals state/actions
 */
export const useModals = () => {
  const { state, actions } = useApp();
  return {
    modals: state.modals,
    setModalState: actions.setModalState,
    resetModals: actions.resetModals,
  };
};

/**
 * Preferences state/actions
 */
export const usePreferences = () => {
  const { state, actions } = useApp();
  return {
    preferences: state.preferences,
    setPreferences: actions.setPreferences,
  };
};
