import React, { useState } from 'react';
import { Edit2, Trash2, Search, MoreHorizontal } from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../UI/LoadingSpinner';

// Grid list of categories with search/sort and item actions
const CategoryList = ({ categories, loading, onEdit, onDelete }) => {
  // UI state: search and sort
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');     // name | expenses_count | color
  const [sortOrder, setSortOrder] = useState('asc'); // asc | desc

  // Loading state
  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" text="Loading categories..." />
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!categories || categories.length === 0) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="text-center py-12 text-gray-500">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <MoreHorizontal className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-400 mb-2">No categories found</h3>
            <p>Create your first category to start organizing expenses.</p>
          </div>
        </div>
      </div>
    );
  }

  // Client-side filter and sort
  const filteredAndSortedCategories = categories
    .filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'expenses_count':
          aValue = a.expenses_count || 0;
          bValue = b.expenses_count || 0;
          break;
        case 'color':
          aValue = a.color;
          bValue = b.color;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

  // Sort toggles
  const handleSort = (field) => {
    if (sortBy === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Sort indicator
  const getSortIcon = (field) => (sortBy === field ? (sortOrder === 'asc' ? '↑' : '↓') : null);

  // Render
  return (
    <div className="card">
      {/* Header controls */}
      <div className="card-header">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Categories ({filteredAndSortedCategories.length})
          </h2>

          <div className="flex items-center space-x-3">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Sort buttons */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <button
                onClick={() => handleSort('name')}
                className={`text-sm px-2 py-1 rounded transition-colors ${
                  sortBy === 'name' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Name {getSortIcon('name')}
              </button>
              <button
                onClick={() => handleSort('expenses_count')}
                className={`text-sm px-2 py-1 rounded transition-colors ${
                  sortBy === 'expenses_count' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Usage {getSortIcon('expenses_count')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid list */}
      <div className="card-body">
        {filteredAndSortedCategories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No categories match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAndSortedCategories.map((category) => (
              <div
                key={category.id}
                className="group relative border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-gray-300 transition-all duration-200 bg-white"
              >
                {/* Item header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div
                      className="w-10 h-10 rounded-full border-2 border-white shadow-md flex-shrink-0"
                      style={{ backgroundColor: category.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate text-base">{category.name}</h3>
                      <p className="text-sm text-gray-500">
                        {category.expenses_count || 0} expense{(category.expenses_count || 0) !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  {/* Item actions */}
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(category.id)}
                      className={`p-2 rounded-md transition-colors ${
                        (category.expenses_count || 0) > 0
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                      disabled={(category.expenses_count || 0) > 0}
                      title={
                        (category.expenses_count || 0) > 0
                          ? 'Cannot delete category with expenses'
                          : 'Delete category'
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {category.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{category.description}</p>
                )}

                {/* Meta */}
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Color: {category.color}</span>
                    {(category.expenses_count || 0) > 0 && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">Active</span>
                    )}
                  </div>
                </div>

                {/* Hover wash */}
                <div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"
                  style={{ backgroundColor: category.color }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
