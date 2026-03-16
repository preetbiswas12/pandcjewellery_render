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



  // ⚠️ OPTIMIZED: Fetch products from server with filters
  const fetchProducts = useCallback(async (pageNum: number = 1) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
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
  }, [selectedCategory, selectedSubCategory, selectedColor]);

  // ⚠️ FIXED: Debounced filter changes - only depends on filter values, not pagination
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(1); // Reset to page 1 when filters change
    }, 500); // Increased debounce delay

    return () => clearTimeout(timer);
  }, [selectedCategory, selectedSubCategory, selectedColor, fetchProducts]);

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
    setSelectedColor('');
    setSearchParams({});
  };

  return (
    <div ref={pageRef} className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-[60px] py-6 md:py-8 lg:py-12">
          <h1 className="text-2xl md:text-3xl lg:text-5xl tracking-tight mb-2 md:mb-4">
            {currentCategory ? currentCategory.name : 'All Jewellery'}
          </h1>
          <p className="text-sm md:text-base lg:text-lg opacity-70">
            {isLoading && displayedProducts.length === 0 
              ? 'Loading...' 
              : pagination.total === 0 
              ? 'No products found'
              : `${pagination.total} product${pagination.total !== 1 ? 's' : ''} available`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-[60px] py-4 md:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[250px,1fr] gap-4 md:gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="space-y-3 md:space-y-4">
            {/* Clear All Filters Button */}
            {(selectedColor || selectedCategory || selectedSubCategory) && (
              <div className="flex items-center justify-between bg-gradient-to-r from-red-50 to-pink-50 p-2 md:p-4 rounded-lg border border-red-200">
                <span className="text-xs md:text-sm font-semibold text-gray-800">Active Filters</span>
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold transition-colors underline"
                >
                  Clear
                </button>
              </div>
            )}
            
            {/* Categories */}
            <div className="bg-white p-3 md:p-5 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-2 md:mb-4">Categories</h3>
              <div className="space-y-2 md:space-y-3">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    checked={!selectedCategory}
                    onChange={() => {
                      setSelectedCategory('');
                      setSelectedSubCategory('');
                    }}
                    className="w-4 h-4 text-black rounded-full border-gray-300 focus:ring-2 focus:ring-black"
                  />
                  <span className="ml-2 md:ml-3 text-xs md:text-sm text-gray-700 group-hover:text-gray-900">All Jewellery</span>
                </label>
                {categories && categories.filter(cat => cat.isActive).map(cat => (
                  <div key={cat._id}>
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.slug}
                        onChange={() => {
                          setSelectedCategory(cat.slug);
                          setSelectedSubCategory('');
                        }}
                        className="w-4 h-4 text-black rounded-full border-gray-300 focus:ring-2 focus:ring-black"
                      />
                      <span className="ml-2 md:ml-3 text-xs md:text-sm text-gray-700 group-hover:text-gray-900 font-medium">{cat.name}</span>
                    </label>
                    {selectedCategory === cat.slug && cat.subCategories && cat.subCategories.length > 0 && (
                      <div className="ml-7 mt-1 md:mt-2 space-y-1 md:space-y-2 border-l border-gray-200 pl-2 md:pl-3">
                        {cat.subCategories.map((sub: any) => (
                          <label key={sub.slug} className="flex items-center cursor-pointer group">
                            <input
                              type="radio"
                              name="subCategory"
                              checked={selectedSubCategory === sub.slug}
                              onChange={() => setSelectedSubCategory(sub.slug)}
                              className="w-3 h-3 text-black rounded-full border-gray-300 focus:ring-2 focus:ring-black"
                            />
                            <span className="ml-2 md:ml-3 text-xs md:text-sm text-gray-600 group-hover:text-gray-900">{sub.name}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>




          </div>

          {/* Products Grid */}
          <div>
            {isLoading && displayedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-12 h-12 border-3 border-gray-300 border-t-black rounded-full animate-spin mb-4"></div>
                <p className="text-gray-700 font-medium">Loading products...</p>
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-gradient-to-b from-gray-50 to-white rounded-lg border border-gray-200">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m0 0L4 7m16 0v10l-8 4m0 0l-8-4v-10" />
                </svg>
                <p className="text-xl font-semibold text-gray-900 mb-2">No Products Found</p>
                <p className="text-sm text-gray-500 mb-6">Try adjusting your filters or browse different categories</p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-black text-white rounded-full h hover:bg-gray-900 transition-colors font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-gray-900">{displayedProducts.length}</span> of <span className="font-semibold text-gray-900">{pagination.total}</span> products
                  </p>
                  {isLoading && <span className="text-xs text-gray-500 animate-pulse">Loading...</span>}
                </div>

                <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
                      className="px-8 py-3 border-2 border-black text-black rounded-full hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                          Loading...
                        </span>
                      ) : (
                        'Load More Products'
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}