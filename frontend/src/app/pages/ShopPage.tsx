import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import { ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ShopPage() {
  const { category, subCategory } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [selectedSubCategory, setSelectedSubCategory] = useState(subCategory || '');
  const [selectedColor, setSelectedColor] = useState(searchParams.get('color') || '');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('featured');
  
  const { addToCart, wishlist, toggleWishlist, products, categories } = useApp();
  const pageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Update selected color when URL changes
  useEffect(() => {
    const colorParam = searchParams.get('color');
    if (colorParam) {
      setSelectedColor(colorParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (gridRef.current) {
        const cards = gridRef.current.children;
        gsap.from(cards, {
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 80,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out'
        });
      }
    }, pageRef);

    return () => ctx.revert();
  }, [selectedCategory, selectedSubCategory]);

  const filteredProducts = products.filter(product => {
    if (selectedCategory && product.category !== selectedCategory) return false;
    if (selectedSubCategory && product.subCategory !== selectedSubCategory) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    if (selectedColor && !product.colors.includes(selectedColor)) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'best-selling': return b.quantity - a.quantity; // Use quantity as proxy for popularity
      default: return 0;
    }
  });

  const currentCategory = categories.find(cat => cat.slug === selectedCategory);

  return (
    <div ref={pageRef} className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-[60px] py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight mb-4">
            {currentCategory ? currentCategory.name : 'All Fabrics'}
          </h1>
          <p className="text-lg opacity-70">
            {sortedProducts.length} products available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-[60px] py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-8">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            {/* Active Filters Display */}
            {selectedColor && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold">Active Filters</h3>
                  <button
                    onClick={() => {
                      setSelectedColor('');
                      setSearchParams({});
                    }}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-gray-200">
                  <span className="text-xs font-semibold">Color:</span>
                  <span className="text-xs">{selectedColor}</span>
                  <button
                    onClick={() => {
                      setSelectedColor('');
                      setSearchParams({});
                    }}
                    className="ml-auto text-gray-500 hover:text-magenta-950"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
            
            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedSubCategory('');
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    !selectedCategory ? 'bg-magenta-950 text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  All Fabrics
                </button>
                {categories.filter(cat => cat.isActive).map(cat => (
                  <div key={cat._id}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setSelectedSubCategory('');
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat.slug ? 'bg-black text-white' : 'hover:bg-gray-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                    {selectedCategory === cat.slug && (
                      <div className="ml-4 mt-2 space-y-1">
                        {cat.subCategories?.map((sub: any) => (
                          <button
                            key={sub.slug}
                            onClick={() => setSelectedSubCategory(sub.slug)}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                              selectedSubCategory === sub.slug ? 'bg-gray-200' : 'hover:bg-gray-100'
                            }`}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Price Range</h3>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full"
                />
                <p className="text-sm opacity-70">Up to ₹{priceRange[1]}</p>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="featured">Featured</option>
                <option value="best-selling">Best Selling</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div>
            {sortedProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl opacity-70">No products found</p>
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedSubCategory('');
                    setPriceRange([0, 5000]);
                  }}
                  className="mt-4 px-6 py-2 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    onToggleWishlist={toggleWishlist}
                    isInWishlist={wishlist.includes(product._id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}