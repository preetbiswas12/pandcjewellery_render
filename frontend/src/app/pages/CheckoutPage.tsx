import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useUser } from '@clerk/clerk-react';
import { useApp } from '../context/AppContext';
import { config } from '../config/env';
import { initiateBackendRazorpayPayment, formatCurrency } from '../services/razorpay';
import { calculateShippingCharge, validatePincodeFormat } from '../services/shiprocket';
import { Loader2 } from 'lucide-react';
import { NoiseButton } from '@/components/ui/noise-button';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { cartItems, clearCart, createOrder, validateCoupon } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Shipping states
  const [shippingCost, setShippingCost] = useState<number>(config.shipping.standardCost);
  const [shippingMessage, setShippingMessage] = useState<string>('');
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingAvailable, setShippingAvailable] = useState(true);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  useEffect(() => {
    if (isLoaded && user) {
      const firstName = user.firstName || '';
      const lastName = user.lastName || '';
      const email = user.emailAddresses[0]?.emailAddress || '';
      setFormData(prev => ({
        ...prev,
        firstName,
        lastName,
        email,
      }));
    }
  }, [isLoaded, user]);

  // Calculate totals and costs (must be before useEffect that uses them)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);
  const shipping = shippingCost;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const tax = (subtotal - discount) * config.tax.rate;
  const total = subtotal - discount + shipping + tax;

  // Calculate shipping when zipCode changes
  useEffect(() => {
    const calculateShipping = async () => {
      const zipCode = formData.zipCode?.trim();
      
      // If no zipCode, clear shipping
      if (!zipCode) {
        setShippingCost(0);
        setShippingMessage('Enter pincode to calculate shipping');
        setShippingAvailable(false);
        return;
      }

      // If invalid format, show error
      if (!validatePincodeFormat(zipCode)) {
        setShippingCost(0);
        setShippingMessage('Invalid pincode format (6 digits required)');
        setShippingAvailable(false);
        return;
      }

      setIsCalculatingShipping(true);
      try {
        // Calculate weight (rough estimate: 500g per item for clothing)
        const totalItems = cartItems.reduce((sum, item) => sum + item.cartQuantity, 0);
        const estimatedWeight = Math.max(0.5, totalItems * 0.5); // At least 0.5kg

        const result = await calculateShippingCharge(zipCode, estimatedWeight, subtotal);

        if (result.available) {
          setShippingCost(result.cost);
          setShippingMessage(result.message);
          setShippingAvailable(true);
        } else {
          // Location not serviceable
          setShippingCost(0);
          setShippingMessage(result.message || 'Shipping not available in this area');
          setShippingAvailable(false);
        }
      } catch (error) {
        console.error('Shipping calculation error:', error);
        setShippingCost(0);
        setShippingMessage('Unable to calculate shipping. Please try again.');
        setShippingAvailable(false);
      } finally {
        setIsCalculatingShipping(false);
      }
    };

    const debounceTimer = setTimeout(calculateShipping, 1000); // Debounce by 1 second
    return () => clearTimeout(debounceTimer);
  }, [formData.zipCode, cartItems, subtotal]);

  const handleApplyCoupon = () => {
    setCouponError('');
    const result = validateCoupon(couponCode, subtotal);
    
    if (result.valid && result.coupon) {
      let discountAmount = 0;
      if (result.coupon.discountType === 'percentage') {
        discountAmount = (subtotal * result.coupon.discountValue) / 100;
        if (result.coupon.maxDiscount) {
          discountAmount = Math.min(discountAmount, result.coupon.maxDiscount);
        }
      } else {
        discountAmount = result.coupon.discountValue;
      }
      
      setAppliedCoupon({ code: result.coupon.code, discount: discountAmount });
    } else {
      setCouponError(result.error || 'Invalid coupon');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isProcessing || cartItems.length === 0) return;
    
    // Validate form data
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    for (const field of requiredFields) {
      const value = formData[field as keyof typeof formData];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        alert(`${field} is required`);
        return;
      }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Validate phone format (basic check for 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }
    
    // Validate zipcode format
    if (!/^\d{6}$/.test(formData.zipCode)) {
      alert('Please enter a valid 6-digit zipcode');
      return;
    }
    
    setIsProcessing(true);

    try {
      // Initiate backend Razorpay payment
      await initiateBackendRazorpayPayment({
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        items: cartItems.map(item => ({
          productId: item.id,
          productName: item.name,
          sku: item.sku,
          quantity: item.cartQuantity,
          price: item.price,
          image: item.images[0]
        })),
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        subtotal,
        discount,
        shipping,
        tax,
        total,
        couponCode: appliedCoupon?.code,
        onSuccess: (orderId: string) => {
          // Payment successful - Order already created on backend
          // Save customer email for order tracking
          localStorage.setItem('customerEmail', formData.email);

          // Clear cart
          clearCart();

          // Navigate to order confirmation
          navigate(`/order-confirmation/${orderId}?payment=success`);
          
          setIsProcessing(false);
        },
        onFailure: async (error) => {
          console.error('Payment failed:', error);
          
          // Check if it's a configuration error
          if (error.message?.includes('not configured')) {
            const shouldContinue = window.confirm(
              '⚠️ Razorpay is not configured!\n\n' +
              'To enable real payments:\n' +
              '1. Get your API key from https://razorpay.com\n' +
              '2. Add VITE_RAZORPAY_KEY_ID to your .env file\n' +
              '3. Restart the server\n\n' +
              'Click OK to continue without payment (DEMO MODE) or Cancel to go back.'
            );
            
            if (shouldContinue) {
              // Demo mode - create order without payment via backend
              const demoOrder = await createOrder({
                customerName: `${formData.firstName} ${formData.lastName}`,
                customerEmail: formData.email,
                customerPhone: formData.phone,
                shippingAddress: {
                  street: formData.address,
                  city: formData.city,
                  state: formData.state,
                  zipCode: formData.zipCode,
                  country: formData.country
                },
                items: cartItems.map(item => ({
                  productId: item.id,
                  productName: item.name,
                  sku: item.sku,
                  quantity: item.cartQuantity,
                  price: item.price,
                  image: item.images[0]
                })),
                subtotal,
                discount,
                shipping,
                total,
                couponCode: appliedCoupon?.code,
                status: 'pending', // Pending since no payment
                paymentStatus: 'pending' // Pending payment
              });

              // Save customer email for order tracking
              localStorage.setItem('customerEmail', formData.email);

              clearCart();
              navigate(`/order-confirmation/${demoOrder._id}?demo=true`);
            }
          } else {
            alert(`Payment failed: ${error.message || error.description || 'Please try again'}`);
          }
          
          setIsProcessing(false);
        },
        onDismiss: () => {
          setIsProcessing(false);
        }
      });
    } catch (error) {
      console.error('Payment initiation error:', error);
      alert('Failed to initiate payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-12 max-w-md text-center space-y-6">
          <h1 className="text-3xl font-bold">Sign In Required</h1>
          <p className="text-gray-600">You need to be logged in to place an order.</p>
          <NoiseButton 
            onClick={() => navigate('/sign-in')}
            containerClassName="w-full"
          >
            Sign In
          </NoiseButton>
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <NoiseButton
              onClick={() => navigate('/sign-up')}
              containerClassName="w-fit inline"
            >
              Sign Up
            </NoiseButton>
          </p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-[60px] py-8 md:py-12">
        <h1 className="text-4xl md:text-5xl tracking-tight mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8">
          {/* Checkout Form */}
          <div className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-3xl p-8">
              <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-3xl p-8">
              <h2 className="text-2xl font-semibold mb-6">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Zip Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      required
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="6-digit pincode"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    {/* Shipping Status - Only show after calculation */}
                    {!isCalculatingShipping && (
                      <div className="mt-3 text-sm">
                        {!formData.zipCode && (
                          <p className="text-gray-500">{shippingMessage}</p>
                        )}
                        {formData.zipCode && !validatePincodeFormat(formData.zipCode) && (
                          <p className="text-red-600">{shippingMessage}</p>
                        )}
                        {formData.zipCode && validatePincodeFormat(formData.zipCode) && shippingAvailable && (
                          <p className="text-green-600 font-medium">{shippingMessage}</p>
                        )}
                        {formData.zipCode && validatePincodeFormat(formData.zipCode) && !shippingAvailable && (
                          <p className="text-red-600">{shippingMessage}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Country *</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="India">India</option>
                      <option value="USA">USA</option>
                      <option value="UK">UK</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Coupon Code */}
            <div className="bg-white rounded-3xl p-8">
              <h2 className="text-2xl font-semibold mb-6">Coupon Code</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Enter Coupon Code</label>
                  <input
                    type="text"
                    name="couponCode"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="w-full bg-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition-all"
                >
                  Apply Coupon
                </button>
                {couponError && <p className="text-red-500 text-sm">{couponError}</p>}
                {appliedCoupon && (
                  <p className="text-green-500 text-sm">
                    Coupon applied: {appliedCoupon.code} - ₹{appliedCoupon.discount.toFixed(2)} discount
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Processing Payment...
                </>
              ) : (
                'Proceed to Payment'
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
          <div className="lg:sticky lg:top-4 h-fit">
            <div className="bg-white rounded-3xl p-8 space-y-6">
              <h2 className="text-2xl font-semibold">Order Summary</h2>
              
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm opacity-70">Qty (m): {item.cartQuantity}</p>
                    </div>
                    <p className="font-medium">₹{(item.price * item.cartQuantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="opacity-70">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                
                {/* Show charges only if valid pincode is provided */}
                {formData.zipCode && validatePincodeFormat(formData.zipCode) && (
                  <>
                    {shippingAvailable && shipping > 0 && (
                      <div className="flex justify-between">
                        <span className="opacity-70">Shipping</span>
                        <span className="font-medium">₹{shipping.toFixed(2)}</span>
                      </div>
                    )}
                    {discount > 0 && (
                      <div className="flex justify-between">
                        <span className="opacity-70">Discount</span>
                        <span className="font-medium">-₹{discount.toFixed(2)}</span>
                      </div>
                    )}
                    {tax > 0 && (
                      <div className="flex justify-between">
                        <span className="opacity-70">Tax</span>
                        <span className="font-medium">₹{tax.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t pt-3 flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </>
                )}
                
                {/* If no valid pincode, show message */}
                {(!formData.zipCode || !validatePincodeFormat(formData.zipCode)) && (
                  <div className="pt-3 text-sm text-gray-500 text-center">
                    Enter a valid pincode to see shipping & taxes
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}