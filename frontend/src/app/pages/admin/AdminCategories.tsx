import { useState } from 'react';
import { Plus, Pencil, Trash2, X, FolderTree } from 'lucide-react';
import { Category } from '../../services/database';
import { useApp } from '../../context/AppContext';

export default function AdminCategories() {
  const { categories, createCategory, updateCategory, deleteCategory } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    slug: '',
    subCategories: [],
    isActive: true,
  });
  const [subCategoryInput, setSubCategoryInput] = useState({ name: '', slug: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      await updateCategory(editingCategory._id, formData);
    } else {
      await createCategory(formData as Omit<Category, '_id' | 'createdAt' | 'updatedAt'>);
    }
    
    closeModal();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      await deleteCategory(id);
    }
  };

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData(category);
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        subCategories: [],
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setSubCategoryInput({ name: '', slug: '' });
  };

  const addSubCategory = () => {
    if (subCategoryInput.name && subCategoryInput.slug) {
      setFormData({
        ...formData,
        subCategories: [
          ...(formData.subCategories || []),
          { ...subCategoryInput }
        ]
      });
      setSubCategoryInput({ name: '', slug: '' });
    }
  };

  const removeSubCategory = (index: number) => {
    setFormData({
      ...formData,
      subCategories: formData.subCategories?.filter((_, i) => i !== index) || []
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name)
    });
  };

  const handleSubCategoryNameChange = (name: string) => {
    setSubCategoryInput({
      name,
      slug: generateSlug(name)
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Category Management</h1>
          <p className="text-gray-600">Manage product categories and subcategories</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Categories List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <CategoryCard
            key={category._id}
            category={category}
            onEdit={() => openModal(category)}
            onDelete={() => handleDelete(category._id)}
          />
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FolderTree className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No categories found</p>
          <button
            onClick={() => openModal()}
            className="mt-4 text-black hover:underline"
          >
            Create your first category
          </button>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  required
                />
              </div>

              {/* Category Slug */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL-friendly version (auto-generated)
                </p>
              </div>

              {/* Subcategories */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Subcategories
                </label>
                
                {/* Add Subcategory */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Subcategory name"
                    value={subCategoryInput.name}
                    onChange={(e) => handleSubCategoryNameChange(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                  />
                  <input
                    type="text"
                    placeholder="slug"
                    value={subCategoryInput.slug}
                    onChange={(e) => setSubCategoryInput({ ...subCategoryInput, slug: e.target.value })}
                    className="w-32 border border-gray-300 rounded-lg px-4 py-2 bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={addSubCategory}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Subcategory List */}
                <div className="space-y-2">
                  {formData.subCategories?.map((sub, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg"
                    >
                      <div>
                        <span className="font-medium">{sub.name}</span>
                        <span className="text-sm text-gray-500 ml-2">({sub.slug})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeSubCategory(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Active
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                  {editingCategory ? 'Update' : 'Create'} Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Category Card Component
function CategoryCard({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold">{category.name}</h3>
            {!category.isActive && (
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                Inactive
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">/{category.slug}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="text-gray-600 hover:text-black"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {category.subCategories.length > 0 && (
        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2">
            Subcategories ({category.subCategories.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {category.subCategories.map((sub, index) => (
              <span
                key={index}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
              >
                {sub.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
