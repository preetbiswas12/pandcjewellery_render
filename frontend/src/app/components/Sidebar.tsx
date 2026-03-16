import { useState, useEffect, useRef } from 'react';
import { X, ChevronDown, Home, ShoppingBag, ShoppingCart, Heart, User, Package, Mail, Phone, MapPin, Search } from 'lucide-react';
import { gsap } from 'gsap';
import { Link } from 'react-router';
import { useApp } from '../context/AppContext';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { categories: appCategories } = useApp();

  // Initialize modal position on mount
  useEffect(() => {
    if (modalRef.current && overlayRef.current) {
      gsap.set(modalRef.current, { opacity: 0, scale: 0.9, y: '-50%', x: '-50%' });
      gsap.set(overlayRef.current, { opacity: 0, pointerEvents: 'none' });
    }
  }, []);

  useEffect(() => {
    if (!modalRef.current || !overlayRef.current) return;

    if (isOpen) {
      // Animate backdrop fade in
      gsap.to(overlayRef.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.3,
        ease: 'power2.out'
      });
      
      // Animate modal scale and fade in from center
      gsap.to(modalRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: 'back.out(1.7)'
      });

      // Blur the main content wrapper
      const mainContent = document.querySelector('#root');
      if (mainContent && mainContent !== modalRef.current) {
        gsap.to(mainContent, {
          filter: 'blur(6px)',
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      // Animate menu items in sequence
      if (contentRef.current) {
        const items = Array.from(contentRef.current.querySelectorAll('.menu-item')) as Element[];
        gsap.from(items, {
          opacity: 0,
          y: 10,
          duration: 0.3,
          stagger: 0.05,
          ease: 'power2.out',
          delay: 0.15
        });
      }

      document.body.style.overflow = 'hidden';
    } else {
      // Animate modal scale and fade out
      gsap.to(modalRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: 'power2.in'
      });

      // Remove blur from main content
      const mainContent = document.querySelector('#root');
      if (mainContent && mainContent !== modalRef.current) {
        gsap.to(mainContent, {
          filter: 'blur(0px)',
          duration: 0.3,
          ease: 'power2.in'
        });
      }

      // Animate backdrop fade out
      gsap.to(overlayRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.2,
        ease: 'power2.in'
      });

      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCloseSidebar = () => {
    setIsOpen(false);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  // Use categories from AppContext, transform them to match sidebar structure
  const categories = appCategories.filter(cat => cat.isActive).map(cat => ({
    id: cat._id,
    name: cat.name,
    href: `/shop/${cat.slug}`,
    slug: cat.slug,
    subCategories: cat.subCategories?.map(sub => ({
      name: sub.name,
      href: `/shop/${cat.slug}#${sub.slug}`,
      slug: sub.slug
    })) || []
  }));

  const quickLinks = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: ShoppingBag, label: 'Shop All', href: '/shop' },
    { icon: ShoppingCart, label: 'Cart', href: '/cart' },
    { icon: Package, label: 'My Orders', href: '/my-orders' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist' },
    { icon: User, label: 'Profile', href: '/profile/me' },
  ];

  return (
    <>
      {/* Toggle Button - Hidden, use keyboard shortcut or click elsewhere */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-4 z-50 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-300 hidden md:block"
        aria-label="Toggle menu"
      >
        <Search size={28} className="text-black" />
      </button>

      {/* Keyboard shortcut for mobile */}
      <div className="md:hidden fixed top-6 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Search size={24} className="text-black" />
        </button>
      </div>

      {/* Dark Overlay Backdrop */}
      <div
        ref={overlayRef}
        onClick={handleCloseSidebar}
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
      />

      {/* Centered Modal */}
      <div
        ref={modalRef}
        className="fixed top-1/2 left-1/2 z-50 w-[90%] md:w-full max-w-2xl max-h-[90vh] md:max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        {/* Header with Search */}
        <div className="sticky top-0 bg-gradient-to-r from-magenta-50 to-golden-50 px-4 md:px-6 py-3 md:py-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg md:text-2xl font-black tracking-tight">P&C Jewellery</h1>
            <button
              onClick={handleCloseSidebar}
              className="p-1 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
            >
              <X size={20} className="md:size-24" />
            </button>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-2 md:top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-1 md:py-2 bg-white/50 border border-gray-200 rounded-lg focus:outline-none focus:border-magenta-600 focus:ring-1 focus:ring-magenta-600 text-sm"
            />
          </div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto overscroll-contain">
          {/* Quick Navigation */}
          <nav className="px-4 md:px-6 py-4 md:py-6 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Quick Links</p>
            <div className="space-y-2">
              {quickLinks.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={index}
                    to={item.href}
                    onClick={handleCloseSidebar}
                    className="menu-item flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Icon size={18} className="text-magenta-600 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Shop Categories */}
          <nav className="px-4 md:px-6 py-4 md:py-6 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Shop by Category</p>
            <div className="space-y-1">
              {categories.map((category) => (
                <div key={category.id} className="menu-item">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm"
                  >
                    <Link
                      to={category.href}
                      onClick={handleCloseSidebar}
                      className="flex-1 text-left text-sm font-medium"
                    >
                      {category.name}
                    </Link>
                    {category.subCategories && (
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform ${
                          expandedCategory === category.id ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>
                  
                  {/* Subcategories */}
                  {expandedCategory === category.id && category.subCategories && (
                    <div className="pl-4 mt-2 space-y-1 border-l border-gray-200">
                      {category.subCategories.map((sub, i) => (
                        <Link
                          key={i}
                          to={sub.href}
                          onClick={handleCloseSidebar}
                          className="menu-item block px-4 py-1.5 text-xs text-gray-600 hover:text-magenta-600 hover:bg-gray-50 rounded transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Support Links */}
          <nav className="px-4 md:px-6 py-4 md:py-6">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Support</p>
            <div className="space-y-1">
              <Link to="/faq" onClick={handleCloseSidebar} className="menu-item block px-4 py-1 md:py-1.5 text-xs text-gray-700 hover:text-magenta-600 rounded transition-colors">FAQ</Link>
              <Link to="/shipping" onClick={handleCloseSidebar} className="menu-item block px-4 py-1 md:py-1.5 text-xs text-gray-700 hover:text-magenta-600 rounded transition-colors">Shipping Info</Link>
              <Link to="/returns" onClick={handleCloseSidebar} className="menu-item block px-4 py-1 md:py-1.5 text-xs text-gray-700 hover:text-magenta-600 rounded transition-colors">Returns & Exchanges</Link>
              <Link to="/contact" onClick={handleCloseSidebar} className="menu-item block px-4 py-1 md:py-1.5 text-xs text-gray-700 hover:text-magenta-600 rounded transition-colors">Contact Us</Link>
            </div>
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 md:px-6 py-3 space-y-2 bg-gray-50 flex-shrink-0">
          <Link
            to="/sign-in"
            onClick={handleCloseSidebar}
            className="w-full flex items-center justify-center px-4 py-1.5 md:py-2 rounded-lg bg-magenta-600 text-white hover:bg-magenta-700 transition-colors font-medium text-xs md:text-sm"
          >
            Sign In
          </Link>
          <Link
            to="/sign-up"
            onClick={handleCloseSidebar}
            className="w-full flex items-center justify-center px-4 py-1.5 md:py-2 rounded-lg border border-magenta-600 text-magenta-600 hover:bg-magenta-50 transition-colors font-medium text-xs md:text-sm"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </>
  );
}
