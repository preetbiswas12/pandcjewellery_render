import { Heart } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { gsap } from 'gsap';
import { Product } from '../context/AppContext';
import { convertGoogleDriveLink } from '../../lib/googleDriveUtils';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  isInWishlist: boolean;
}

export function ProductCard({ product, onAddToCart, onToggleWishlist, isInWishlist }: ProductCardProps) {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -10,
        scale: 1.02,
        duration: 0.4,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out'
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={cardRef} className="group relative">
      <div 
        className="relative aspect-[322/374] overflow-hidden rounded-3xl bg-gray-100 mb-3 cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img 
          src={convertGoogleDriveLink(product.images?.[0] || '')} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"%3E%3Crect fill="%23e5e7eb" width="300" height="300"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="%23999" font-size="16"%3EImage Not Found%3C/text%3E%3C/svg%3E';
          }}
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product._id);
          }}
          className={`absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isInWishlist ? 'bg-red-500' : 'bg-black/20 hover:bg-black/40'
          }`}
        >
          <Heart 
            size={18} 
            className={isInWishlist ? 'fill-white text-white' : 'text-white'}
          />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-2 rounded-full text-sm font-medium opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hover:scale-105 active:scale-95"
        >
          Add to Cart
        </button>
      </div>
      <h3 
        className="font-medium text-lg md:text-2xl tracking-tight mb-1 cursor-pointer hover:opacity-70"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        {product.name}
      </h3>
      <div className="flex items-baseline gap-2">
        <p className="text-base md:text-xl font-semibold">
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
    </div>
  );
}

// Export Product type for backward compatibility
export type { Product };