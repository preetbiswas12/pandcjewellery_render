import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import { db } from '../services/database-enhanced';
import { ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasMore: boolean;
}

export default function ShopPage() {
  const { category, subCategory } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [selectedSubCategory, setSelectedSubCategory] = useState(subCategory || '');
  const [selectedColor, setSelectedColor] = useState(searchParams.get('color') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState('featured');
  
  // ⚠️ OPTIMIZED: Server-side pagination and filtering
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 24,
    total: 0,
    pages: 0,
    hasMore: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { addToCart, wishlist, toggleWishlist, categories } = useApp();
  const pageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // ⚠️ FIXED: Map sort options properly
  const mapSortBy = useCallback((sort: string): string => {
    switch (sort) {
      case 'price-low': return 'price';
      case 'price-high': return '-price';
      case 'newest': return '-createdAt';
      case 'best-selling': return '-quantity';
      case 'featured':
      default: return '-createdAt';
    }
  }, []);

  // ⚠️ OPTIMIZED: Fetch products from server with filters
  const fetchProducts = useCallback(async (pageNum: number = 1) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate price range
      const minPrice = Math.max(0, Math.min(priceRange[0], priceRange[1]));
      const maxPrice = Math.max(priceRange[0], priceRange[1] || 5000);
      
      // Build filter params - only include non-empty values
      const filterParams: Record<string, any> = {
        page: pageNum,
        limit: 24,
      };

      if (selectedCategory && selectedCategory.trim()) {
        filterParams.category = selectedCategory.trim();
      }

      if (selectedSubCategory && selectedSubCategory.trim()) {
        filterParams.subCategory = selectedSubCategory.trim();
      }

      if (selectedColor && selectedColor.trim()) {
        filterParams.color = selectedColor.trim();
      }

      if (minPrice > 0 || maxPrice < 5000) {
        filterParams.minPrice = minPrice;
        filterParams.maxPrice = maxPrice;
      }

      filterParams.sortBy = mapSortBy(sortBy);

      const result = await (db as any).getPaginated('products', filterParams);

      if (result && result.data && Array.isArray(result.data)) {
        const mappedProducts = result.data.map((p: any) => ({
          ...p,
          id: p._id || p.id, // Fallback for id
          _id: p._id || p.id,
        }));

        setDisplayedProducts(mappedProducts);
        setPagination(result.pagination || {
          page: pageNum,
          limit: 24,
          total: mappedProducts.length,
          pages: 1,
          hasMore: false,
        });
      } else {
        setDisplayedProducts([]);
        setPagination({
          page: pageNum,
          limit: 24,
          total: 0,
          pages: 0,
          hasMore: false,
        });
      }
    } catch (error) {
      // Only set error if not aborted
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again.');
        setDisplayedProducts([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, selectedSubCategory, selectedColor, priceRange, sortBy, mapSortBy]);

  // ⚠️ FIXED: Debounced filter changes - only depends on filter values, not pagination
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(1); // Reset to page 1 when filters change
    }, 500); // Increased debounce delay

    return () => clearTimeout(timer);
  }, [selectedCategory, selectedSubCategory, selectedColor, priceRange, sortBy, fetchProducts]);

  // ⚠️ FIXED: Load initial products on mount only
  useEffect(() => {
    fetchProducts(1);
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Update selected color when URL changes
  useEffect(() => {
    const colorParam = searchParams.get('color');
    if (colorParam && colorParam !== selectedColor) {
      setSelectedColor(colorParam);
    }
  }, [searchParams]);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (gridRef.current && gridRef.current.children.length > 0) {
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
          stagger: 0.1,
          ease: 'power3.out'
        });
      }
    }, pageRef);

    return () => ctx.revert();
  }, [displayedProducts]);

  const currentCategory = useMemo(
    () => categories.find(cat => cat.slug === selectedCategory),
    [selectedCategory, categories]
  );

  const handleLoadMore = () => {
    if (pagination.hasMore && !isLoading) {
      fetchProducts(pagination.page + 1);
    }
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedSubCategory('');
    setPriceRange([0, 5000]);
    setSelectedColor('');
    setSearchParams({});
  };

  return (
    <div ref={pageRef} className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-[60px] py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tight mb-4">
            {currentCategory ? currentCategory.name : 'All Jewellery'}
          </h1>
          <p className="text-lg opacity-70">
            {isLoading && displayedProducts.length === 0 
              ? 'Loading...' 
              : pagination.total === 0 
              ? 'No products found'
              : `${pagination.total} product${pagination.total !== 1 ? 's' : ''} available`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-[60px] py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-8">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Active Filters Display */}
            {(selectedColor || selectedCategory) && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Active Filters</h3>
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedColor && (
                    <button
                      onClick={() => setSelectedColor('')}
                      className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-gray-300 text-xs hover:border-red-500 transition-colors"
                    >
                      Color: {selectedColor}
                      <span className="ml-1 text-gray-500 hover:text-red-600">✕</span>
                    </button>
                  )}
                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory('')}
                      className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-gray-300 text-xs hover:border-red-500 transition-colors"
                    >
                      Category: {currentCategory?.name}
                      <span className="ml-1 text-gray-500 hover:text-red-600">✕</span>
                    </button>
                  )}
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
                    !selectedCategory 
                      ? 'bg-black text-white' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  All Jewellery
                </button>
                {categories && categories.filter(cat => cat.isActive).map(cat => (
                  <div key={cat._id}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat.slug);
                        setSelectedSubCategory('');
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat.slug 
                          ? 'bg-magenta-950 text-white' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                    {selectedCategory === cat.slug && cat.subCategories && cat.subCategories.length > 0 && (
                      <div className="ml-4 mt-2 space-y-1">
                        {cat.subCategories.map((sub: any) => (
                          <button
                            key={sub.slug}
                            onClick={() => setSelectedSubCategory(sub.slug)}
                            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                              selectedSubCategory === sub.slug 
                                ? 'bg-gray-300' 
                                : 'hover:bg-gray-100'
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
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setPriceRange([0, val]);
                  }}
                  className="w-full cursor-pointer"
                />
                <p className="text-sm opacity-70">
                  ₹{priceRange[0].toLocaleString('en-IN')} - ₹{priceRange[1].toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black transition-colors"
              >
                <option value="featured">Featured</option>
                <option value="best-selling">Best Selling</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div>
            {isLoading && displayedProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                <p className="text-xl opacity-70">Loading products...</p>
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl opacity-70 mb-4">No products found</p>
                <p className="text-sm opacity-50 mb-6">Try adjusting your filters</p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={{
                        ...product,
                        id: product._id,
                      }}
                      onAddToCart={addToCart}
                      onToggleWishlist={toggleWishlist}
                      isInWishlist={wishlist.includes(product._id)}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {pagination.hasMore && (
                  <div className="flex justify-center mt-12">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      className="px-8 py-3 border-2 border-black rounded-full hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Loading...' : 'Load More Products'}
                    </button>
                  </div>
                )}

                {/* Pagination info */}
                <div className="text-center mt-8 opacity-70 text-sm">
                  Showing {displayedProducts.length} of {pagination.total} products
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}