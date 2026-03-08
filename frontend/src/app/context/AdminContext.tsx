import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { API_BASE_URL } from '../services/razorpay';

interface AdminUser {
  _id: string;
  email: string;
  role: string;
  permissions: string[];
  lastLogin?: string;
}

interface AdminContextType {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  verifyToken: () => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setAdmin(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { token: newToken, admin: adminData } = data.data;

      setToken(newToken);
      setAdmin(adminData);
      localStorage.setItem('adminToken', newToken);
      localStorage.setItem('adminUser', JSON.stringify(adminData));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/admin/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setAdmin(null);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setIsLoading(false);
      navigate('/admin/login');
    }
  };

  const verifyToken = async (): Promise<boolean> => {
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/admin/auth/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      const data = await response.json();
      setAdmin(data.data.admin);
      return true;
    } catch (error) {
      console.error('Token verification error:', error);
      logout();
      return false;
    }
  };

  const value: AdminContextType = {
    admin,
    token,
    isAuthenticated: !!token && !!admin,
    isLoading,
    login,
    logout,
    verifyToken,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};
