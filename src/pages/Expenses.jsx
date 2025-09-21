import React, { useEffect } from 'react';
import { useExpenses, useCategories, useFilters, useModals } from '../context/hooks';
import { expenseAPI, categoryAPI } from '../services/api';
import ExpenseForm from '../components/Expenses/ExpenseForm';
import ExpenseList from '../components/Expenses/ExpenseList';
import ExpenseFilters from '../components/Expenses/ExpenseFilters';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { Plus, Download } from 'lucide-react';
import { usePagination } from '../hooks/useApi';
import { getErrorMessage } from '../utils/helpers';

// Expenses page (fetch, filter, paginate, CRUD)
const Expenses = () => {
  // state/actions
  const {
    expenses, loading, error,
    addExpense, updateExpense, deleteExpense,
    setExpenses, setLoading, setError, clearError
  } = useExpenses();

  const {
    categories, setCategories, setLoading: setCategoriesLoading
  } = useCategories();

  const { filters, setFilters } = useFilters();
  const { modals, setModalState } = useModals();

  const { currentPage, goToPage, reset: resetPagination } = usePagination();

  // init
  useEffect(() => {
    clearError();
    fetchCategories();
  }, []);

  // data refresh
  useEffect(() => {
    fetchExpenses();
  }, [filters, currentPage]);

  // api: expenses
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      clearError();
      const response = await expenseAPI.getAll({ ...filters, page: currentPage });
      setExpenses(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  // api: categories
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // ui: modal open (add)
  const handleAddExpense = () => {
    setModalState({ showExpenseForm: true, editingExpense: null });
  };

  // ui: modal open (edit)
  const handleEditExpense = (expense) => {
    setModalState({ showExpenseForm: true, editingExpense: expense });
  };

  // api: delete
  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await expenseAPI.delete(expenseId);
      deleteExpense(expenseId);
      console.log('Expense deleted successfully');
    } catch (err) {
      setError(getErrorMessage(err));
      console.error('Error deleting expense:', err);
    }
  };

  // api: create/update
  const handleFormSubmit = async (expenseData) => {
    let response;
    if (modals.editingExpense) {
      response = await expenseAPI.update(modals.editingExpense.id, expenseData);
      updateExpense(response.data);
    } else {
      response = await expenseAPI.create(expenseData);
      addExpense(response.data);
      if (currentPage !== 1) resetPagination();
    }
    setModalState({ showExpenseForm: false, editingExpense: null });
  };

  // filters change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    resetPagination();
  };

  // pagination change
  const handlePageChange = (page) => {
    goToPage(page);
  };

  // export placeholder
  const handleExport = async () => {
    try {
      console.log('Export functionality would be implemented here');
      alert('Export feature coming soon!');
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600 mt-1">Track and manage your expenses</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleExport}
            className="btn btn-secondary flex items-center"
            disabled={!expenses.data || expenses.data.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button
            onClick={handleAddExpense}
            className="btn btn-primary flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </button>
        </div>
      </div>

      {/* error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-500 hover:text-red-700 ml-4">×</button>
        </div>
      )}

      {/* filters */}
      <ExpenseFilters
        filters={filters}
        categories={categories}
        onFilterChange={handleFilterChange}
      />

      {/* list */}
      <ExpenseList
        expenses={expenses}
        loading={loading}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
        onPageChange={handlePageChange}
        currentPage={currentPage}
      />

      {/* modal */}
      {modals.showExpenseForm && (
        <ExpenseForm
          expense={modals.editingExpense}
          categories={categories}
          onSubmit={handleFormSubmit}
          onCancel={() => setModalState({ showExpenseForm: false, editingExpense: null })}
        />
      )}
    </div>
  );
};

export default Expenses;
