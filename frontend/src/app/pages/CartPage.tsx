import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { config } from '../config/env';
import { NoiseButton } from '@/components/ui/noise-button';

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart } = useApp();
  const pageRef = useRef<HTMLDivElement>(null);

  // ⚠️ FIXED: Apply discount percentage to each item's price when calculating subtotal
  const getDiscountedPrice = (price: number, offerPercentage: number) => {
    return price - (price * (offerPercentage || 0) / 100);
  };
  
  const subtotal = cartItems.reduce((sum, item) => {
    const discountedPrice = getDiscountedPrice(item.price, item.offerPercentage || 0);
    return sum + (discountedPrice * item.cartQuantity);
  }, 0);

  useEffect(() => {
    // Only animate if there are items
    if (cartItems.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from('.cart-item', {
        x: -50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }, pageRef);

    return () => ctx.revert();
  }, [cartItems]);

  return (
    <div ref={pageRef} className="min-h-screen">
      <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-[60px] py-6 md:py-8 lg:py-12">
          <h1 className="text-2xl md:text-3xl lg:text-5xl tracking-tight mb-2 md:mb-4">
            Shopping Cart
          </h1>
          <p className="text-sm md:text-base lg:text-lg opacity-70">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-[60px] py-4 md:py-6 lg:py-8">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 min-h-[400px]">
            <ShoppingBag size={80} className="mx-auto mb-6 opacity-20" />
            <h2 className="text-2xl mb-4">Your cart is empty</h2>
            <p className="text-lg opacity-70 mb-8">
              Add some Jewellery to get started
            </p>
            <NoiseButton onClick={() => navigate('/shop')}>
              Start Shopping
            </NoiseButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,350px] gap-4 md:gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="space-y-3 md:space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item flex gap-3 md:gap-6 p-3 md:p-4 lg:p-6 border border-gray-200 rounded-xl md:rounded-3xl">
                  <div className="w-24 md:w-32 h-24 md:h-32 flex-shrink-0 rounded-lg md:rounded-xl overflow-hidden bg-gray-100">
                    <img 
                      src={item.images?.[0] || ''} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23ccc" width="200" height="200"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="%23999" font-size="16"%3EImage Not Found%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm md:text-lg lg:text-xl font-medium mb-1">{item.name}</h3>
                      <p className="text-xs md:text-sm opacity-70 mb-2">SKU: {item.sku}</p>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.cartQuantity - 1))}
                          className="w-7 h-7 md:w-8 md:h-8 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-all text-sm"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-medium text-sm md:text-base">{item.cartQuantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.cartQuantity + 1)}
                          className="w-7 h-7 md:w-8 md:h-8 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-all text-sm"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {item.offerPercentage && item.offerPercentage > 0 && (
                          <p className="text-sm opacity-50 line-through">₹{(item.price * item.cartQuantity).toFixed(2)}</p>
                        )}
                        <p className="text-base md:text-lg lg:text-xl font-bold text-green-600">₹{((item.price - (item.price * (item.offerPercentage || 0) / 100)) * item.cartQuantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 border-2 border-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={16} className="md:w-5 md:h-5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-4 h-fit">
              <div className="border border-gray-200 rounded-xl md:rounded-3xl p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
                <h2 className="text-lg md:text-2xl font-semibold">Order Summary</h2>
                
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between text-base md:text-lg">
                    <span className="opacity-70">Subtotal</span>
                    <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500">Shipping & taxes will be calculated at checkout</p>
                </div>

                <NoiseButton 
                  onClick={() => navigate('/checkout')}
                  containerClassName="w-full"
                >
                  Proceed to Checkout
                </NoiseButton>

                <NoiseButton
                  onClick={() => navigate('/shop')}
                  containerClassName="w-full"
                >
                  Continue Shopping
                </NoiseButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}