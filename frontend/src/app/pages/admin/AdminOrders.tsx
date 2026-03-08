import { useState, useMemo } from 'react';
import { Search, Filter, Eye, CheckCircle, Clock, Truck, XCircle, Package } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../services/database';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Order['status']>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'processing': return <Package size={16} />;
      case 'shipped': return <Truck size={16} />;
      case 'delivered': return <CheckCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
    }
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
  };

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  // Generate chart data for the last 7 days
  const chartData = useMemo(() => {
    const days = 7;
    const data = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const dayOrders = orders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= date && orderDate < nextDate;
      });

      const dayRevenue = dayOrders.reduce((sum, order) => sum + order.total, 0);

      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        orders: dayOrders.length,
        revenue: Math.round(dayRevenue)
      });
    }

    return data;
  }, [orders]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Orders</h1>
        <p className="text-lg opacity-70">{orderStats.total} total orders</p>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-4">
          <p className="text-sm opacity-70 mb-1">Total</p>
          <p className="text-2xl font-bold">{orderStats.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-2xl p-4">
          <p className="text-sm opacity-70 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-800">{orderStats.pending}</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4">
          <p className="text-sm opacity-70 mb-1">Processing</p>
          <p className="text-2xl font-bold text-blue-800">{orderStats.processing}</p>
        </div>
        <div className="bg-purple-50 rounded-2xl p-4">
          <p className="text-sm opacity-70 mb-1">Shipped</p>
          <p className="text-2xl font-bold text-purple-800">{orderStats.shipped}</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-4">
          <p className="text-sm opacity-70 mb-1">Delivered</p>
          <p className="text-2xl font-bold text-green-800">{orderStats.delivered}</p>
        </div>
        <div className="bg-red-50 rounded-2xl p-4">
          <p className="text-sm opacity-70 mb-1">Cancelled</p>
          <p className="text-2xl font-bold text-red-800">{orderStats.cancelled}</p>
        </div>
      </div>

      {/* Order Status Chart */}
      <div className="bg-white rounded-2xl p-6 mb-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold">Order Trends (Last 7 Days)</h3>
          <p className="text-sm text-gray-500">Track daily order volume and revenue</p>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#888"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#888"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '10px'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Orders"
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Revenue (₹)"
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" size={20} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="pl-12 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black appearance-none bg-white min-w-[180px]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Order</th>
                <th className="px-6 py-4 text-left font-semibold">Customer</th>
                <th className="px-6 py-4 text-left font-semibold">Date</th>
                <th className="px-6 py-4 text-left font-semibold">Total</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm opacity-70">{order.items.length} items</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-sm opacity-70">{order.customerEmail}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                    <p className="text-xs opacity-70">{new Date(order.createdAt).toLocaleTimeString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold">₹{order.total.toFixed(2)}</p>
                    <p className="text-xs opacity-70">{order.paymentStatus}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-all"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="text-center py-12 opacity-70">
              <p>No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <>
          <div className="fixed inset-0 bg-magenta-950/50 z-[990]" onClick={() => setSelectedOrder(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto z-[999]">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">{selectedOrder.orderNumber}</h2>
                <p className="text-sm opacity-70">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()} at {new Date(selectedOrder.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <XCircle size={24} />
              </button>
            </div>

            {/* Status Update */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Update Status</label>
              <select
                value={selectedOrder.status}
                onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value as Order['status'])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Customer Info */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <h3 className="font-semibold mb-3">Customer Information</h3>
              <div className="space-y-2">
                <p><span className="opacity-70">Name:</span> <span className="font-medium">{selectedOrder.customerName}</span></p>
                <p><span className="opacity-70">Email:</span> <span className="font-medium">{selectedOrder.customerEmail}</span></p>
                <p><span className="opacity-70">Phone:</span> <span className="font-medium">{selectedOrder.customerPhone}</span></p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <h3 className="font-semibold mb-3">Shipping Address</h3>
              <p>{selectedOrder.shippingAddress.street}</p>
              <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
              <p>{selectedOrder.shippingAddress.country}</p>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <img src={item.image} alt={item.productName} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm opacity-70">SKU: {item.sku}</p>
                      <p className="text-sm opacity-70">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="opacity-70">Subtotal</span>
                  <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount{selectedOrder.couponCode && ` (${selectedOrder.couponCode})`}</span>
                    <span>-₹{selectedOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="opacity-70">Shipping</span>
                  <span>₹{selectedOrder.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total</span>
                  <span>₹{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}