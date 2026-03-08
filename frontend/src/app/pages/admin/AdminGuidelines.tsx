import { FileText, AlertCircle, CheckCircle, Edit2, Plus, Trash2, Image, Settings } from 'lucide-react';

export default function AdminGuidelines() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Admin Guidelines</h1>
        <p className="text-lg opacity-70">Complete guidelines for moderators and administrators of P&C Jewellery shop</p>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 flex gap-4">
        <AlertCircle size={24} className="text-amber-600 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-bold text-amber-900 mb-1">Important: Admin Responsibilities</h3>
          <p className="text-amber-800">As an admin/moderator, you are responsible for maintaining the integrity of the shop. Please follow all guidelines carefully and ensure all product information is accurate, complete, and professional.</p>
        </div>
      </div>

      {/* Contact Information */}
      <section className="bg-white rounded-2xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Settings size={24} />
          Contact & Support
        </h2>
        <div className="space-y-3">
          <p><strong>Business Email:</strong> <code className="bg-gray-100 px-3 py-1 rounded">pandctexfab@gmail.com</code></p>
          <p><strong>Business Phone:</strong> <code className="bg-gray-100 px-3 py-1 rounded">+91 7044457914</code></p>
          <p><strong>Business Address:</strong> P&C Jewellery, India</p>
          <p className="text-sm opacity-70 mt-4">Use the business email for all customer communications and support inquiries.</p>
        </div>
      </section>

      {/* Categories Management */}
      <section className="bg-white rounded-2xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Settings size={24} />
          Category Management
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <CheckCircle size={18} className="text-green-600" />
              How Categories Work
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Categories are the primary product classification (e.g., Dyeable Fabrics, Printed Fabrics)</li>
              <li>Each category has multiple sub-categories for detailed organization</li>
              <li>Categories can be toggled active/inactive without deletion</li>
              <li>Changes to categories immediately reflect across:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>Product adding form dropdown</li>
                  <li>Trending section filter buttons</li>
                  <li>Navbar mobile menu categories</li>
                  <li>Shop page category filter</li>
                </ul>
              </li>
            </ul>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm"><strong>Pro Tip:</strong> Use the AdminCategories page to create, edit, or toggle category visibility. Deactivating a category hides it from customers while preserving all associated products.</p>
          </div>
        </div>
      </section>

      {/* Products Management */}
      <section className="bg-white rounded-2xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Plus size={24} />
          Product Management
        </h2>

        <div className="space-y-6">
          {/* Adding Products */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg">
              <Plus size={20} className="text-green-600" />
              Adding Products
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li><strong>Click "Add Product"</strong> button on AdminProducts page</li>
                <li><strong>Fill required fields:</strong>
                  <ul className="list-disc list-inside ml-6 mt-1">
                    <li>Product Name (must be descriptive)</li>
                    <li>SKU (unique identifier, no spaces)</li>
                    <li>Price in ₹ (Indian Rupees)</li>
                    <li>Category & Sub-Category</li>
                    <li>Quantity (stock available)</li>
                  </ul>
                </li>
                <li><strong>Upload Images:</strong> Click "Upload Images" or "Add from Google Drive"</li>
                <li><strong>Optional Fields:</strong> Offer %, Fabric Type, Care Instructions, Colors, Features</li>
                <li><strong>Review</strong> all details before saving</li>
              </ol>
            </div>
          </div>

          {/* Image Guidelines */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg">
              <Image size={20} className="text-blue-600" />
              Image Upload Guidelines
            </h3>
            <div className="bg-blue-50 rounded-lg p-4 space-y-3">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Auto-resize:</strong> All images automatically crop and resize to 1080x1080px (square)</li>
                <li><strong>Multiple images:</strong> Upload multiple product angles/colors in one go</li>
                <li><strong>First image:</strong> Shows as product thumbnail in listings</li>
                <li><strong>Format:</strong> JPG, PNG recommended (under 5MB each)</li>
                <li><strong>Quality:</strong> Keep high quality for professional appearance</li>
                <li><strong>Background:</strong> Use consistent white or neutral background for best results</li>
              </ul>
              <div className="mt-3 p-3 bg-white border border-blue-200 rounded">
                <p className="text-sm"><strong>Google Drive Method:</strong></p>
                <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
                  <li>Right-click image in Google Drive → Open with → Google Photos</li>
                  <li>Click Share button → Change to "Anyone with link" → Copy link</li>
                  <li>In product form, click "Add from Google Drive"</li>
                  <li>Paste link → Click "Convert Link" → Preview → Click "Add Image"</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Editing Products */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg">
              <Edit2 size={20} className="text-purple-600" />
              Editing Products
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-gray-700">
              <p>1. Find the product in the products grid</p>
              <p>2. Click the blue <strong>"Edit"</strong> button on the product card</p>
              <p>3. Modify any field (all fields are editable)</p>
              <p>4. Add additional images if needed</p>
              <p>5. Click "Save" to update</p>
              <p className="text-sm opacity-70 mt-3">💡 <strong>Tip:</strong> You can edit prices, stock quantity, offers, and descriptions anytime without losing data.</p>
            </div>
          </div>

          {/* Deleting Products */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg">
              <Trash2 size={20} className="text-red-600" />
              Deleting Products
            </h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
              <p className="text-gray-700">1. Find the product in the grid</p>
              <p className="text-gray-700">2. Click the red trash icon <Trash2 size={16} className="inline text-red-600" /> on the product card</p>
              <p className="text-gray-700">3. Confirm deletion in the popup (⚠️ <strong>This cannot be undone</strong>)</p>
              <p className="text-sm text-red-700 font-semibold mt-3">⚠️ WARNING: Deleted products cannot be recovered. Only delete if you're certain.</p>
            </div>
          </div>

          {/* Product Fields Reference */}
          <div>
            <h3 className="font-semibold mb-3 text-lg">Product Fields Reference</h3>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gray-100 rounded p-3">
                  <p className="font-semibold">Product Name</p>
                  <p className="text-gray-600">Descriptive name of the product (required)</p>
                </div>
                <div className="bg-gray-100 rounded p-3">
                  <p className="font-semibold">SKU (Stock Keeping Unit)</p>
                  <p className="text-gray-600">Unique identifier, e.g., "SILK-001" (required)</p>
                </div>
                <div className="bg-gray-100 rounded p-3">
                  <p className="font-semibold">Price</p>
                  <p className="text-gray-600">Price in Indian Rupees (₹) (required)</p>
                </div>
                <div className="bg-gray-100 rounded p-3">
                  <p className="font-semibold">Offer Percentage</p>
                  <p className="text-gray-600">Discount percentage (0-100%), shows discount badge</p>
                </div>
                <div className="bg-gray-100 rounded p-3">
                  <p className="font-semibold">Category & Sub-Category</p>
                  <p className="text-gray-600">Classification for filtering and organization (required)</p>
                </div>
                <div className="bg-gray-100 rounded p-3">
                  <p className="font-semibold">Quantity</p>
                  <p className="text-gray-600">Available stock count (required)</p>
                </div>
                <div className="bg-gray-100 rounded p-3">
                  <p className="font-semibold">Fabric Type</p>
                  <p className="text-gray-600">Material composition (e.g., 100% Silk, Cotton Blend)</p>
                </div>
                <div className="bg-gray-100 rounded p-3">
                  <p className="font-semibold">Care Instructions</p>
                  <p className="text-gray-600">Cleaning and maintenance tips (e.g., "Dry clean only")</p>
                </div>
                <div className="bg-gray-100 rounded p-3">
                  <p className="font-semibold">Colors</p>
                  <p className="text-gray-600">Comma-separated list (e.g., "Natural, Ivory, White")</p>
                </div>
                <div className="bg-gray-100 rounded p-3">
                  <p className="font-semibold">Features</p>
                  <p className="text-gray-600">Comma-separated highlights (e.g., "Breathable, Anti-shrink")</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banners Management */}
      <section className="bg-white rounded-2xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Image size={24} />
          Banner Management
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Plus size={18} className="text-green-600" />
              Adding Banners
            </h3>
            <ol className="list-decimal list-inside space-y-2 bg-gray-50 rounded-lg p-4 text-gray-700">
              <li>Go to <strong>Admin Dashboard → Banners</strong></li>
              <li>Click <strong>"Add Banner"</strong> button</li>
              <li>Upload banner image (recommended: 1920x400px or wider)</li>
              <li>Add title/text to display on banner (optional)</li>
              <li>Set link destination (e.g., /shop or product page) (optional)</li>
              <li>Add button text if using link (e.g., "Shop Now")</li>
              <li>Click <strong>"Save Banner"</strong></li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Edit2 size={18} className="text-purple-600" />
              Editing Banners
            </h3>
            <div className="space-y-2 bg-gray-50 rounded-lg p-4 text-gray-700">
              <p>1. Find banner in the banners list</p>
              <p>2. Click <strong>"Edit"</strong> button</p>
              <p>3. Change image, title, link, or button text</p>
              <p>4. Save changes</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Trash2 size={18} className="text-red-600" />
              Deleting Banners
            </h3>
            <div className="space-y-2 bg-red-50 border border-red-200 rounded-lg p-4 text-gray-700">
              <p>1. Find banner in the list</p>
              <p>2. Click red trash icon</p>
              <p>3. Confirm deletion</p>
              <p className="text-sm text-red-700 font-semibold mt-2">💡 Tip: You can have multiple banners displayed in sequence on the homepage.</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm"><strong>Banner Image Best Practices:</strong></p>
            <ul className="list-disc list-inside text-sm mt-2 space-y-1 text-gray-700">
              <li>Size: 1920x400px or larger (wider aspect ratios work best)</li>
              <li>Format: JPG or PNG</li>
              <li>Include text/graphics directly in image (more reliable than overlay text)</li>
              <li>Use high-quality, professional images</li>
              <li>Keep file under 2MB for faster loading</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Coupons & Offers */}
      <section className="bg-white rounded-2xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <CheckCircle size={24} />
          Coupons & Promotional Offers
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>Coupons allow you to offer discounts to customers:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>Create coupon codes (e.g., "WELCOME10", "SUMMER20")</li>
            <li>Set discount type (percentage or fixed amount)</li>
            <li>Set minimum order value requirement</li>
            <li>Set usage limits (max uses per customer, total uses)</li>
            <li>Set expiration date</li>
            <li>Customers apply code at checkout</li>
          </ul>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <p className="text-sm"><strong>💡 Best Practice:</strong> Use coupons for seasonal promotions, new customer acquisition, and clearing old inventory.</p>
          </div>
        </div>
      </section>

      {/* Orders Management */}
      <section className="bg-white rounded-2xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <CheckCircle size={24} />
          Order Management
        </h2>
        <div className="space-y-4 text-gray-700">
          <p>Track and manage all customer orders:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>View all orders with customer details and payment status</li>
            <li>See product details, quantities, and total amounts</li>
            <li>Update order status (Pending, Processing, Shipped, Delivered)</li>
            <li>Add shipping tracking information</li>
            <li>Handle refunds and cancellations</li>
            <li>Export order data for accounting</li>
          </ul>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
            <p className="text-sm"><strong>Important:</strong> Always update order status promptly and keep customers informed about their shipments via email.</p>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="bg-white rounded-2xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <CheckCircle size={24} />
          Best Practices & Important Rules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
            <h3 className="font-semibold mb-2 text-green-900">✓ DO:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>Keep product descriptions accurate</li>
              <li>Use professional, high-quality images</li>
              <li>Update stock quantities regularly</li>
              <li>Respond to customers promptly</li>
              <li>Use proper SKU naming conventions</li>
              <li>Double-check prices before saving</li>
              <li>Keep fabric type/care info accurate</li>
              <li>Use consistent categorization</li>
            </ul>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
            <h3 className="font-semibold mb-2 text-red-900">✗ DON'T:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>Upload low-quality or blurry images</li>
              <li>Use misleading product descriptions</li>
              <li>Set incorrect prices intentionally</li>
              <li>Delete products without backup info</li>
              <li>Create duplicate product entries</li>
              <li>Ignore customer complaints</li>
              <li>Use poor grammar/spelling in descriptions</li>
              <li>Overstock without demand analysis</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm"><strong>Quality Assurance:</strong> Before publishing a product, check: accurate price, quality images, proper category, complete description, correct stock quantity.</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm"><strong>Customer Communication:</strong> Always respond to customer emails within 24 hours. Use the business email: <code>pandctexfab@gmail.com</code></p>
          </div>
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <p className="text-sm"><strong>Regular Maintenance:</strong> Weekly: check for low stock items. Monthly: review popular products and slow sellers. Quarterly: audit product descriptions and images.</p>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="bg-white rounded-2xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <AlertCircle size={24} />
          Troubleshooting
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-amber-700 mb-2">❓ "Google Drive image not loading"</h3>
            <p className="text-gray-700 text-sm mb-2">Make sure the Google Drive file is shared with "Anyone with link" access. Test the image URL directly in browser.</p>
          </div>

          <div>
            <h3 className="font-semibold text-amber-700 mb-2">❓ "Category not showing in product form"</h3>
            <p className="text-gray-700 text-sm mb-2">Check if the category is set to Active. Inactive categories are hidden from forms.</p>
          </div>

          <div>
            <h3 className="font-semibold text-amber-700 mb-2">❓ "Products not appearing in shop"</h3>
            <p className="text-gray-700 text-sm mb-2">Verify the category is active and product quantity is greater than 0. Check that the product is saved successfully.</p>
          </div>

          <div>
            <h3 className="font-semibold text-amber-700 mb-2">❓ "Image not uploading"</h3>
            <p className="text-gray-700 text-sm mb-2">Check file size (must be under 5MB), format (JPG/PNG), and internet connection. Try a different browser if issue persists.</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
            <p className="text-sm"><strong>Still having issues?</strong> Contact support at <code>pandctexfab@gmail.com</code> with a detailed description and screenshots.</p>
          </div>
        </div>
      </section>

      {/* Contact & Legal */}
      <section className="bg-magenta-900 text-white rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
        <div className="space-y-3">
          <p><strong>Email:</strong> pandctexfab@gmail.com</p>
          <p><strong>Phone:</strong> +91 7044457914</p>
          <p className="text-gray-300 text-sm mt-4">Last Updated: March 7, 2026 | Version 2.0</p>
        </div>
      </section>
    </div>
  );
}
