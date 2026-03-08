import { useState } from 'react';
import { Plus, Search, Edit, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { convertGoogleDriveLink } from '../../../lib/googleDriveUtils';
import { GoogleDrivePicker } from '../../components/GoogleDrivePicker';

export default function AdminProducts() {
  const { products, categories, createProduct, updateProduct, deleteProduct: deleteProductDB } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<typeof products[0] | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [showGoogleDrivePicker, setShowGoogleDrivePicker] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    offerPercentage: '',
    images: '',
    category: '',
    subCategory: '',
    description: '',
    sku: '',
    quantity: '',
    fabricType: '',
    careInstructions: '',
    colors: '',
    features: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      offerPercentage: '',
      images: '',
      category: '',
      subCategory: '',
      description: '',
      sku: '',
      quantity: '',
      fabricType: '',
      careInstructions: '',
      colors: '',
      features: ''
    });
    setEditingProduct(null);
  };

  // Resize image to 1080x1080 pixels (square)
  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas for resizing
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }

          // Set square dimensions
          const targetSize = 1080;
          canvas.width = targetSize;
          canvas.height = targetSize;

          // Calculate dimensions to crop to square first
          const sourceSize = Math.min(img.width, img.height);
          const sourceX = (img.width - sourceSize) / 2;
          const sourceY = (img.height - sourceSize) / 2;

          // Draw image centered and cropped to square, then scaled to 1080x1080
          ctx.drawImage(
            img,
            sourceX, sourceY, sourceSize, sourceSize, // source (crop to square)
            0, 0, targetSize, targetSize // destination (1080x1080)
          );

          // Convert canvas to base64 string
          const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
          resolve(resizedDataUrl);
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  // Handle image file upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);

    try {
      const resizedImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Check if it's an image
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not an image file`);
          continue;
        }

        // Resize image to 1080x1080
        const resizedDataUrl = await resizeImage(file);
        resizedImages.push(resizedDataUrl);
      }

      // Add new images to existing ones
      const currentImages = formData.images ? formData.images.split(',').map(img => img.trim()).filter(Boolean) : [];
      const allImages = [...currentImages, ...resizedImages];
      setFormData(prev => ({ ...prev, images: allImages.join(', ') }));
      
    } catch (error) {
      alert('Error uploading images: ' + (error as Error).message);
    } finally {
      setUploadingImages(false);
    }
  };

  // Handle Google Drive image selection
  const handleGoogleDriveImages = (urls: string[]) => {
    if (!urls || urls.length === 0) return;

    // Add new images to existing ones
    const currentImages = formData.images ? formData.images.split(',').map(img => img.trim()).filter(Boolean) : [];
    const allImages = [...currentImages, ...urls];
    setFormData(prev => ({ ...prev, images: allImages.join(', ') }));
    
    // Reset state
    setShowGoogleDrivePicker(false);
  };

  const openModal = (product?: typeof products[0]) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        offerPercentage: product.offerPercentage?.toString() || '0',
        images: product.images.join(', '),
        category: product.category,
        subCategory: product.subCategory,
        description: product.description,
        sku: product.sku,
        quantity: product.quantity.toString(),
        fabricType: product.fabricType || '',
        careInstructions: product.careInstructions || '',
        colors: product.colors?.join(', ') || '',
        features: product.features?.join(', ') || ''
      });
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      offerPercentage: parseFloat(formData.offerPercentage) || 0,
      quantity: parseInt(formData.quantity),
      category: formData.category,
      subCategory: formData.subCategory,
      fabricType: formData.fabricType,
      careInstructions: formData.careInstructions,
      description: formData.description,
      sku: formData.sku,
      images: formData.images.split(',').map(img => img.trim()).filter(Boolean),
      colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean),
      features: formData.features.split(',').map(f => f.trim()).filter(Boolean)
    };

    if (editingProduct) {
      updateProduct(editingProduct._id, productData);
    } else {
      createProduct(productData);
    }
    
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProductDB(id);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCategory = categories.find(c => c._id === formData.category);

  // Calculate discounted price
  const calculateDiscountedPrice = (price: number, offerPercentage: number) => {
    return price - (price * offerPercentage / 100);
  };

  // Get image preview URLs
  const getImagePreviews = () => {
    return formData.images.split(',').map(img => img.trim()).filter(Boolean);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Products</h1>
          <p className="text-lg opacity-70">{products.length} total products</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const discountedPrice = calculateDiscountedPrice(product.price, product.offerPercentage);
          return (
            <div key={product._id} className="bg-white rounded-2xl overflow-hidden">
              <div className="aspect-square bg-gray-100">
                <img src={convertGoogleDriveLink(product.images[0])} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
                <p className="text-sm opacity-70 mb-3">SKU: {product.sku}</p>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-2xl font-bold">₹{discountedPrice.toFixed(2)}</span>
                  {product.offerPercentage > 0 && (
                    <>
                      <span className="text-sm opacity-50 line-through">₹{product.price}</span>
                      <span className="text-sm text-green-600 font-medium">-{product.offerPercentage}%</span>
                    </>
                  )}
                </div>
                <p className="text-sm opacity-70 mb-4">Stock: {product.quantity}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(product)}
                    className="flex-1 border-2 border-blue-600 px-4 py-2 rounded-full font-medium hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="w-10 h-10 border-2 border-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-magenta-950/50 z-[990]" onClick={closeModal} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto z-[999]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Offer Percentage (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.offerPercentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, offerPercentage: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value, subCategory: '' }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="">Select Category</option>
                    {categories.filter(cat => cat.isActive).map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sub Category *</label>
                  <select
                    required
                    value={formData.subCategory}
                    onChange={(e) => setFormData(prev => ({ ...prev, subCategory: e.target.value }))}
                    disabled={!formData.category}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                  >
                    <option value="">Select Sub Category</option>
                    {selectedCategory?.subCategories.map(sub => (
                      <option key={sub.slug} value={sub.slug}>{sub.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Fabric Type</label>
                  <input
                    type="text"
                    value={formData.fabricType}
                    onChange={(e) => setFormData(prev => ({ ...prev, fabricType: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Care Instructions</label>
                  <input
                    type="text"
                    value={formData.careInstructions}
                    onChange={(e) => setFormData(prev => ({ ...prev, careInstructions: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="e.g., Dry clean only. Iron on low heat."
                  />
                </div>

                {/* Image Upload Section */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Product Images * (Auto-resized to 1080x1080)
                  </label>
                  
                  {/* File Upload Button */}
                  <div className="mb-4">
                    <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-magenta-950 hover:bg-gray-50 cursor-pointer transition-all">
                      <Upload size={20} />
                      <span>{uploadingImages ? 'Processing...' : 'Upload Images'}</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImages}
                      />
                    </label>
                    <p className="text-xs opacity-60 mt-2">
                      All images will be automatically cropped and resized to 1080x1080 pixels (square)
                    </p>
                  </div>

                  {/* Google Drive Picker Button */}
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={() => setShowGoogleDrivePicker(!showGoogleDrivePicker)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-blue-300 border-dashed rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-blue-700"
                    >
                      <ImageIcon size={20} />
                      {showGoogleDrivePicker ? 'Hide Google Drive' : 'Add from Google Drive'}
                    </button>
                  </div>

                  {/* Google Drive Picker Component */}
                  {showGoogleDrivePicker && (
                    <div className="mb-4">
                      <GoogleDrivePicker
                        onSelect={handleGoogleDriveImages}
                        multiple={true}
                        disabled={uploadingImages}
                      />
                    </div>
                  )}

                  {/* Image Previews */}
                  {getImagePreviews().length > 0 && (
                    <div className="grid grid-cols-3 gap-3 mb-3">
                      {getImagePreviews().map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                          <img src={convertGoogleDriveLink(img)} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const images = getImagePreviews();
                              images.splice(index, 1);
                              setFormData(prev => ({ ...prev, images: images.join(', ') }));
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-all"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium mb-2 opacity-70">
                      Or add image URLs manually (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.images}
                      onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg, or Google Drive links"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Colors (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData(prev => ({ ...prev, colors: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="red, blue, green, natural"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Features (comma-separated)
                    <span className="text-xs opacity-70 ml-2">Add product highlights and key features</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.features}
                    onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="100% Pure Silk, Natural Sheen, Highly Breathable, Hypoallergenic, Easy Care"
                  />
                  <p className="text-xs opacity-60 mt-1">
                    💡 Tip: Each feature separated by comma will appear as a bullet point on the product page
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
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
                  disabled={uploadingImages}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
