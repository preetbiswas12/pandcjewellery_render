import { X, Trash2 } from 'lucide-react';
import { Link } from 'react-router';
import { CartItem } from '../types';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

export function ShoppingCart({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem }: ShoppingCartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);
  const cartRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Animate cart in
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      gsap.fromTo(cartRef.current,
        { x: '100%' },
        { x: 0, duration: 0.4, ease: 'power3.out' }
      );
    } else if (cartRef.current) {
      // Animate cart out
      gsap.to(cartRef.current, {
        x: '100%',
        duration: 0.3,
        ease: 'power3.in'
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div ref={overlayRef} className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div ref={cartRef} className="fixed right-0 top-0 h-full w-full md:w-[400px] bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Shopping Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all hover:scale-110 active:scale-95">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b">
                  <img 
                    src={item.images?.[0] || ''} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23ccc" width="100" height="100"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="%23999" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{item.name}</h3>
                    <p className="text-sm opacity-70 mb-2">₹{item.price}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(5, item.cartQuantity - 1))}
                        className="w-6 h-6 border rounded flex items-center justify-center hover:bg-gray-100 transition-all hover:scale-110 active:scale-95"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.cartQuantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.cartQuantity + 1)}
                        className="w-6 h-6 border rounded flex items-center justify-center hover:bg-gray-100 transition-all hover:scale-110 active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all hover:scale-110 active:scale-95"
                    title="Remove from cart"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="flex items-center justify-between text-xl font-bold">
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <Link 
              to="/cart" 
              onClick={onClose}
              className="block w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 text-center"
            >
              View Cart
            </Link>
            <Link 
              to="/checkout" 
              onClick={onClose}
              className="block w-full border-2 border-black py-3 rounded-full font-medium hover:bg-black hover:text-white transition-all text-center"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}