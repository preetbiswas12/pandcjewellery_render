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
        <aside className="w-64 bg-white text-gray-900 min-h-screen flex flex-col border-r border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-magenta-600">Admin Panel</h2>
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
                        isActive ? 'bg-magenta-100 text-magenta-900 font-semibold' : 'hover:bg-gray-100 text-gray-700'
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
          <div className="p-4 border-t border-gray-200 space-y-4">
            {admin && (
              <div className="bg-gray-50 rounded-lg p-3 text-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <User size={16} className="text-magenta-600" />
                  <span className="font-medium text-gray-900">Admin</span>
                </div>
                <p className="text-gray-600 text-xs truncate">{admin.email}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 transition-all text-red-600 hover:text-red-700"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-all text-gray-700 hover:text-gray-900"
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