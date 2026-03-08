import { Navigate, useLocation } from 'react-router';
import { useAdmin } from '../context/AdminContext';
import { useEffect, useState } from 'react';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
}

export const ProtectedAdminRoute = ({
  children,
  requiredPermissions = [],
}: ProtectedAdminRouteProps) => {
  const { isAuthenticated, admin, isLoading, verifyToken } = useAdmin();
  const location = useLocation();
  const [isVerified, setIsVerified] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (isAuthenticated) {
        const verified = await verifyToken();
        setIsVerified(verified);
      } else {
        setIsVerified(false);
      }
      setVerificationLoading(false);
    };

    verify();
  }, [isAuthenticated]);

  if (isLoading || verificationLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isVerified) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check required permissions
  if (requiredPermissions.length > 0 && admin) {
    const hasAllPermissions = requiredPermissions.every((perm) =>
      admin.permissions.includes(perm)
    );

    if (!hasAllPermissions) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
            <p className="text-gray-400 mb-6">You don't have permission to access this page.</p>
            <a
              href="/admin"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
