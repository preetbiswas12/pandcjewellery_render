import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Edit2, MapPin, Phone, Mail, LogOut, ChevronRight, Package, Heart, Settings } from 'lucide-react';
import { gsap } from 'gsap';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useApp } from '../context/AppContext';
import { NoiseButton } from '@/components/ui/noise-button';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { username } = useParams<{ username?: string }>();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { orders, wishlist } = useApp();
  const profileRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    joinedDate: new Date().toLocaleDateString()
  });

  useEffect(() => {
    if (!isLoaded) return;

    // If username is provided in URL, check if it matches current user
    if (username && user) {
      const currentUsername = (user.firstName || '').toLowerCase();
      const urlUsername = username.toLowerCase();
      
      // If viewing someone else's profile
      if (currentUsername !== urlUsername) {
        // For now, redirect to their own profile
        // In the future, you could show a public profile view
        navigate(`/${currentUsername}/profile`);
        return;
      }
    }

    if (!user) {
      if (isLoaded) {
        navigate('/sign-in');
      }
      return;
    }

    setUserData(prev => ({
      ...prev,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.emailAddresses[0]?.emailAddress || '',
    }));

    // Animate on mount
    const ctx = gsap.context(() => {
      gsap.from(profileRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out'
      });
    }, profileRef);

    return () => ctx.revert();
  }, [isLoaded, user, username, navigate]);

  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const userOrders = orders.filter(
    order => order.customerEmail.toLowerCase() === (userEmail?.toLowerCase() || '')
  );

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white py-8 md:py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Package size={80} className="mx-auto mb-6 opacity-30" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Sign In to Your Profile</h1>
          <p className="text-lg opacity-70 mb-8">
            You need to sign in to view your profile and orders.
          </p>
          <NoiseButton
            onClick={() => navigate('/sign-in')}
            containerClassName="w-fit"
          >
            Sign In Now
          </NoiseButton>
        </div>
      </div>
    );
  }

  return (
    <div ref={profileRef} className="min-h-screen bg-white py-8 md:py-16 px-4 md:px-8 lg:px-12 xl:px-20 2xl:px-[80px]">
      <div className="max-w-7xl mx-auto">
        {/* Header with Edit Button */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">My Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
              isEditing
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'border-2 border-black hover:bg-black hover:text-white'
            }`}
          >
            <Edit2 size={18} />
            {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,350px] gap-8 lg:gap-12">
          {/* Personal Information Section */}
          <div className="space-y-8">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-[#8ba888] to-[#b8c4b5] rounded-3xl lg:rounded-[40px] p-8 md:p-12 lg:p-16 text-white">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-lg opacity-80 mb-2">Welcome back,</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      className="text-4xl md:text-5xl lg:text-6xl font-bold text-black bg-white/90 px-4 py-2 rounded-lg w-full"
                    />
                  ) : (
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">{userData.name}</h2>
                  )}
                </div>
              </div>
              <p className="text-lg opacity-80">Member since {userData.joinedDate}</p>
            </div>

            {/* Contact Information */}
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-3xl lg:rounded-[40px] p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-8">Contact Information</h3>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <Mail size={24} className="mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm opacity-70 mb-2">Email Address</p>
                    <p className="text-lg md:text-xl font-medium">{userData.email}</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <Phone size={24} className="mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm opacity-70 mb-2">Phone Number</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={userData.phone}
                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                        className="text-lg md:text-xl font-medium border border-[rgba(0,0,0,0.2)] rounded-lg px-3 py-2 w-full"
                      />
                    ) : (
                      <p className="text-lg md:text-xl font-medium">{userData.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-3xl lg:rounded-[40px] p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
                <MapPin size={28} />
                Shipping Address
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Street */}
                <div className="md:col-span-2">
                  <label className="block text-sm opacity-70 mb-2 font-medium">Street Address</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.address.street}
                      onChange={(e) => setUserData({
                        ...userData,
                        address: { ...userData.address, street: e.target.value }
                      })}
                      className="w-full border border-[rgba(0,0,0,0.2)] rounded-lg px-4 py-3 text-lg"
                      placeholder="Enter your street address"
                    />
                  ) : (
                    <p className="text-lg font-medium">{userData.address.street || 'Not provided'}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm opacity-70 mb-2 font-medium">City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.address.city}
                      onChange={(e) => setUserData({
                        ...userData,
                        address: { ...userData.address, city: e.target.value }
                      })}
                      className="w-full border border-[rgba(0,0,0,0.2)] rounded-lg px-4 py-3 text-lg"
                      placeholder="Enter your city"
                    />
                  ) : (
                    <p className="text-lg font-medium">{userData.address.city || 'Not provided'}</p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm opacity-70 mb-2 font-medium">State</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.address.state}
                      onChange={(e) => setUserData({
                        ...userData,
                        address: { ...userData.address, state: e.target.value }
                      })}
                      className="w-full border border-[rgba(0,0,0,0.2)] rounded-lg px-4 py-3 text-lg"
                      placeholder="Enter your state"
                    />
                  ) : (
                    <p className="text-lg font-medium">{userData.address.state || 'Not provided'}</p>
                  )}
                </div>

                {/* ZIP Code */}
                <div>
                  <label className="block text-sm opacity-70 mb-2 font-medium">ZIP Code</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.address.zipCode}
                      onChange={(e) => setUserData({
                        ...userData,
                        address: { ...userData.address, zipCode: e.target.value }
                      })}
                      className="w-full border border-[rgba(0,0,0,0.2)] rounded-lg px-4 py-3 text-lg"
                      placeholder="Enter your ZIP code"
                    />
                  ) : (
                    <p className="text-lg font-medium">{userData.address.zipCode || 'Not provided'}</p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm opacity-70 mb-2 font-medium">Country</label>
                  <p className="text-lg font-medium">{userData.address.country}</p>
                </div>
              </div>

              {isEditing && (
                <button
                  onClick={handleSaveProfile}
                  className="mt-8 w-full bg-green-500 text-white py-4 rounded-full font-medium text-lg hover:bg-green-600 transition-all"
                >
                  Save Address Changes
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-3xl p-8">
              <div className="space-y-6">
                {/* Orders */}
                <button
                  onClick={() => navigate('/orders')}
                  className="w-full p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-sm opacity-70 font-medium">Total Orders</p>
                      <p className="text-3xl font-bold">{userOrders.length}</p>
                    </div>
                    <Package size={32} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => navigate('/wishlist')}
                  className="w-full p-4 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="text-sm opacity-70 font-medium">Wishlist Items</p>
                      <p className="text-3xl font-bold">{wishlist.length}</p>
                    </div>
                    <Heart size={32} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white border border-[rgba(0,0,0,0.1)] rounded-3xl p-8 space-y-4">
              <button
                onClick={() => navigate('/orders')}
                className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all group"
              >
                <span className="font-medium">View All Orders</span>
                <ChevronRight size={20} className="opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                onClick={() => navigate('/shop')}
                className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all group"
              >
                <span className="font-medium">Continue Shopping</span>
                <ChevronRight size={20} className="opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>

              <button
                className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all group"
              >
                <span className="font-medium">Settings</span>
                <Settings size={20} className="opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-all mt-8"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
