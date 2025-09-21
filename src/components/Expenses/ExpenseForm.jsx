import React, { useEffect, useState } from 'react';
import { X, DollarSign, Calendar, FileText, Tag, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { getErrorMessage } from '../../utils/helpers';
import LoadingSpinner from '../UI/LoadingSpinner';
import Modal from '../UI/Modal';

// Expense create/update form (validation, modal, submit)
const ExpenseForm = ({ expense, categories, onSubmit, onCancel }) => {
  // local state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    expense_date: format(new Date(), 'yyyy-MM-dd'),
    category_id: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // fill form when editing
  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title,
        description: expense.description || '',
        amount: expense.amount,
        expense_date: format(new Date(expense.expense_date), 'yyyy-MM-dd'),
        category_id: expense.category_id,
      });
    }
  }, [expense]);

  // inputs change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    if (submitError) setSubmitError('');
  };

  // validate fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    else if (formData.title.length > 255) newErrors.title = 'Title must be less than 255 characters';

    if (!formData.amount) newErrors.amount = 'Amount is required';
    else if (parseFloat(formData.amount) <= 0) newErrors.amount = 'Amount must be greater than 0';
    else if (parseFloat(formData.amount) > 99999999.99) newErrors.amount = 'Amount cannot exceed 99,999,999.99';

    if (!formData.expense_date) newErrors.expense_date = 'Date is required';
    else if (new Date(formData.expense_date) > new Date()) newErrors.expense_date = 'Date cannot be in the future';

    if (!formData.category_id) newErrors.category_id = 'Category is required';

    if (formData.description && formData.description.length > 1000)
      newErrors.description = 'Description must be less than 1000 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSubmitError('');

    try {
      await onSubmit({ ...formData, amount: parseFloat(formData.amount) });
    } catch (error) {
      setSubmitError(getErrorMessage(error));
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  // category color preview
  const selectedCategory = categories.find((cat) => cat.id == formData.category_id);

  // render
  return (
    <Modal isOpen={true} onClose={onCancel} title={expense ? 'Edit Expense' : 'Add New Expense'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* submit error */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{submitError}</span>
          </div>
        )}

        {/* title */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 mr-2" />
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`input ${errors.title ? 'input-error' : ''}`}
            placeholder="Enter expense title"
            maxLength={255}
            disabled={loading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.title}
            </p>
          )}
        </div>

        {/* description */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 mr-2" />
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className={`input resize-none ${errors.description ? 'input-error' : ''}`}
            placeholder="Enter description (optional)"
            maxLength={1000}
            disabled={loading}
          />
          <div className="flex justify-between mt-1">
            {errors.description ? (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.description}
              </p>
            ) : (
              <div />
            )}
            <p className="text-xs text-gray-500">{formData.description.length}/1000</p>
          </div>
        </div>

        {/* amount */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 mr-2" />
            Amount *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              max="99999999.99"
              className={`input pl-8 ${errors.amount ? 'input-error' : ''}`}
              placeholder="0.00"
              disabled={loading}
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.amount}
            </p>
          )}
        </div>

        {/* date */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-4 h-4 mr-2" />
            Date *
          </label>
          <input
            type="date"
            name="expense_date"
            value={formData.expense_date}
            onChange={handleChange}
            max={format(new Date(), 'yyyy-MM-dd')}
            className={`input ${errors.expense_date ? 'input-error' : ''}`}
            disabled={loading}
          />
          {errors.expense_date && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.expense_date}
            </p>
          )}
        </div>

        {/* category */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Tag className="w-4 h-4 mr-2" />
            Category *
          </label>
          <div className="relative">
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className={`input ${errors.category_id ? 'input-error' : ''}`}
              disabled={loading}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {selectedCategory && (
              <div
                className="absolute right-8 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full"
                style={{ backgroundColor: selectedCategory.color }}
              />
            )}
          </div>
          {errors.category_id && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.category_id}
            </p>
          )}
        </div>

        {/* actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button type="button" onClick={onCancel} disabled={loading} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary flex items-center min-w-[100px] justify-center">
            {loading ? (
              <>
                <LoadingSpinner size="sm" color="white" />
                <span className="ml-2">Saving...</span>
              </>
            ) : expense ? (
              'Update'
            ) : (
              'Add'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ExpenseForm;
