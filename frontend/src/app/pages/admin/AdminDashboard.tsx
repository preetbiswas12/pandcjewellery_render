import { Outlet, useNavigate, useLocation } from 'react-router';
import { LayoutDashboard, Package, ShoppingCart, Tag, Image, LogOut, FolderTree, FileText, RefreshCw, Menu, X, ChevronLeft } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';
import { gsap } from 'gsap';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
  { icon: Package, label: 'Products', path: '/admin/products' },
  { icon: FolderTree, label: 'Categories', path: '/admin/categories' },
  { icon: Tag, label: 'Coupons', path: '/admin/coupons' },
  { icon: Image, label: 'Banners', path: '/admin/banners' },
  { icon: FileText, label: 'Guidelines', path: '/admin/guidelines' }
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logout } = useAdmin();
  const { refreshAllData } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(typeof window !== 'undefined' && window.innerWidth >= 1024);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 1024);

  const handleLogout = async () => {
    await logout();
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await refreshAllData();
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (sidebarRef.current) {
        gsap.from(sidebarRef.current, {
          x: -300,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out'
        });
      }
    });

    // Handle window resize
    const handleResize = () => {
      const isNowMobile = window.innerWidth < 1024;
      setIsMobile(isNowMobile);
      if (isNowMobile && isSidebarOpen) {
        // Don't auto-close, just track state
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className={`${
            isSidebarOpen ? 'w-64 sm:w-72' : 'w-16 sm:w-20'
          } bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen flex flex-col border-r border-slate-700 transition-all duration-300 ${
            isMobile 
              ? (isSidebarOpen ? 'fixed left-0 top-0 z-50' : 'relative') 
              : 'relative'
          }`}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
            <div className={`flex items-center gap-3 ${!isSidebarOpen && 'hidden'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-magenta-400 to-magenta-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-magenta-400 to-pink-400 bg-clip-text text-transparent">Admin</h2>
                <p className="text-xs text-slate-400">Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Refresh Button */}
          <div className={`p-4 ${!isSidebarOpen && 'px-2'}`}>
            <button
              onClick={handleRefreshData}
              disabled={isRefreshing}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 ${
                !isSidebarOpen && 'justify-center px-2'
              }`}
              title="Refresh all data from database"
            >
              <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
              {isSidebarOpen && <span className="text-sm font-medium">Refresh Data</span>}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin');
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-magenta-600 to-magenta-500 text-white shadow-lg shadow-magenta-500/30'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                  title={item.label}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {isSidebarOpen && <span className="text-sm font-medium flex-1 text-left">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Admin Info and Logout */}
          <div className={`border-t border-slate-700/50 space-y-3 p-4 ${!isSidebarOpen && 'items-center flex flex-col'}`}>
            {admin && isSidebarOpen && (
              <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30 text-sm">
                <p className="text-slate-400 text-xs mb-1">Logged in as</p>
                <p className="text-white font-medium truncate text-sm">{admin.email}</p>
                <p className="text-slate-400 text-xs mt-1 capitalize">{admin.role}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-red-500/20 transition-all text-red-400 hover:text-red-300 ${
                !isSidebarOpen && 'justify-center'
              }`}
              title="Logout"
            >
              <LogOut size={18} />
              {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
            </button>
            <button
              onClick={() => navigate('/')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-all text-slate-300 hover:text-white ${
                !isSidebarOpen && 'justify-center'
              }`}
              title="Back to Store"
            >
              <span className="text-sm font-medium">←</span>
              {isSidebarOpen && <span className="text-sm font-medium">Back to Store</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full overflow-x-hidden">
          <div className="p-3 sm:p-6 md:p-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 min-h-screen">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}