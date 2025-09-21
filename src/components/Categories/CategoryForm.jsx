import React, { useState, useEffect } from 'react';
import { X, Palette, FileText, AlertCircle } from 'lucide-react';
import { getErrorMessage, isValidHexColor, generateRandomColor } from '../../utils/helpers';
import LoadingSpinner from '../UI/LoadingSpinner';
import Modal from '../UI/Modal';

// Form modal for creating/updating a category
const CategoryForm = ({ category, onSubmit, onCancel }) => {
  // Local form state
  const [formData, setFormData] = useState({ name: '', color: '#3B82F6', description: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Predefined color choices
  const predefinedColors = [
    '#EF4444', '#3B82F6', '#8B5CF6', '#F59E0B', '#10B981',
    '#EC4899', '#6B7280', '#DC2626', '#059669', '#7C3AED',
    '#F97316', '#06B6D4', '#84CC16', '#F43F5E', '#8B5A2B'
  ];

  // Populate form when editing
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        color: category.color,
        description: category.description || ''
      });
    }
  }, [category]);

  // Field change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    if (submitError) setSubmitError('');
  };

  // Color selection helper
  const handleColorSelect = (color) => {
    setFormData((p) => ({ ...p, color }));
    if (errors.color) setErrors((p) => ({ ...p, color: '' }));
    if (submitError) setSubmitError('');
  };

  // Random color generator
  const handleRandomColor = () => handleColorSelect(generateRandomColor());

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.length > 255) newErrors.name = 'Name must be less than 255 characters';

    if (!formData.color) newErrors.color = 'Color is required';
    else if (!isValidHexColor(formData.color)) newErrors.color = 'Please enter a valid hex color (e.g., #FF5733)';

    if (formData.description && formData.description.length > 500)
      newErrors.description = 'Description must be less than 500 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSubmitError('');
    try {
      await onSubmit(formData);
    } catch (error) {
      setSubmitError(getErrorMessage(error));
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Render
  return (
    <Modal isOpen={true} onClose={onCancel} title={category ? 'Edit Category' : 'Add New Category'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Submit error */}
        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-sm">{submitError}</span>
          </div>
        )}

        {/* Name */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 mr-2" />
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`input ${errors.name ? 'input-error' : ''}`}
            placeholder="Enter category name"
            maxLength={255}
            disabled={loading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Color */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
            <Palette className="w-4 h-4 mr-2" />
            Color *
          </label>

          {/* Presets */}
          <div className="grid grid-cols-5 gap-3 mb-4">
            {predefinedColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorSelect(color)}
                className={`w-12 h-12 rounded-lg border-2 transition-all hover:scale-110 focus:scale-110 ${
                  formData.color === color ? 'border-gray-900 ring-2 ring-gray-300' : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>

          {/* Custom input */}
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full h-12 border border-gray-300 rounded-md cursor-pointer"
                disabled={loading}
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={formData.color}
                onChange={(e) => handleChange({ target: { name: 'color', value: e.target.value } })}
                className={`input ${errors.color ? 'input-error' : ''}`}
                placeholder="#3B82F6"
                maxLength={7}
                disabled={loading}
              />
            </div>
            <button
              type="button"
              onClick={handleRandomColor}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Random
            </button>
          </div>

          {/* Preview */}
          <div className="mt-3 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full border-2 border-gray-300" style={{ backgroundColor: formData.color }} />
            <span className="text-sm text-gray-600">Preview: {formData.color}</span>
          </div>

          {errors.color && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.color}
            </p>
          )}
        </div>

        {/* Description */}
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
            maxLength={500}
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
            <p className="text-xs text-gray-500">{formData.description.length}/500</p>
          </div>
        </div>

        {/* Actions */}
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
            ) : (
              category ? 'Update' : 'Add'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryForm;
