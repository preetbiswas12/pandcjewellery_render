import { useState, useMemo } from 'react';
import { Search, Eye, CheckCircle, Clock, Truck, XCircle, Package, X } from 'lucide-react';
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
    <div className="space-y-4 sm:space-y-6 md:space-y-8 w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-1 sm:mb-2">Orders</h1>
        <p className="text-sm sm:text-base md:text-lg text-slate-600">{orderStats.total} total orders</p>
      </div>

      {/* Order Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {/* Total Orders */}
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-2">Total Orders</p>
              <p className="text-3xl font-bold text-slate-900">{orderStats.total}</p>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
              <ShoppingCart size={24} className="text-slate-600" />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-amber-700 mb-2">Pending</p>
              <p className="text-3xl font-bold text-amber-600">{orderStats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-amber-600" />
            </div>
          </div>
        </div>

        {/* Processing */}
        <div className="bg-white rounded-2xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-blue-700 mb-2">Processing</p>
              <p className="text-3xl font-bold text-blue-600">{orderStats.processing}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Shipped */}
        <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-purple-700 mb-2">Shipped</p>
              <p className="text-3xl font-bold text-purple-600">{orderStats.shipped}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Truck size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        {/* Delivered */}
        <div className="bg-white rounded-2xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-green-700 mb-2">Delivered</p>
              <p className="text-3xl font-bold text-green-600">{orderStats.delivered}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Cancelled */}
        <div className="bg-white rounded-2xl p-6 border border-red-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-red-700 mb-2">Cancelled</p>
              <p className="text-3xl font-bold text-red-600">{orderStats.cancelled}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle size={24} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Order Trends Chart */}
      <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-200 shadow-sm w-full overflow-x-hidden">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1 sm:mb-2">Order Trends</h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-600">Last 7 days activity</p>
        </div>
        <div className="w-full h-64 sm:h-80 md:h-96 -mx-2 sm:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8"
                style={{ fontSize: '11px' }}
              />
              <YAxis 
                stroke="#94a3b8"
                style={{ fontSize: '11px' }}
                width={35}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Line 
              type="monotone" 
              dataKey="orders" 
              stroke="#3b82f6" 
              strokeWidth={3}
              name="Orders"
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#10b981" 
              strokeWidth={3}
              name="Revenue (₹)"
              dot={{ fill: '#10b981', r: 4 }}
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search order, customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm border border-slate-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-magenta-600 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-slate-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-magenta-600 focus:border-transparent bg-white font-medium"
          >
            <option value="all">All Status</option>
            <option value="pending">🟡 Pending</option>
            <option value="processing">🔵 Processing</option>
            <option value="shipped">🟣 Shipped</option>
            <option value="delivered">🟢 Delivered</option>
            <option value="cancelled">🔴 Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table - Desktop View */}
      <div className="hidden sm:block bg-white rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-bold text-slate-900">Order</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-bold text-slate-900">Customer</th>
                <th className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-bold text-slate-900">Date</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-bold text-slate-900">Total</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-bold text-slate-900">Status</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center font-bold text-slate-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 sm:px-4 md:px-6 py-8 sm:py-12 text-center">
                    <p className="text-slate-500 font-medium text-sm">No orders found</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-4">
                      <p className="font-bold text-xs sm:text-sm text-slate-900">{order.orderNumber}</p>
                      <p className="text-xs text-slate-500">{order.items.length} items</p>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-4">
                      <p className="font-medium text-xs sm:text-sm text-slate-900 truncate">{order.customerName}</p>
                      <p className="text-xs text-slate-500 truncate">{order.customerEmail}</p>
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-4 md:px-6 py-2.5 sm:py-4">
                      <p className="text-xs text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleTimeString()}</p>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-4">
                      <p className="font-bold text-xs sm:text-sm text-slate-900">₹{order.total.toFixed(2)}</p>
                      <p className="text-xs text-slate-500 mt-1">{order.paymentStatus}</p>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-4">
                      <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize hidden sm:inline">{order.status}</span>
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-2.5 sm:py-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-lg hover:bg-magenta-100 transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} className="sm:w-5 sm:h-5 text-magenta-600" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders Card View - Mobile */}
      <div className="sm:hidden space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center border border-slate-200">
            <p className="text-slate-500 font-medium text-sm">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg p-4 border border-slate-200 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-slate-900 truncate">{order.orderNumber}</p>
                  <p className="text-xs text-slate-500">{order.items.length} items</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="flex-shrink-0 p-1.5 rounded-lg hover:bg-magenta-100 transition-colors"
                  title="View Details"
                >
                  <Eye size={16} className="text-magenta-600" />
                </button>
              </div>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Customer:</span>
                  <span className="font-medium text-slate-900 truncate">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Date:</span>
                  <span className="text-slate-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Total:</span>
                  <span className="font-bold text-slate-900">₹{order.total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-slate-200">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[990] transition-opacity" 
            onClick={() => setSelectedOrder(null)} 
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-[95vw] sm:w-full max-w-3xl max-h-[90vh] overflow-y-auto z-[999] border border-slate-200">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-4 sm:p-8 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2 truncate">{selectedOrder.orderNumber}</h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  {new Date(selectedOrder.createdAt).toLocaleDateString()} at {new Date(selectedOrder.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="flex-shrink-0 p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={20} className="sm:w-6 sm:h-6 text-slate-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-8 space-y-4 sm:space-y-6">
              {/* Status Update */}
              <div className="bg-gradient-to-br from-magenta-50 to-pink-50 rounded-lg sm:rounded-2xl p-3 sm:p-6 border border-magenta-200">
                <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-2 sm:mb-3">Update Order Status</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value as Order['status'])}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-magenta-300 rounded-lg sm:rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-magenta-600 focus:border-transparent font-medium"
                >
                  <option value="pending">🟡 Pending</option>
                  <option value="processing">🔵 Processing</option>
                  <option value="shipped">🟣 Shipped</option>
                  <option value="delivered">🟢 Delivered</option>
                  <option value="cancelled">🔴 Cancelled</option>
                </select>
              </div>

              {/* Customer Info */}
              <div className="bg-slate-50 rounded-lg sm:rounded-2xl p-3 sm:p-6 border border-slate-200">
                <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">Customer Information</h3>
                <div className="space-y-2 sm:space-y-3 text-sm">
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-600">Name:</span>
                    <span className="font-medium text-slate-900 text-right">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-600">Email:</span>
                    <span className="font-medium text-slate-900 text-right truncate">{selectedOrder.customerEmail}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-600">Phone:</span>
                    <span className="font-medium text-slate-900">{selectedOrder.customerPhone}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-slate-50 rounded-lg sm:rounded-2xl p-3 sm:p-6 border border-slate-200">
                <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">Shipping Address</h3>
                <div className="space-y-1 text-xs sm:text-sm text-slate-700">
                  <p className="font-medium">{selectedOrder.shippingAddress.street}</p>
                  <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-3 sm:mb-4">Order Items</h3>
                <div className="space-y-2 sm:space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 sm:gap-4 p-2 sm:p-4 bg-white border border-slate-200 rounded-lg sm:rounded-xl hover:shadow-sm transition-shadow">
                      <img src={item.image} alt={item.productName} className="w-12 sm:w-16 h-12 sm:h-16 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-xs sm:text-base text-slate-900 truncate">{item.productName}</p>
                        <p className="text-xs text-slate-500 mt-1">SKU: {item.sku}</p>
                        <p className="text-sm text-slate-600 mt-2">Qty: <span className="font-semibold">{item.quantity}</span></p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm text-slate-500">₹{item.price.toFixed(2)} × {item.quantity}</p>
                        <p className="text-lg font-bold text-slate-900 mt-1">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-700">Subtotal:</span>
                  <span className="font-semibold text-slate-900">₹{selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>Discount{selectedOrder.couponCode && ` (${selectedOrder.couponCode})`}</span>
                    <span>-₹{selectedOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-700">Shipping:</span>
                  <span className="font-semibold text-slate-900">₹{selectedOrder.shipping.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-300 pt-3 flex justify-between">
                  <span className="text-lg font-bold text-slate-900">Total:</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-magenta-600 to-pink-600 bg-clip-text text-transparent">₹{selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
}