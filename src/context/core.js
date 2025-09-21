import { createContext } from 'react';

// Context
export const AppContext = createContext(null);

// Initial state
export const initialState = {
  expenses: { data: [], total: 0, per_page: 15, current_page: 1, from: 0, to: 0 },
  categories: [],
  dashboardData: null,
  loading: { expenses: false, categories: false, dashboard: false },
  error: { expenses: null, categories: null, dashboard: null, general: null },
  filters: {
    start_date: '', end_date: '', category_id: '', search: '',
    sort_by: 'expense_date', sort_order: 'desc',
  },
  modals: {
    showExpenseForm: false, showCategoryForm: false,
    editingExpense: null, editingCategory: null,
  },
  preferences: { theme: 'light', itemsPerPage: 15, currency: 'USD' },
};

// Action types
export const ACTION_TYPES = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_ALL_ERRORS: 'CLEAR_ALL_ERRORS',
  SET_EXPENSES: 'SET_EXPENSES',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_DASHBOARD_DATA: 'SET_DASHBOARD_DATA',
  ADD_EXPENSE: 'ADD_EXPENSE',
  UPDATE_EXPENSE: 'UPDATE_EXPENSE',
  DELETE_EXPENSE: 'DELETE_EXPENSE',
  ADD_CATEGORY: 'ADD_CATEGORY',
  UPDATE_CATEGORY: 'UPDATE_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
  SET_FILTERS: 'SET_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS',
  SET_MODAL_STATE: 'SET_MODAL_STATE',
  RESET_MODALS: 'RESET_MODALS',
  SET_PREFERENCES: 'SET_PREFERENCES',
  RESET_STATE: 'RESET_STATE',
};

// Reducer
export const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LOADING:
      return { ...state, loading: { ...state.loading, [action.payload.key]: action.payload.value } };
    case ACTION_TYPES.SET_ERROR:
      return { ...state, error: { ...state.error, [action.payload.key]: action.payload.message } };
    case ACTION_TYPES.CLEAR_ERROR:
      return { ...state, error: { ...state.error, [action.payload.key]: null } };
    case ACTION_TYPES.CLEAR_ALL_ERRORS:
      return { ...state, error: { expenses: null, categories: null, dashboard: null, general: null } };
    case ACTION_TYPES.SET_EXPENSES:
      return { ...state, expenses: action.payload, error: { ...state.error, expenses: null } };
    case ACTION_TYPES.SET_CATEGORIES:
      return { ...state, categories: action.payload, error: { ...state.error, categories: null } };
    case ACTION_TYPES.SET_DASHBOARD_DATA:
      return { ...state, dashboardData: action.payload, error: { ...state.error, dashboard: null } };
    case ACTION_TYPES.ADD_EXPENSE:
      return { ...state, expenses: { ...state.expenses, data: [action.payload, ...state.expenses.data], total: state.expenses.total + 1 } };
    case ACTION_TYPES.UPDATE_EXPENSE:
      return { ...state, expenses: { ...state.expenses, data: state.expenses.data.map(e => e.id === action.payload.id ? action.payload : e) } };
    case ACTION_TYPES.DELETE_EXPENSE:
      return { ...state, expenses: { ...state.expenses, data: state.expenses.data.filter(e => e.id !== action.payload), total: Math.max(0, state.expenses.total - 1) } };
    case ACTION_TYPES.ADD_CATEGORY:
      return { ...state, categories: [...state.categories, action.payload] };
    case ACTION_TYPES.UPDATE_CATEGORY:
      return { ...state, categories: state.categories.map(c => c.id === action.payload.id ? action.payload : c) };
    case ACTION_TYPES.DELETE_CATEGORY:
      return { ...state, categories: state.categories.filter(c => c.id !== action.payload) };
    case ACTION_TYPES.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case ACTION_TYPES.RESET_FILTERS:
      return { ...state, filters: initialState.filters };
    case ACTION_TYPES.SET_MODAL_STATE:
      return { ...state, modals: { ...state.modals, ...action.payload } };
    case ACTION_TYPES.RESET_MODALS:
      return { ...state, modals: initialState.modals };
    case ACTION_TYPES.SET_PREFERENCES:
      return { ...state, preferences: { ...state.preferences, ...action.payload } };
    case ACTION_TYPES.RESET_STATE:
      return initialState;
    default:
      return state;
  }
};
