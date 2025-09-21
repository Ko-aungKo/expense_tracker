import React from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight, Calendar, Tag } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';
import LoadingSpinner from '../UI/LoadingSpinner';

// Expense list with summary and pagination
const ExpenseList = ({ expenses, loading, onEdit, onDelete, onPageChange, currentPage }) => {
  // Loading state
  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" text="Loading expenses..." />
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!expenses || !expenses.data || expenses.data.length === 0) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="text-center py-12">
            <div className="text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No expenses found</h3>
              <p>Try adjusting your filters or add a new expense.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pagination math
  const total = expenses.total ?? expenses.data.length;
  const perPage = expenses.per_page || expenses.data.length;
  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="card">
      <div className="card-body">
        {/* Summary */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-lg font-semibold text-gray-900">{total.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">This Page</p>
              <p className="text-lg font-semibold text-gray-900">{expenses.data.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(
                  expenses.data.reduce((sum, e) => {
                    const n = Number(e.amount);
                    return sum + (Number.isFinite(n) ? n : 0);
                  }, 0)
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-3">
          {expenses.data.map((expense) => {
            const categoryName = expense.category?.name ?? 'Uncategorized';
            const categoryColor = expense.category?.color ?? '#e5e7eb';
            return (
              <div key={expense.id} className="expense-item group">
                <div className="flex items-start justify-between">
                  {/* Left */}
                  <div className="flex items-start space-x-4 flex-1 min-w-0">
                    {/* Category indicator */}
                    <div
                      className="w-1 h-16 rounded-full flex-shrink-0 mt-1"
                      style={{ backgroundColor: categoryColor }}
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate text-lg">
                            {expense.title ?? '(No title)'}
                          </h3>

                          <div className="flex items-center space-x-3 mt-1">
                            {expense.category && (
                              <span className="flex items-center text-sm text-gray-500">
                                <Tag className="w-3 h-3 mr-1" />
                                {categoryName}
                              </span>
                            )}
                            <span className="flex items-center text-sm text-gray-500">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(expense.expense_date)}
                            </span>
                          </div>

                          {expense.description && (
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                              {expense.description}
                            </p>
                          )}
                        </div>

                        {/* Amount */}
                        <div className="ml-4 text-right flex-shrink-0">
                          <p className="text-xl font-bold text-gray-900">
                            {formatCurrency(Number(expense.amount) || 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(expense)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit expense"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      title="Delete expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 mt-6">
            {/* Mobile */}
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="flex items-center text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>

            {/* Desktop */}
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{expenses.from || 0}</span> to{' '}
                  <span className="font-medium">{expenses.to || 0}</span> of{' '}
                  <span className="font-medium">{total}</span> results
                </p>
              </div>
              <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                  <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const page = i + Math.max(1, currentPage - 2);
                    if (page > totalPages) return null;
                    return (
                      <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-colors ${
                          page === currentPage
                            ? 'z-10 bg-blue-600 text-white focus:z-20'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
