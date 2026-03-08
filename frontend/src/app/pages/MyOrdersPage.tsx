import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronRight } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useApp } from '../context/AppContext';
import { NoiseButton } from '@/components/ui/noise-button';
import { Order } from '../services/database';

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const { orders } = useApp();

  const userEmail = user?.emailAddresses[0]?.emailAddress || '';

  // Use useMemo to filter and sort orders without causing re-renders
  const myOrders = useMemo(() => {
    if (!isLoaded) return [];
    if (!userEmail) return [];
    
    const userOrders = orders.filter(
      order => order.customerEmail.toLowerCase() === userEmail.toLowerCase()
    );
    
    // Sort by date - newest first (create new array to avoid mutation)
    return [...userOrders].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [orders, userEmail, isLoaded]); // Recalculate when orders or userEmail changes

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock size={24} className="text-yellow-500" />,
          title: 'Pending',
          color: 'bg-yellow-50 text-yellow-700 border-yellow-200'
        };
      case 'processing':
        return {
          icon: <Package size={24} className="text-blue-500" />,
          title: 'Processing',
          color: 'bg-blue-50 text-blue-700 border-blue-200'
        };
      case 'shipped':
        return {
          icon: <Truck size={24} className="text-purple-500" />,
          title: 'Shipped',
          color: 'bg-purple-50 text-purple-700 border-purple-200'
        };
      case 'delivered':
        return {
          icon: <CheckCircle size={24} className="text-green-500" />,
          title: 'Delivered',
          color: 'bg-green-50 text-green-700 border-green-200'
        };
      case 'cancelled':
        return {
          icon: <XCircle size={24} className="text-red-500" />,
          title: 'Cancelled',
          color: 'bg-red-50 text-red-700 border-red-200'
        };
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <div className="text-center">
            <Package size={80} className="mx-auto mb-6 opacity-30" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Sign In to View Orders</h1>
            <p className="text-lg opacity-70 mb-8">
              You need to sign in to your account to view your order history and track shipments.
            </p>
            <div className="flex justify-center">
              <NoiseButton
                onClick={() => navigate('/sign-in?redirect_url=/orders')}
                containerClassName="w-fit"
              >
                Sign In Now
              </NoiseButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">My Orders</h1>
          <p className="text-lg opacity-70">{userEmail}</p>
        </div>

        {myOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <Package size={80} className="mx-auto mb-6 opacity-30" />
            <h2 className="text-2xl font-bold mb-4">No Orders Found</h2>
            <p className="text-lg opacity-70 mb-8">
              You haven't placed any orders yet. Start shopping now!
            </p>
            <div className="flex justify-center">
              <NoiseButton
                onClick={() => navigate('/shop')}
                containerClassName="w-fit"
              >
                Start Shopping
              </NoiseButton>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {myOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div
                  key={order._id}
                  onClick={() => navigate(`/order/${order._id}`)}
                  className="bg-white rounded-3xl p-6 md:p-8 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{order.orderNumber}</h3>
                        <ChevronRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-sm opacity-70">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 ${statusInfo.color}`}>
                      {statusInfo.icon}
                      <span className="font-bold">{statusInfo.title}</span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="flex items-center gap-4 mb-6 overflow-x-auto pb-2">
                    {order.items.slice(0, 4).map((item, index) => (
                      <div
                        key={index}
                        className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0"
                      >
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold opacity-70">+{order.items.length - 4}</span>
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t">
                    <div className="space-y-1">
                      <p className="text-sm opacity-70">{order.items.length} item(s)</p>
                      <p className="text-sm opacity-70">
                        Payment: <span className="capitalize">{order.paymentStatus}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm opacity-70 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold">₹{order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}