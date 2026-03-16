import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { gsap } from 'gsap';
import { Menu, X, Home, ShoppingBag, Heart, User, ShoppingCart, LogOut, Package } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  cartCount?: number;
  wishlistCount?: number;
}

export function Navbar({ }: NavbarProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems, wishlist, categories } = useApp();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.cartQuantity, 0);

  useEffect(() => {
    // Animate navbar on mount
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div ref={navRef} className="border-b border-golden-200 px-3 sm:px-4 md:px-8 lg:px-[60px] py-3 sm:py-4 md:py-5 sticky top-0 bg-white z-40 w-full overflow-x-hidden">
        <div className="flex items-center justify-between relative w-full max-w-full">
          {/* Mobile Menu Button - Left */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-gray-900 flex-shrink-0 z-10 p-1 sm:p-2"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Logo - Centered absolutely */}
          <Link 
            to="/" 
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3" 
          >
            <span className="text-sm md:text-base lg:text-lg font-noto-serif font-bold text-gray-800">
              P&C Jewellery
            </span>
          </Link>

          {/* Right: Auth - Pushed far right */}
          <div className="ml-auto flex items-center gap-4 flex-shrink-0">
            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-4">
              {isLoaded && user ? (
                <>
                  <Link to={`/${(user.firstName || '').toLowerCase()}/profile`} className="hover:opacity-70 transition-opacity flex items-center">
                    <span className="text-xs md:text-sm font-semibold tracking-tight text-aura-600 hover:text-aura-700">{user.firstName || user.emailAddresses[0]?.emailAddress}</span>
                  </Link>
                  <button
                    onClick={async () => {
                      await signOut();
                      navigate('/');
                    }}
                    className="hover:opacity-70 transition-opacity flex items-center gap-2"
                  >
                    <LogOut size={18} className="text-gray-700" />
                  </button>
                </>
              ) : (
                <Link to="/sign-in" className="hover:opacity-70 transition-opacity flex items-center">
                  <span className="text-xs md:text-sm font-semibold tracking-tight text-magenta-600 hover:text-magenta-700">Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Auth */}
            <div className="md:hidden flex items-center gap-2 sm:gap-3">
              {isLoaded && user ? (
                <>
                  <Link to={`/${(user.firstName || '').toLowerCase()}/profile`} className="hover:opacity-70 transition-opacity flex items-center">
                    <User size={18} className="text-gray-700" />
                  </Link>
                  <button
                    onClick={async () => {
                      await signOut();
                      navigate('/');
                    }}
                    className="hover:opacity-70 transition-opacity flex items-center"
                  >
                    <LogOut size={16} className="text-gray-700" />
                  </button>
                </>
              ) : (
                <Link to="/sign-in" className="hover:opacity-70 transition-opacity flex items-center">
                  <span className="text-xs sm:text-sm font-semibold tracking-tight text-magenta-600 hover:text-magenta-700">Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-magenta-950/30 md:hidden z-40"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-screen w-[75vw] sm:w-64 bg-white z-50 overflow-y-auto md:hidden shadow-lg"
            >
              {/* Close button */}
              <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200">
                <span className="font-bold text-xs sm:text-sm text-gray-900">Menu</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-700 hover:text-gray-900 p-1 sm:p-2 flex-shrink-0"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Menu items */}
              <div className="px-2 sm:px-4 py-3 sm:py-4 flex flex-col gap-1">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 sm:p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <Home size={18} className="flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium">Home</span>
                </Link>

                <Link
                  to="/shop"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 sm:p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <ShoppingBag size={18} className="flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium">Shop All</span>
                </Link>

                {categories.filter(cat => cat.isActive).map((category) => (
                  <Link
                    key={category._id}
                    to={`/shop/${category.slug}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 sm:p-3 pl-8 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-medium">{category.name}</span>
                  </Link>
                ))}

                <div className="border-t border-gray-200 my-2 sm:my-3"></div>

                <Link
                  to="/wishlist"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 sm:p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <Heart size={18} className="flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium">Wishlist {wishlist.length > 0 && `(${wishlist.length})`}</span>
                </Link>

                {isLoaded && user && (
                  <>
                    <Link
                      to="/cart"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 sm:p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <ShoppingCart size={18} className="flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">Cart {totalCartItems > 0 && `(${totalCartItems})`}</span>
                    </Link>

                    <Link
                      to="/my-orders"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 sm:p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <Package size={18} className="flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">My Orders</span>
                    </Link>
                  </>
                )}

                <Link
                  to={user ? `/${(user.firstName || '').toLowerCase()}/profile` : '/sign-in'}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 sm:p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <User size={18} className="flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium">Profile</span>
                </Link>

                
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}