import { useState } from 'react';
import { Plus, Edit, Trash2, X, Eye, EyeOff, ChevronUp, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Banner } from '../../services/database';
import { convertGoogleDriveLink } from '../../../lib/googleDriveUtils';
import { GoogleDrivePicker } from '../../components/GoogleDrivePicker';

export default function AdminBanners() {
  const { banners, createBanner, updateBanner, deleteBanner: deleteBannerDB } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [showGoogleDrivePicker, setShowGoogleDrivePicker] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'hero-main' as Banner['type'],
    title: '',
    subtitle: '',
    image: '',
    link: '',
    buttonText: '',
    isActive: true,
    order: ''
  });

  const resetForm = () => {
    setFormData({
      type: 'hero-main',
      title: '',
      subtitle: '',
      image: '',
      link: '',
      buttonText: '',
      isActive: true,
      order: ''
    });
    setEditingBanner(null);
  };

  const openModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        type: banner.type,
        title: banner.title,
        subtitle: banner.subtitle,
        image: banner.image,
        link: banner.link,
        buttonText: banner.buttonText,
        isActive: banner.isActive,
        order: banner.order.toString()
      });
    } else {
      resetForm();
      setFormData(prev => ({
        ...prev,
        order: (banners.length + 1).toString()
      }));
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const bannerData = {
      type: formData.type || 'hero-main',
      title: formData.title,
      subtitle: formData.subtitle,
      image: formData.image,
      link: formData.link,
      buttonText: formData.buttonText,
      isActive: formData.isActive,
      order: parseInt(formData.order)
    };

    if (editingBanner) {
      await updateBanner(editingBanner._id, bannerData);
    } else {
      await createBanner(bannerData as Omit<Banner, '_id' | 'createdAt' | 'updatedAt'>);
    }
    
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      deleteBannerDB(id);
    }
  };

  const toggleActive = (banner: Banner) => {
    updateBanner(banner._id, { isActive: !banner.isActive });
  };

  const moveOrder = (banner: Banner, direction: 'up' | 'down') => {
    const newOrder = direction === 'up' ? banner.order - 1 : banner.order + 1;
    if (newOrder < 1 || newOrder > banners.length) return;
    
    // Find banner with the target order
    const swapBanner = banners.find(b => b.order === newOrder);
    if (swapBanner) {
      updateBanner(swapBanner._id, { order: banner.order });
    }
    updateBanner(banner._id, { order: newOrder });
  };

  // Handle Google Drive image selection
  const handleGoogleDriveImage = (urls: string[]) => {
    if (urls && urls.length > 0) {
      // Update form data with the first selected image
      formDataRef.current.image = urls[0];
      // Reset picker
      setShowGoogleDrivePicker(false);
    }
  };

  // Sort banners by order
  const sortedBanners = [...banners].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Banners</h1>
          <p className="text-lg opacity-70">{banners.length} total banners</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Add Banner
        </button>
      </div>

      {/* Banners List */}
      <div className="space-y-4">
        {sortedBanners.map((banner) => (
          <div key={banner._id} className="bg-white rounded-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Banner Image */}
              <div className="md:w-1/3 aspect-[16/9] md:aspect-auto bg-gray-100 relative">
                <img 
                  src={convertGoogleDriveLink(banner.image)} 
                  alt={banner.title} 
                  className="w-full h-full object-cover"
                />
                {!banner.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-white px-4 py-2 rounded-full font-medium">Inactive</span>
                  </div>
                )}
              </div>

              {/* Banner Details */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">
                        Order: {banner.order}
                      </span>
                      {banner.isActive ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1">
                          <Eye size={14} />
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium flex items-center gap-1">
                          <EyeOff size={14} />
                          Inactive
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{banner.title}</h3>
                    <p className="text-lg opacity-70 mb-3">{banner.subtitle}</p>
                    <p className="text-sm opacity-70 mb-2">
                      <span className="font-medium">Button:</span> {banner.buttonText}
                    </p>
                    <p className="text-sm opacity-70">
                      <span className="font-medium">Link:</span>{' '}
                      <a href={banner.link} className="text-blue-600 hover:underline">
                        {banner.link}
                      </a>
                    </p>
                  </div>

                  {/* Order Controls */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => moveOrder(banner, 'up')}
                      disabled={banner.order === 1}
                      className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronUp size={18} />
                    </button>
                    <button
                      onClick={() => moveOrder(banner, 'down')}
                      disabled={banner.order === banners.length}
                      className="w-10 h-10 border-2 border-black rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronDown size={18} />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive(banner)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      banner.isActive
                        ? 'bg-gray-100 hover:bg-gray-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {banner.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => openModal(banner)}
                    className="px-4 py-2 border-2 border-black rounded-full font-medium hover:bg-black hover:text-white transition-all flex items-center gap-2"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="px-4 py-2 border-2 border-red-500 rounded-full font-medium text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Banner Modal */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[990]" onClick={closeModal} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-[999]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {editingBanner ? 'Edit Banner' : 'Add New Banner'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Banner Type *</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Banner['type'] }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="hero-main">Hero Main</option>
                  <option value="hero-side">Hero Side</option>
                  <option value="casual-inspiration">Casual Inspiration</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="New Collection"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subtitle *</label>
                <input
                  type="text"
                  required
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Explore our latest premium fabrics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image URL *</label>
                
                {/* Google Drive Picker Toggle */}
                <button
                  type="button"
                  onClick={() => setShowGoogleDrivePicker(!showGoogleDrivePicker)}
                  className="w-full mb-3 px-4 py-2 border-2 border-blue-300 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-blue-700 text-sm"
                >
                  {showGoogleDrivePicker ? '← Hide Google Drive' : '☁️ Add from Google Drive'}
                </button>

                {/* Google Drive Picker */}
                {showGoogleDrivePicker && (
                  <div className="mb-3">
                    <GoogleDrivePicker
                      onSelect={(urls) => {
                        if (urls && urls.length > 0) {
                          setFormData(prev => ({ ...prev, image: urls[0] }));
                          setShowGoogleDrivePicker(false);
                        }
                      }}
                      multiple={false}
                    />
                  </div>
                )}

                {/* Manual URL Input */}
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="https://example.com/banner.jpg or Google Drive URL"
                />
                {formData.image && (
                  <div className="mt-3 aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
                    <img src={convertGoogleDriveLink(formData.image)} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Button Text *</label>
                  <input
                    type="text"
                    required
                    value={formData.buttonText}
                    onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Shop Now"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Link *</label>
                  <input
                    type="text"
                    required
                    value={formData.link}
                    onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="/shop"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Order *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-black"
                    />
                    <span className="font-medium">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border-2 border-gray-300 px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-all"
                >
                  {editingBanner ? 'Update Banner' : 'Add Banner'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
