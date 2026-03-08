import { Outlet, useNavigate, useLocation } from 'react-router';
import { LayoutDashboard, Package, ShoppingCart, Tag, Image, LogOut, FolderTree, User, FileText } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

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

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-black text-white min-h-screen flex flex-col">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
          </div>
          
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-900 text-gray-300'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Admin Info and Logout */}
          <div className="p-4 border-t border-gray-800 space-y-4">
            {admin && (
              <div className="bg-gray-900 rounded-lg p-3 text-sm border border-gray-800">
                <div className="flex items-center gap-2 mb-2">
                  <User size={16} className="text-white" />
                  <span className="font-medium text-white">Admin</span>
                </div>
                <p className="text-gray-400 text-xs truncate">{admin.email}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900 transition-all text-red-400 hover:text-white"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-900 transition-all text-gray-300 hover:text-white"
            >
              <span className="text-sm font-medium">Back to Store</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}