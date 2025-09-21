import React, { useState } from 'react';
import { Search, Filter, X, Calendar, ChevronDown, RotateCcw } from 'lucide-react';
import { format, startOfWeek, startOfMonth, startOfYear } from 'date-fns';
import { useDebounce } from '../../hooks/useApi';

// Expense filter controls (search, category, dates, sort, quick filters)
const ExpenseFilters = ({ filters, categories, onFilterChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localSearch, setLocalSearch] = useState(filters.search);
  const debouncedSearch = useDebounce(localSearch, 500);

  React.useEffect(() => {
    if (debouncedSearch !== filters.search) {
      handleFilterChange('search', debouncedSearch);
    }
  }, [debouncedSearch]);

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    setLocalSearch('');
    onFilterChange({
      start_date: '',
      end_date: '',
      category_id: '',
      search: '',
      sort_by: 'expense_date',
      sort_order: 'desc',
    });
  };

  const setQuickFilter = (type) => {
    const today = new Date();
    let startDate = '';

    switch (type) {
      case 'today':
        startDate = format(today, 'yyyy-MM-dd');
        handleFilterChange('start_date', startDate);
        handleFilterChange('end_date', startDate);
        break;
      case 'week':
        startDate = format(startOfWeek(today), 'yyyy-MM-dd');
        handleFilterChange('start_date', startDate);
        handleFilterChange('end_date', format(today, 'yyyy-MM-dd'));
        break;
      case 'month':
        startDate = format(startOfMonth(today), 'yyyy-MM-dd');
        handleFilterChange('start_date', startDate);
        handleFilterChange('end_date', format(today, 'yyyy-MM-dd'));
        break;
      case 'year':
        startDate = format(startOfYear(today), 'yyyy-MM-dd');
        handleFilterChange('start_date', startDate);
        handleFilterChange('end_date', format(today, 'yyyy-MM-dd'));
        break;
      default:
        break;
    }
  };

  const hasActiveFilters = filters.start_date || filters.end_date || filters.category_id || filters.search;

  const getSelectedCategoryName = () => {
    if (!filters.category_id) return 'All Categories';
    const category = categories.find((cat) => cat.id == filters.category_id);
    return category ? category.name : 'All Categories';
  };

  return (
    <div className="card">
      <div className="card-body">
        {/* header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </h3>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Clear All
              </button>
            )}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
            >
              <Filter className="w-4 h-4 mr-1" />
              {showAdvanced ? 'Less' : 'More'} Filters
              <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* basic filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="input pl-10"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* category */}
          <div className="relative">
            <select
              value={filters.category_id}
              onChange={(e) => handleFilterChange('category_id', e.target.value)}
              className="input appearance-none"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* start date */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => handleFilterChange('start_date', e.target.value)}
              className="input pl-10"
              max={filters.end_date || format(new Date(), 'yyyy-MM-dd')}
            />
          </div>

          {/* end date */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => handleFilterChange('end_date', e.target.value)}
              className="input pl-10"
              min={filters.start_date}
              max={format(new Date(), 'yyyy-MM-dd')}
            />
          </div>
        </div>

        {/* advanced filters */}
        {showAdvanced && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select value={filters.sort_by} onChange={(e) => handleFilterChange('sort_by', e.target.value)} className="input">
                  <option value="expense_date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="title">Title</option>
                  <option value="created_at">Created Date</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
                <select value={filters.sort_order} onChange={(e) => handleFilterChange('sort_order', e.target.value)} className="input">
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* quick filters */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Quick filters:</span>
            <button onClick={() => setQuickFilter('today')} className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors">
              Today
            </button>
            <button onClick={() => setQuickFilter('week')} className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors">
              This Week
            </button>
            <button onClick={() => setQuickFilter('month')} className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200 transition-colors">
              This Month
            </button>
            <button onClick={() => setQuickFilter('year')} className="px-3 py-1 text-xs bg-orange-100 text-orange-800 rounded-full hover:bg-orange-200 transition-colors">
              This Year
            </button>
          </div>
        </div>

        {/* active filters summary */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Active filters:</span>
              {filters.category_id && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Category: {getSelectedCategoryName()}
                  <button onClick={() => handleFilterChange('category_id', '')} className="ml-1 text-green-600 hover:text-green-800">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.start_date && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  From: {format(new Date(filters.start_date), 'MMM dd, yyyy')}
                  <button onClick={() => handleFilterChange('start_date', '')} className="ml-1 text-purple-600 hover:text-purple-800">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.end_date && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  To: {format(new Date(filters.end_date), 'MMM dd, yyyy')}
                  <button onClick={() => handleFilterChange('end_date', '')} className="ml-1 text-orange-600 hover:text-orange-800">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseFilters;
