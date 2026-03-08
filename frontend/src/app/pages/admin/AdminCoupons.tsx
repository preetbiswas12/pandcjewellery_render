import { useState } from 'react';
import { Plus, Edit, Trash2, X, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Coupon } from '../../services/database';

export default function AdminCoupons() {
  const { coupons, createCoupon, updateCoupon, deleteCoupon: deleteCouponDB } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    minOrderValue: '',
    maxDiscount: '',
    validFrom: '',
    validTo: '',
    usageLimit: '',
    isActive: true
  });

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      minOrderValue: '',
      maxDiscount: '',
      validFrom: '',
      validTo: '',
      usageLimit: '',
      isActive: true
    });
    setEditingCoupon(null);
  };

  const openModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue.toString(),
        minOrderValue: coupon.minOrderValue.toString(),
        maxDiscount: coupon.maxDiscount?.toString() || '',
        validFrom: coupon.validFrom.split('T')[0],
        validTo: coupon.validTo.split('T')[0],
        usageLimit: coupon.usageLimit.toString(),
        isActive: coupon.isActive
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
    
    const couponData = {
      code: formData.code.toUpperCase(),
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue),
      minOrderValue: parseFloat(formData.minOrderValue),
      maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : undefined,
      validFrom: new Date(formData.validFrom).toISOString(),
      validTo: new Date(formData.validTo).toISOString(),
      usageLimit: parseInt(formData.usageLimit),
      isActive: formData.isActive
    };

    if (editingCoupon) {
      updateCoupon(editingCoupon._id, couponData);
    } else {
      createCoupon(couponData);
    }
    
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      deleteCouponDB(id);
    }
  };

  const toggleActive = (coupon: Coupon) => {
    updateCoupon(coupon._id, { isActive: !coupon.isActive });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Coupons</h1>
          <p className="text-lg opacity-70">{coupons.length} total coupons</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Add Coupon
        </button>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => {
          const isExpired = new Date(coupon.validTo) < new Date();
          const isNotYetValid = new Date(coupon.validFrom) > new Date();
          const usagePercentage = (coupon.usedCount / coupon.usageLimit) * 100;

          return (
            <div key={coupon._id} className="bg-white rounded-2xl p-6 relative">
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                {!coupon.isActive ? (
                  <span className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-medium">
                    Inactive
                  </span>
                ) : isExpired ? (
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    Expired
                  </span>
                ) : isNotYetValid ? (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    Upcoming
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Active
                  </span>
                )}
              </div>

              {/* Coupon Code */}
              <div className="mb-4 pr-20">
                <div className="flex items-center gap-2 mb-2">
                  <Tag size={20} className="opacity-50" />
                  <h3 className="text-2xl font-bold font-mono">{coupon.code}</h3>
                </div>
                <p className="text-sm opacity-70">
                  {coupon.discountType === 'percentage' 
                    ? `${coupon.discountValue}% off` 
                    : `₹${coupon.discountValue} off`}
                  {coupon.maxDiscount && coupon.discountType === 'percentage' && 
                    ` (max ₹${coupon.maxDiscount})`
                  }
                </p>
              </div>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <p className="text-sm">
                  <span className="opacity-70">Min. Order:</span>{' '}
                  <span className="font-medium">₹{coupon.minOrderValue}</span>
                </p>
                <p className="text-sm">
                  <span className="opacity-70">Valid:</span>{' '}
                  <span className="font-medium">
                    {new Date(coupon.validFrom).toLocaleDateString()} - {new Date(coupon.validTo).toLocaleDateString()}
                  </span>
                </p>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="opacity-70">Usage:</span>
                    <span className="font-medium">{coupon.usedCount} / {coupon.usageLimit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-magenta-950 rounded-full h-2 transition-all"
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleActive(coupon)}
                  className={`flex-1 px-4 py-2 rounded-full font-medium transition-all ${
                    coupon.isActive
                      ? 'bg-gray-100 hover:bg-gray-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {coupon.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => openModal(coupon)}
                  className="w-10 h-10 border-2 border-blue-600 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(coupon._id)}
                  className="w-10 h-10 border-2 border-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Coupon Modal */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-magenta-950/50 z-[990]" onClick={closeModal} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto z-[999]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-mono"
                    placeholder="SAVE10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Discount Type *</label>
                  <select
                    required
                    value={formData.discountType}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value as 'percentage' | 'fixed' }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Discount Value * {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    max={formData.discountType === 'percentage' ? '100' : undefined}
                    value={formData.discountValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, discountValue: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Min Order Value (₹) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, minOrderValue: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {formData.discountType === 'percentage' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Discount (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxDiscount: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Valid From *</label>
                  <input
                    type="date"
                    required
                    value={formData.validFrom}
                    onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Valid To *</label>
                  <input
                    type="date"
                    required
                    value={formData.validTo}
                    onChange={(e) => setFormData(prev => ({ ...prev, validTo: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Usage Limit *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData(prev => ({ ...prev, usageLimit: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div className="md:col-span-2">
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
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all"
                >
                  {editingCoupon ? 'Update Coupon' : 'Add Coupon'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
