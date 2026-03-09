import { useParams, useNavigate } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useApp } from '../context/AppContext';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import { gsap } from 'gsap';
import { convertGoogleDriveLink } from '../../lib/googleDriveUtils';
import RatingComponent from '../components/RatingComponent';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { products, addToCart, wishlist, toggleWishlist } = useApp();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1); // Minimum 1 Quantity
  const [addedToCart, setAddedToCart] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  
  const pageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Find the product by ID
  const product = products.find(p => p._id === id);

  // Redirect if product not found
  useEffect(() => {
    if (!product) {
      navigate('/shop');
    }
  }, [product, navigate]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(imageRef.current, {
        x: -80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
      
      gsap.from(detailsRef.current, {
        x: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  if (!product) return null;

  const discountedPrice = product.price - (product.price * product.offerPercentage / 100);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const isInWishlist = wishlist.includes(product._id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = imageContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  return (
    <div ref={pageRef} className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-[60px] py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm opacity-70 mb-8">
          <button onClick={() => navigate('/')} className="hover:opacity-100">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/shop')} className="hover:opacity-100">Shop</button>
          <span>/</span>
          <span className="opacity-100 font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div ref={imageRef}>
            <div 
              ref={imageContainerRef}
              className="aspect-square max-w-[500px] mx-auto rounded-3xl bg-gray-100 mb-4 relative cursor-crosshair group overflow-hidden"
              onMouseEnter={() => setShowZoom(true)}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setShowZoom(false)}
            >
              {/* Original image - hide on zoom */}
              <img
                src={convertGoogleDriveLink(product.images?.[selectedImage] || '')}
                alt={product.name}
                className={`w-full h-full object-cover rounded-3xl transition-opacity duration-200 ${
                  showZoom ? 'lg:opacity-0' : 'opacity-100'
                }`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"%3E%3Crect fill="%23e5e7eb" width="400" height="400"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="%23999" font-size="20"%3EImage Not Found%3C/text%3E%3C/svg%3E';
                }}
              />
              
              {/* Zoomed preview - shows on hover, desktop only */}
              {showZoom && product.images?.[selectedImage] && (
                <div className="hidden lg:block absolute inset-0 z-10">
                  <div
                    className="w-full h-full rounded-3xl"
                    style={{
                      backgroundImage: `url(${convertGoogleDriveLink(product.images[selectedImage])})`,
                      backgroundSize: '250%',
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-4 max-w-[500px] mx-auto">
              {product.images?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === index ? 'border-black' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={convertGoogleDriveLink(img)} 
                    alt="" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Details */}
          <div ref={detailsRef} className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl tracking-tight mb-4">
                {product.name}
              </h1>
              <p className="text-sm opacity-70">SKU: {product.sku}</p>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold">₹{discountedPrice.toFixed(2)}</span>
              {product.offerPercentage > 0 && (
                <>
                  <span className="text-2xl opacity-50 line-through">₹{product.price.toFixed(2)}</span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                    {product.offerPercentage}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className={product.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.quantity > 0 ? `${product.quantity} products in stock` : 'Out of stock'}
              </span>
            </div>

            <p className="text-lg leading-relaxed opacity-80">
              {product.description}
            </p>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(5, quantity - 1))}
                  className="w-10 h-10 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-all"
                >
                  -
                </button>
                <span className="text-xl font-medium w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  className="w-10 h-10 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-all"
                >
                  +
                </button>
              </div>
              <p className="text-xs opacity-70 mt-2">Minimum order: 1</p>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                className="flex-1 bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {addedToCart ? (
                  <>
                    <Check size={20} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={() => toggleWishlist(product._id)}
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
                  isInWishlist ? 'bg-red-500 border-red-500' : 'border-black hover:bg-black hover:text-white'
                }`}
              >
                <Heart size={20} className={isInWishlist ? 'fill-white text-white' : ''} />
              </button>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check size={20} className="flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">Specifications</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="opacity-70">Jewellery Type:</span>
                  <span className="font-medium">{product.fabricType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-70">Care Instructions:</span>
                  <span className="font-medium">{product.careInstructions}</span>
                </div>
                {product.colors && product.colors.length > 0 && (
                  <div className="flex justify-between">
                    <span className="opacity-70">Colors:</span>
                    <span className="font-medium">{product.colors.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ratings Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-semibold mb-8">Customer Reviews</h2>
          <RatingComponent
            productId={product._id}
            productName={product.name}
            userId={user?.emailAddresses[0]?.emailAddress || undefined}
            userName={user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || undefined}
            userEmail={user?.emailAddresses[0]?.emailAddress || undefined}
          />
        </div>
      </div>
    </div>
  );
}