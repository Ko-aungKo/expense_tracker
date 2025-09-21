import React, { useMemo, useReducer } from 'react';
import { AppContext, initialState, appReducer, ACTION_TYPES } from './core';

// Provider for global app state
const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Bound action creators
  const actions = useMemo(
    () => ({
      // Loading & errors
      setLoading: (key, value) =>
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: { key, value } }),
      setError: (key, message) =>
        dispatch({ type: ACTION_TYPES.SET_ERROR, payload: { key, message } }),
      clearError: (key) =>
        dispatch({ type: ACTION_TYPES.CLEAR_ERROR, payload: { key } }),
      clearAllErrors: () =>
        dispatch({ type: ACTION_TYPES.CLEAR_ALL_ERRORS }),

      // Data sets
      setExpenses: (expenses) =>
        dispatch({ type: ACTION_TYPES.SET_EXPENSES, payload: expenses }),
      setCategories: (categories) =>
        dispatch({ type: ACTION_TYPES.SET_CATEGORIES, payload: categories }),
      setDashboardData: (data) =>
        dispatch({ type: ACTION_TYPES.SET_DASHBOARD_DATA, payload: data }),

      // Expense CRUD
      addExpense: (expense) =>
        dispatch({ type: ACTION_TYPES.ADD_EXPENSE, payload: expense }),
      updateExpense: (expense) =>
        dispatch({ type: ACTION_TYPES.UPDATE_EXPENSE, payload: expense }),
      deleteExpense: (expenseId) =>
        dispatch({ type: ACTION_TYPES.DELETE_EXPENSE, payload: expenseId }),

      // Category CRUD
      addCategory: (category) =>
        dispatch({ type: ACTION_TYPES.ADD_CATEGORY, payload: category }),
      updateCategory: (category) =>
        dispatch({ type: ACTION_TYPES.UPDATE_CATEGORY, payload: category }),
      deleteCategory: (categoryId) =>
        dispatch({ type: ACTION_TYPES.DELETE_CATEGORY, payload: categoryId }),

      // Filters
      setFilters: (filters) =>
        dispatch({ type: ACTION_TYPES.SET_FILTERS, payload: filters }),
      resetFilters: () =>
        dispatch({ type: ACTION_TYPES.RESET_FILTERS }),

      // Modals
      setModalState: (modalState) =>
        dispatch({ type: ACTION_TYPES.SET_MODAL_STATE, payload: modalState }),
      resetModals: () =>
        dispatch({ type: ACTION_TYPES.RESET_MODALS }),

      // Preferences
      setPreferences: (preferences) =>
        dispatch({ type: ACTION_TYPES.SET_PREFERENCES, payload: preferences }),

      // Full reset
      resetState: () =>
        dispatch({ type: ACTION_TYPES.RESET_STATE }),
    }),
    []
  );

  // Context value
  const contextValue = useMemo(() => ({ state, dispatch, actions }), [state, actions]);

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export default AppProvider;
