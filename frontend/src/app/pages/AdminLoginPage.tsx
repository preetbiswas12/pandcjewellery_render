import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { gsap } from 'gsap';
import { API_BASE_URL } from '../services/razorpay';

// Note: API_BASE_URL is dynamically configured for HTTPS in production (v1.0.1)

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const pageRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Animation on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.login-container', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin');
    }
  }, []);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
    setLoginError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setLoginError('');

    try {
      const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.message || 'Login failed. Please try again.');
        setLoginAttempts((prev) => prev + 1);
        return;
      }

      // Save token to localStorage
      localStorage.setItem('adminToken', data.data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.data.admin));

      // Redirect to admin dashboard
      navigate('/admin');
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An error occurred. Please try again.');
      setLoginAttempts((prev) => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="login-container relative z-10 w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 px-8 py-12 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
              <Lock size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-gray-400">Secure access to dashboard</p>
          </div>

          {/* Error message */}
          {loginError && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-500 text-sm font-medium">{loginError}</p>
                {loginAttempts > 0 && (
                  <p className="text-red-400 text-xs mt-1">
                    Attempt: {loginAttempts}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="admin@example.com"
                  className={`w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border transition-colors outline-none ${
                    errors.email
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-white/10 focus:border-blue-500'
                  } text-white placeholder-gray-500 disabled:opacity-50`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3 rounded-lg bg-white/5 border transition-colors outline-none ${
                    errors.password
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-white/10 focus:border-blue-500'
                  } text-white placeholder-gray-500 disabled:opacity-50`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1.5">{errors.password}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm">
              Protected Admin Area
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
