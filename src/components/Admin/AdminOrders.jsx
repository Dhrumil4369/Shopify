import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaEye, FaFilter, FaSearch, FaCalendarAlt, FaDollarSign, FaTruck, FaPrint, FaTrash, FaTimes, FaSpinner } from "react-icons/fa";

const API_BASE_URL = "https://dhrumil-backend.vercel.app/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    delivered: 0,
    processing: 0,
    shipped: 0,
    cancelled: 0
  });
  const renderStars = (rating = 0) => {
  const maxStars = 5;
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxStars }).map((_, index) => (
        <span key={index} className={`text-lg ${index < rating ? "text-yellow-400" : "text-gray-300"}`}>
          ★
        </span>
      ))}
    </div>
  );
};

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await axios.get(`${API_BASE_URL}/orders`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.data && response.data.success) {
        const fetchedOrders = response.data.orders || [];
        console.log("Fetched orders:", fetchedOrders.length);
        
        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders);
        calculateStats(fetchedOrders);
        
        localStorage.setItem("adminOrders", JSON.stringify(fetchedOrders));
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      
      if (err.code === 'ECONNABORTED' || err.name === 'AbortError') {
        setError("Request timed out. Please check your connection.");
      } else if (err.response) {
        setError(`Server error: ${err.response.status} - ${err.response.statusText}`);
      } else if (err.request) {
        setError("No response from server. Please try again.");
      } else {
        setError("Failed to load orders. Please try again.");
      }
      
      const savedOrders = localStorage.getItem("adminOrders");
      if (savedOrders) {
        try {
          const parsedOrders = JSON.parse(savedOrders);
          console.log("Using localStorage data:", parsedOrders.length);
          setOrders(parsedOrders);
          setFilteredOrders(parsedOrders);
          calculateStats(parsedOrders);
        } catch (parseError) {
          console.error("Error parsing saved orders:", parseError);
        }
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Calculate statistics
  const calculateStats = useCallback((ordersList) => {
    if (!ordersList || !Array.isArray(ordersList)) return;
    
    const totalOrders = ordersList.length;
    const totalRevenue = ordersList.length * 99.99;
    const delivered = ordersList.filter(order => 
      order.status && order.status.toLowerCase() === "delivered"
    ).length;
    const processing = ordersList.filter(order => 
      !order.status || order.status.toLowerCase() === "processing"
    ).length;
    const shipped = ordersList.filter(order => 
      order.status && order.status.toLowerCase() === "shipped"
    ).length;
    const cancelled = ordersList.filter(order => 
      order.status && order.status.toLowerCase() === "cancelled"
    ).length;

    setStats({
      totalOrders,
      totalRevenue,
      delivered,
      processing,
      shipped,
      cancelled
    });
  }, []);

  // Apply filters
  const applyFilters = useCallback(() => {
    if (!orders || !Array.isArray(orders)) return [];
    
    let result = [...orders];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => {
        if (!order) return false;
        
        return (
          (order.order_id && order.order_id.toLowerCase().includes(term)) ||
          (order._id && order._id.toLowerCase().includes(term)) ||
          (order.shippingInfo?.fullName && order.shippingInfo.fullName.toLowerCase().includes(term)) ||
          (order.shippingInfo?.email && order.shippingInfo.email.toLowerCase().includes(term)) ||
          (order.paymentMethod && order.paymentMethod.toLowerCase().includes(term)) ||
          (order.shippingInfo?.city && order.shippingInfo.city.toLowerCase().includes(term))
        );
      });
    }
    
    if (filterStatus !== "all") {
      result = result.filter(order => {
        if (!order || !order.paymentMethod) return false;
        
        if (filterStatus === "paid") {
          return order.paymentMethod && order.paymentMethod !== "cod";
        }
        
        return order.paymentMethod && order.paymentMethod.toLowerCase() === filterStatus.toLowerCase();
      });
    }
    
    return result;
  }, [orders, searchTerm, filterStatus]);

  // Delete an order
  const deleteOrder = async (orderId) => {
    try {
      setError(null);
      const response = await axios.delete(`${API_BASE_URL}/orders/delete/${orderId}`);
      if (response.data && response.data.success) {
        setSuccessMessage("Order deleted successfully!");
        await fetchOrders();
        setTimeout(() => setSuccessMessage(""), 3000);
        return true;
      }
    } catch (err) {
      console.error("Error deleting order:", err);
      setError("Failed to delete order. Please try again.");
      return false;
    }
  };

  // Initialize
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Update filtered orders
  useEffect(() => {
    const filtered = applyFilters();
    setFilteredOrders(filtered);
  }, [applyFilters]);

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    
    switch (status.toLowerCase()) {
      case "delivered": 
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "processing": 
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "shipped": 
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "cancelled": 
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default: 
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getPaymentStatus = (paymentMethod) => {
    return paymentMethod && paymentMethod !== "cod" ? "Paid" : "Pending";
  };

  const getPaymentMethodColor = (method) => {
    if (!method) return "bg-gray-100 text-gray-800";
    
    switch (method.toLowerCase()) {
      case "credit":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "upi":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "cod":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const openViewModal = (order) => {
    setCurrentOrder(order);
    setShowViewModal(true);
  };

  const openDeleteModal = (order) => {
    setOrderToDelete(order);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return;
    
    const success = await deleteOrder(orderToDelete._id);
    if (success) {
      setShowDeleteModal(false);
      setOrderToDelete(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  const printInvoice = () => {
    if (!currentOrder) return;
    
    const invoiceContent = `
=================================
        INVOICE RECEIPT
=================================
Order ID: ${currentOrder.order_id}
Date: ${formatDate(currentOrder.createdAt)}
Customer: ${currentOrder.shippingInfo?.fullName || 'N/A'}
Email: ${currentOrder.shippingInfo?.email || 'N/A'}
Phone: ${currentOrder.shippingInfo?.phoneNumber || 'N/A'}
---------------------------------
SHIPPING ADDRESS:
${currentOrder.shippingInfo?.address || 'N/A'}
${currentOrder.shippingInfo?.city || ''}, ${currentOrder.shippingInfo?.state || ''} ${currentOrder.shippingInfo?.pincode || ''}
---------------------------------
Payment Method: ${currentOrder.paymentMethod?.toUpperCase() || 'Unknown'}
Payment Status: ${getPaymentStatus(currentOrder.paymentMethod)}
=================================
Thank you for your order!
=================================
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${currentOrder.order_id}</title>
          <style>
            body { font-family: monospace; padding: 20px; line-height: 1.5; }
            .invoice { white-space: pre-wrap; }
            @media print { button { display: none; } }
            .header { text-align: center; margin-bottom: 20px; }
            .section { margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="invoice">${invoiceContent}</div>
          <div style="margin-top: 20px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #4F46E5; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">
              Print Invoice
            </button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #6B7280; color: white; border: none; border-radius: 5px; cursor: pointer;">
              Close
            </button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading orders...</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Fetching data from server</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Success & Error Messages */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 
        rounded-lg flex justify-between items-center animate-fade-in">
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            {successMessage}
          </span>
          <button 
            onClick={() => setSuccessMessage("")} 
            className="text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100"
          >
            <FaTimes />
          </button>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 
        rounded-lg flex justify-between items-center animate-fade-in">
          <span className="flex items-center gap-2">
            <FaTimes />
            {error}
          </span>
          <button 
            onClick={() => setError(null)} 
            className="text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Orders Management</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
              Manage and track customer orders ({stats.totalOrders} total)
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              disabled={isRefreshing}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 
              rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium 
              flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRefreshing ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Refreshing...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Order ID, Customer Name, Email, or City..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 
              rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg 
              px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none min-w-[150px]"
            >
              <option value="all">All Orders</option>
              <option value="credit">Credit Card</option>
              <option value="upi">UPI Payment</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalOrders}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">${stats.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Delivered</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.delivered}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-900/10 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Processing</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.processing}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Shipped</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.shipped}</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Cancelled</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.cancelled}</p>
          </div>
        </div>
      </div>

      {/* Orders Table/Cards */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Payment</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-4xl mb-4">📦</div>
                      <p className="text-lg font-medium">No orders found</p>
                      <p className="text-sm mt-2">Try adjusting your search or filter criteria</p>
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setFilterStatus("all");
                        }}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800 dark:text-white">{order.order_id}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ID: {order._id?.substring(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white truncate max-w-[200px]">
                          {order.shippingInfo?.fullName || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                          {order.shippingInfo?.email || 'No email'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 whitespace-nowrap">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(order.paymentMethod)}`}>
                        {order.paymentMethod?.toUpperCase() || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        getPaymentStatus(order.paymentMethod) === 'Paid' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {getPaymentStatus(order.paymentMethod)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => openViewModal(order)} 
                          className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 
                          rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(order)} 
                          className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 
                          rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                          title="Delete Order"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {filteredOrders.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                <span>Showing {filteredOrders.length} of {orders.length} orders</span>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <div className="flex flex-col items-center justify-center">
                <div className="text-4xl mb-4">📦</div>
                <p className="text-lg font-medium">No orders found</p>
                <p className="text-sm mt-2">Try adjusting your search or filter</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterStatus("all");
                  }}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {filteredOrders.map((order) => (
                <div key={order._id} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white truncate max-w-[200px]">
                        {order.order_id}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(order.createdAt)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      getPaymentStatus(order.paymentMethod) === 'Paid' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {getPaymentStatus(order.paymentMethod)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Customer</p>
                      <p className="font-medium truncate">{order.shippingInfo?.fullName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Payment</p>
                      <p className={`font-medium truncate px-2 py-1 rounded-full text-xs ${getPaymentMethodColor(order.paymentMethod)}`}>
                        {order.paymentMethod?.toUpperCase() || 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Email</p>
                      <p className="truncate text-sm">{order.shippingInfo?.email || 'No email'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">City</p>
                      <p className="truncate">{order.shippingInfo?.city || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => openViewModal(order)} 
                      className="flex items-center gap-2 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg 
                      bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <FaEye size={14} />
                      <span className="text-sm">View</span>
                    </button>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openDeleteModal(order)} 
                        className="p-2 text-red-600 dark:text-red-400 rounded-lg 
                        bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                        title="Delete"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showViewModal && currentOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                    Order Details: {currentOrder.order_id}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
                    {formatDateTime(currentOrder.createdAt)}
                  </p>
                </div>
                <button 
                  onClick={() => setShowViewModal(false)} 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-2xl p-2 
                  hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Customer Information */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 md:p-6">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      👤 Customer Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {currentOrder.shippingInfo?.fullName || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {currentOrder.shippingInfo?.email || 'No email'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {currentOrder.shippingInfo?.phoneNumber || 'No phone'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">City</p>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {currentOrder.shippingInfo?.city || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Details */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 md:p-6">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <FaTruck />
                      <span>Shipping Details</span>
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {currentOrder.shippingInfo?.address || 'No address provided'}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">City</p>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {currentOrder.shippingInfo?.city || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">State</p>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {currentOrder.shippingInfo?.state || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Pincode</p>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {currentOrder.shippingInfo?.pincode || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Order Information */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 md:p-6">
                    <h3 className="font-semibold text-lg mb-4">📦 Order Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Order ID</p>
                        <p className="font-medium text-gray-800 dark:text-white">{currentOrder.order_id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
                        <p className="font-medium text-gray-800 dark:text-white">{formatDateTime(currentOrder.createdAt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Updated At</p>
                        <p className="font-medium text-gray-800 dark:text-white">{formatDateTime(currentOrder.updatedAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 md:p-6">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <FaDollarSign />
                      <span>Payment Information</span>
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {currentOrder.paymentMethod?.toUpperCase() || 'Unknown'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Payment Status</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          getPaymentStatus(currentOrder.paymentMethod) === 'Paid' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }`}>
                          {getPaymentStatus(currentOrder.paymentMethod)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-primary/10 rounded-xl p-4 md:p-6">
                    <h3 className="font-semibold text-lg mb-4">⚡ Quick Actions</h3>
                    <div className="space-y-3">
                      <button 
                        onClick={printInvoice} 
                        className="w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-gray-800 
                        text-primary border border-primary rounded-lg hover:bg-primary hover:text-white 
                        transition-colors font-medium"
                      >
                        <FaPrint />
                        <span>Print Invoice</span>
                      </button>
                      <button 
                        onClick={() => setShowViewModal(false)} 
                        className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 
                        rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                      >
                        Close Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && orderToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaTrash className="text-red-600 dark:text-red-400 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Delete Order</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Are you sure you want to delete order <strong>{orderToDelete.order_id}</strong>? 
                  This action cannot be undone.
                </p>
              </div>
              
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg 
                  hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors 
                  font-medium flex items-center gap-2"
                >
                  <FaTrash />
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animation */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AdminOrders;