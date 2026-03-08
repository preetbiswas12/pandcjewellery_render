import { useParams, useNavigate } from 'react-router';
import { Package, Truck, CheckCircle, Clock, XCircle, MapPin, Mail, Phone, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NoiseButton } from '@/components/ui/noise-button';
import { Order } from '../services/database';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders } = useApp();

  const order = orders.find(o => o._id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <Package size={80} className="mx-auto mb-6 opacity-30" />
          <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
          <p className="text-lg opacity-70 mb-8">
            The order you're looking for doesn't exist or has been removed.
          </p>
          <NoiseButton
            onClick={() => navigate('/orders')}
            containerClassName="w-fit"
          >
            View All Orders
          </NoiseButton>
        </div>
      </div>
    );
  }

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock size={48} className="text-yellow-500" />,
          title: 'Order Pending',
          description: 'Your order has been received and is awaiting processing.',
          color: 'bg-yellow-50 border-yellow-200'
        };
      case 'processing':
        return {
          icon: <Package size={48} className="text-blue-500" />,
          title: 'Processing Order',
          description: 'We are preparing your order for shipment.',
          color: 'bg-blue-50 border-blue-200'
        };
      case 'shipped':
        return {
          icon: <Truck size={48} className="text-purple-500" />,
          title: 'Order Shipped',
          description: 'Your order is on its way to you!',
          color: 'bg-purple-50 border-purple-200'
        };
      case 'delivered':
        return {
          icon: <CheckCircle size={48} className="text-green-500" />,
          title: 'Order Delivered',
          description: 'Your order has been successfully delivered.',
          color: 'bg-green-50 border-green-200'
        };
      case 'cancelled':
        return {
          icon: <XCircle size={48} className="text-red-500" />,
          title: 'Order Cancelled',
          description: 'This order has been cancelled.',
          color: 'bg-red-50 border-red-200'
        };
    }
  };

  const getProgressPercentage = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 25;
      case 'processing': return 50;
      case 'shipped': return 75;
      case 'delivered': return 100;
      case 'cancelled': return 0;
    }
  };

  const statusInfo = getStatusInfo(order.status);

  // Order Timeline
  const timeline = [
    { status: 'pending', label: 'Order Placed', date: order.createdAt },
    { status: 'processing', label: 'Processing', date: order.updatedAt },
    { status: 'shipped', label: 'Shipped', date: null },
    { status: 'delivered', label: 'Delivered', date: null }
  ];

  const currentStatusIndex = timeline.findIndex(t => t.status === order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/orders')}
            className="text-sm opacity-70 hover:opacity-100 mb-4"
          >
            ← Back to My Orders
          </button>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Order Details</h1>
          <p className="text-lg opacity-70">{order.orderNumber}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div className={`border-2 rounded-3xl p-8 ${statusInfo.color}`}>
              <div className="flex flex-col items-center text-center">
                {statusInfo.icon}
                <h2 className="text-2xl font-bold mt-4 mb-2">{statusInfo.title}</h2>
                <p className="text-lg opacity-70">{statusInfo.description}</p>
              </div>

              {/* Progress Bar */}
              {order.status !== 'cancelled' && (
                <div className="mt-8">
                  <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-black transition-all duration-500"
                      style={{ width: `${getProgressPercentage(order.status)}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-4 text-xs opacity-70">
                    <span>Pending</span>
                    <span>Processing</span>
                    <span>Shipped</span>
                    <span>Delivered</span>
                  </div>
                </div>
              )}
            </div>

            {/* Order Timeline */}
            {order.status !== 'cancelled' && (
              <div className="bg-white rounded-3xl p-8 shadow-sm">
                <h3 className="text-xl font-bold mb-6">Order Timeline</h3>
                <div className="space-y-6">
                  {timeline.map((item, index) => {
                    const isPast = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    return (
                      <div key={item.status} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                              isPast
                                ? 'bg-black border-black text-white'
                                : 'bg-gray-100 border-gray-300 text-gray-400'
                            }`}
                          >
                            {isPast ? <CheckCircle size={20} /> : <Clock size={20} />}
                          </div>
                          {index < timeline.length - 1 && (
                            <div
                              className={`w-0.5 h-12 ${
                                isPast ? 'bg-black' : 'bg-gray-300'
                              }`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <p className={`font-bold ${isCurrent ? 'text-black' : isPast ? 'text-black' : 'text-gray-400'}`}>
                            {item.label}
                          </p>
                          {item.date && (
                            <p className="text-sm opacity-70 mt-1">
                              {new Date(item.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6">Order Items ({order.items.length})</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-white flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm opacity-70">SKU: {item.sku}</p>
                      <p className="text-sm opacity-70">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm opacity-70">₹{item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="border-t mt-6 pt-6 space-y-2">
                <div className="flex justify-between">
                  <span className="opacity-70">Subtotal</span>
                  <span>₹{order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount{order.couponCode && ` (${order.couponCode})`}</span>
                    <span>-₹{order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="opacity-70">Shipping</span>
                  <span>₹{order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Customer Info</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User size={20} className="opacity-70 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm opacity-70">Name</p>
                    <p className="font-medium">{order.customerName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={20} className="opacity-70 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm opacity-70">Email</p>
                    <p className="font-medium break-all">{order.customerEmail}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={20} className="opacity-70 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm opacity-70">Phone</p>
                    <p className="font-medium">{order.customerPhone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={20} className="opacity-70" />
                <h3 className="text-lg font-bold">Shipping Address</h3>
              </div>
              <div className="space-y-1">
                <p className="font-medium">{order.customerName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Payment Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="opacity-70">Payment Status</span>
                  <span className="font-medium capitalize">{order.paymentStatus}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-70">Payment Method</span>
                  <span className="font-medium capitalize">{order.paymentMethod || 'COD'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}