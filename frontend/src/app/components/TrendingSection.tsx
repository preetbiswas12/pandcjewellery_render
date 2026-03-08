import { useState, useEffect, useRef } from 'react';
import { ProductCard } from './ProductCard';
import { Product, useApp } from '../context/AppContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TrendingSectionProps {
  onAddToCart: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
}

export function TrendingSection({ onAddToCart, wishlist, onToggleWishlist }: TrendingSectionProps) {
  const { products, categories } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Get categories from context (all active categories plus 'ALL' for showing all products)
  const categoryOptions = ['ALL', ...categories.filter(cat => cat.isActive).map(cat => cat.name)];

  const filteredProducts = selectedCategory === 'ALL' 
    ? products.slice(0, 6) // Show first 6 products for 'ALL'
    : products.filter(p => p.category === selectedCategory).slice(0, 6);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation on scroll
      gsap.from(headerRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'top 30%',
          toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });

      // Grid animation on scroll
      if (gridRef.current) {
        const cards = Array.from(gridRef.current.children) as Element[];
        gsap.from(cards, {
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          },
          y: 80,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out'
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    // Animate products when category changes
    if (gridRef.current) {
      const cards = Array.from(gridRef.current.children) as Element[];
      gsap.fromTo(cards,
        { opacity: 0, scale: 0.9, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [selectedCategory]);

  return (
    <div ref={sectionRef} className="w-full px-4 md:px-8 lg:px-[60px] py-8 md:py-12 border-t border-[rgba(0,0,0,0.1)]">
      <div ref={headerRef} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl tracking-tight">Trending</h2>
        
        <div className="flex flex-wrap gap-2">
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-medium tracking-wider transition-all hover:scale-105 active:scale-95 ${
                selectedCategory === cat
                  ? 'bg-[#121212] text-white'
                  : 'border border-[#ddd] text-black/80 hover:border-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onToggleWishlist={onToggleWishlist}
            isInWishlist={wishlist.includes(product._id)}
          />
        ))}
      </div>
    </div>
  );
}