import React, { useEffect } from 'react';
import { Plus, Download } from 'lucide-react';
import { useCategories, useModals } from '../context/hooks';
import { categoryAPI } from '../services/api';
import CategoryForm from '../components/Categories/CategoryForm';
import CategoryList from '../components/Categories/CategoryList';
import { getErrorMessage } from '../utils/helpers';

// Categories page (load, CRUD, modal)
const Categories = () => {
  // state/actions
  const {
    categories, loading, error,
    addCategory, updateCategory, deleteCategory,
    setCategories, setLoading, setError, clearError,
  } = useCategories();
  const { modals, setModalState } = useModals();

  // init
  useEffect(() => {
    clearError();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // api: list
  const fetchCategories = async () => {
    try {
      setLoading(true);
      clearError();
      const res = await categoryAPI.getAll();
      const list = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : [];
      setCategories(list);
    } catch (err) {
      setError(getErrorMessage(err));
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  // ui: modal open (add)
  const handleAddCategory = () => {
    setModalState({ showCategoryForm: true, editingCategory: null });
  };

  // ui: modal open (edit)
  const handleEditCategory = (category) => {
    setModalState({ showCategoryForm: true, editingCategory: category });
  };

  // api: delete
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoryAPI.delete(categoryId);
      deleteCategory(categoryId);
      console.log('Category deleted successfully');
    } catch (err) {
      setError(getErrorMessage(err));
      console.error('Error deleting category:', err);
    }
  };

  // api: create/update
  const handleFormSubmit = async (payload) => {
    try {
      let res;
      if (modals.editingCategory) {
        res = await categoryAPI.update(modals.editingCategory.id, payload);
        updateCategory(res.data);
      } else {
        res = await categoryAPI.create(payload);
        addCategory(res.data);
      }
      setModalState({ showCategoryForm: false, editingCategory: null });
    } catch (err) {
      setError(getErrorMessage(err));
      console.error('Error saving category:', err);
    }
  };

  // export placeholder
  const handleExport = async () => {
    try {
      alert('Export feature coming soon!');
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  // render
  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Organize your expenses with categories</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleExport}
            className="btn btn-secondary flex items-center"
            disabled={!categories || categories.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button onClick={handleAddCategory} className="btn btn-primary flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
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

      {/* list */}
      <CategoryList
        categories={categories}
        loading={loading}
        onEdit={handleEditCategory}
        onDelete={handleDeleteCategory}
      />

      {/* modal */}
      {modals.showCategoryForm && (
        <CategoryForm
          category={modals.editingCategory}
          onSubmit={handleFormSubmit}
          onCancel={() => setModalState({ showCategoryForm: false, editingCategory: null })}
        />
      )}
    </div>
  );
};

export default Categories;
