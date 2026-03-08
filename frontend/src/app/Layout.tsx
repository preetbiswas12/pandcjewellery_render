import { Outlet } from 'react-router';
import { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ShoppingCart } from './components/ShoppingCart';
import { FloatingDock } from '@/components/ui/floating-dock';
import { useApp } from './context/AppContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Home, ShoppingBag, Heart, User, ShoppingCart as ShoppingCartIcon, Package } from 'lucide-react';
import { CATEGORIES } from './types';

gsap.registerPlugin(ScrollTrigger);

export default function Layout() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const appRef = useRef<HTMLDivElement>(null);
  const { cartItems, wishlist, updateQuantity, removeFromCart } = useApp();

  useEffect(() => {
    // Page load animation
    const ctx = gsap.context(() => {
      gsap.from(appRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      });
    }, appRef);

    // Refresh ScrollTrigger on resize
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.cartQuantity, 0);

  // Floating Dock items - Keep minimal for desktop/tablet
  const dockItems = [
    {
      title: 'Home',
      icon: <Home className="h-full w-full text-gray-700" />,
      href: '/',
    },
    {
      title: 'Shop All',
      icon: <ShoppingBag className="h-full w-full text-gray-700" />,
      href: '/shop',
    },
    {
      title: `Cart (${totalCartItems})`,
      icon: (
        <div className="relative">
          <ShoppingCartIcon className="h-full w-full text-gray-700" />
          {totalCartItems > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-xs rounded-full flex items-center justify-center font-bold">
              {totalCartItems}
            </span>
          )}
        </div>
      ),
      href: '#',
      onClick: () => setIsCartOpen(true),
    },
    {
      title: `Wishlist (${wishlist.length})`,
      icon: (
        <div className="relative">
          <Heart className="h-full w-full text-gray-700" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-xs rounded-full flex items-center justify-center font-bold">
              {wishlist.length}
            </span>
          )}
        </div>
      ),
      href: '/wishlist',
    },
    {
      title: 'Orders',
      icon: <Package className="h-full w-full text-gray-700" />,
      href: '/orders',
    },
    {
      title: 'Profile',
      icon: <User className="h-full w-full text-gray-700" />,
      href: '/profile',
    },
  ];

  return (
    <div ref={appRef} className="min-h-screen bg-white flex flex-col">
      <div className="w-full pb-24 md:pb-28 flex-1">
        <Navbar />
        
        <main>
          <Outlet />
        </main>
      </div>

      <Footer />

      {/* Floating Dock */}
      <FloatingDock 
        items={dockItems}
        desktopClassName="fixed bottom-8 left-1/2 transform -translate-x-1/2 shadow-2xl z-50"
        mobileClassName="fixed bottom-8 right-4 shadow-2xl z-50"
        mobileNavDisabled={true}
      />
      
      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
      />
    </div>
  );
}
