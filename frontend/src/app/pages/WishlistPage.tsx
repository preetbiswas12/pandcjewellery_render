import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { NoiseButton } from '@/components/ui/noise-button';
import { convertGoogleDriveLink } from '../../lib/googleDriveUtils';
import { Trash2, Heart } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, addToCart, products } = useApp();
  const pageRef = useRef<HTMLDivElement>(null);

  // Get actual products that are in wishlist
  const wishlistProducts = products.filter(p => wishlist.includes(p._id));

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.wishlist-item', {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out'
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen">
      <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-[60px] py-6 md:py-8 lg:py-12">
          <h1 className="text-2xl md:text-3xl lg:text-5xl tracking-tight mb-2 md:mb-4">
            My Wishlist
          </h1>
          <p className="text-sm md:text-base lg:text-lg opacity-70">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-[60px] py-4 md:py-6 lg:py-8">
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-12 md:py-16 lg:py-20">
            <Heart size={60} className="md:w-20 md:h-20 mx-auto mb-4 md:mb-6 opacity-20" />
            <h2 className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">Your wishlist is empty</h2>
            <p className="text-sm md:text-base lg:text-lg opacity-70 mb-4 md:mb-6 lg:mb-8">
              Save your favorite items for later
            </p>
            <NoiseButton
              onClick={() => navigate('/shop')}
              containerClassName="w-fit"
            >
              Start Shopping
            </NoiseButton>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="wishlist-item group relative border border-gray-200 rounded-3xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-100 cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
                  <img 
                    src={convertGoogleDriveLink(product.images?.[0] || '')} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"%3E%3Crect fill="%23e5e7eb" width="300" height="300"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="%23999" font-size="16"%3EImage Not Found%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium mb-2">{product.name}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <p className="text-2xl font-bold">
                      ₹{(product.price - (product.price * product.offerPercentage / 100)).toFixed(2)}
                    </p>
                    {product.offerPercentage > 0 && (
                      <>
                        <p className="text-sm opacity-50 line-through">₹{product.price}</p>
                        <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                          -{product.offerPercentage}%
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <NoiseButton
                      onClick={() => addToCart(product)}
                      containerClassName="flex-1"
                    >
                      Add to Cart
                    </NoiseButton>
                    <button
                      onClick={() => toggleWishlist(product._id)}
                      className="w-10 h-10 border-2 border-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}