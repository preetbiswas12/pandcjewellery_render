import { useState } from 'react';
import { Pencil, X } from 'lucide-react';
import { Banner } from '../../services/database';
import { useApp } from '../../context/AppContext';
import { convertGoogleDriveLink } from '../../../lib/googleDriveUtils';

export default function BannersPage() {
  const { banners, updateBanner } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState<Partial<Banner>>({
    type: 'hero-side',
    title: '',
    subtitle: '',
    image: '',
    link: '',
    buttonText: '',
    isActive: true,
    order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBanner) {
      await updateBanner(editingBanner._id, formData);
    }
    
    closeModal();
  };

  const openModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData(banner);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBanner(null);
  };

  // Sort banners by order
  const sortedBanners = [...banners].sort((a, b) => a.order - b.order);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Banner Management</h1>
        <p className="text-gray-600">Manage the 5 homepage banners. Click on any banner to edit its details.</p>
      </div>

      {/* Banner Type Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-2 text-blue-900">Banner Types:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li><strong>Hero Main:</strong> Large main banner on homepage (with subtitle and button)</li>
          <li><strong>Hero Side:</strong> Side banners on homepage (2 cards on the right)</li>
          <li><strong>Casual Inspiration:</strong> Banners in the Casual Inspirations section (with arrow button)</li>
        </ul>
      </div>

      {/* All Banners */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">All Banners ({sortedBanners.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedBanners.map((banner) => (
            <BannerCard
              key={banner._id}
              banner={banner}
              onEdit={() => openModal(banner)}
            />
          ))}
        </div>
        {sortedBanners.length === 0 && (
          <p className="text-gray-500 text-center py-8">No banners found</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-magenta-950/50 flex items-center justify-center z-[999] p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold">
                {editingBanner ? 'Edit Banner' : 'Add New Banner'}
              </h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Banner Type *</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Banner['type'] })}
                  className="w-full border rounded-lg px-4 py-2"
                >
                  <option value="hero-main">Hero Main (Large banner with button)</option>
                  <option value="hero-side">Hero Side (Side cards)</option>
                  <option value="casual-inspiration">Casual Inspiration (with arrow)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="Enter banner title"
                />
                <p className="text-xs text-gray-500 mt-1">Use \n for line breaks (e.g., "Say it\nwith Shirt")</p>
              </div>

              {formData.type === 'hero-main' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Subtitle</label>
                  <textarea
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    rows={2}
                    placeholder="Enter banner subtitle (optional)"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Image URL *</label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="https://example.com/image.jpg or use Unsplash URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Link URL *</label>
                <input
                  type="text"
                  required
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="/shop or external URL"
                />
              </div>

              {formData.type === 'hero-main' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Button Text</label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="VIEW COLLECTIONS"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Display Order *</label>
                <input
                  type="number"
                  required
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full border rounded-lg px-4 py-2"
                  placeholder="0"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Active (Display on website)
                </label>
              </div>

              <div className="flex gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-magenta-950 text-white py-3 rounded-lg hover:bg-magenta-900 transition-colors font-medium"
                >
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function BannerCard({
  banner,
  onEdit,
}: {
  banner: Banner;
  onEdit: () => void;
}) {
  const getBannerTypeLabel = (type: Banner['type']) => {
    switch (type) {
      case 'hero-main':
        return 'Hero Main';
      case 'hero-side':
        return 'Hero Side';
      case 'casual-inspiration':
        return 'Casual Inspiration';
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-40">
        <img
          src={convertGoogleDriveLink(banner.image)}
          alt={banner.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${
            banner.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
          }`}>
            {banner.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase">
              {getBannerTypeLabel(banner.type)}
            </span>
            <h3 className="font-semibold text-lg">{banner.title.replace(/\\n/g, ' ')}</h3>
            {banner.subtitle && (
              <p className="text-sm text-gray-600 mt-1">{banner.subtitle}</p>
            )}
          </div>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            Order: {banner.order}
          </span>
        </div>
        <div className="text-xs text-gray-500 mb-3">
          Link: <span className="font-mono">{banner.link}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            <Pencil size={16} />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}