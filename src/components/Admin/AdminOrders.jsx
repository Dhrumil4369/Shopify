
  import React, { useState, useEffect } from "react";
  import { FaEye, FaFilter, FaSearch, FaCalendarAlt, FaDollarSign, FaTruck, FaPrint } from "react-icons/fa";

  const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [showViewModal, setShowViewModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [loading, setLoading] = useState(true);

    // Initialize with sample data
    useEffect(() => {
      // Simulate API call delay
      setTimeout(() => {
        const sampleOrders = [
          {
            id: "#ORD001",
            customer: { 
              name: "Dhruvil ", 
              email: "dhruvil@example.com", 
              phone: "+1 234-567-8900" 
            },
            total: 156.98,
            status: "Delivered",
            date: "Dec 28, 2025",
            items: [
              { name: "Nike Air Max Shoes", qty: 1, price: 120, total: 120 },
              { name: "Sports Socks", qty: 2, price: 18.49, total: 36.98 }
            ],
            shipping: { 
              address: "123 Main St, New York, NY 10001", 
              method: "Express Delivery", 
              tracking: "TRK123456789" 
            },
            payment: { 
              method: "Credit Card", 
              status: "Paid", 
              transaction: "TXN123456" 
            }
          },
          {
            id: "#ORD002",
            customer: { 
              name: "Dhrumil Savaliya", 
              email: "dhrumil@example.com", 
              phone: "+1 234-567-8901" 
            },
            total: 89.00,
            status: "Processing",
            date: "Dec 30, 2025",
            items: [
              { name: "Summer Dress", qty: 1, price: 89, total: 89 }
            ],
            shipping: { 
              address: "456 Park Ave, San Francisco, CA 94107", 
              method: "Standard Shipping", 
              tracking: null 
            },
            payment: { 
              method: "Pay on Delivery", 
              status: "Pending", 
              transaction: null 
            }
          },
          {
            id: "#ORD003",
            customer: { 
              name: "Meet", 
              email: "meet@example.com", 
              phone: "+1 234-567-8902" 
            },
            total: 320.50,
            status: "Shipped",
            date: "Jan 01, 2026",
            items: [
              { name: "Gaming Laptop", qty: 1, price: 320.50, total: 320.50 }
            ],
            shipping: { 
              address: "789 Broadway, Chicago, IL 60601", 
              method: "Express Delivery", 
              tracking: "TRK987654321" 
            },
            payment: { 
              method: "UPI Payment", 
              status: "Paid", 
              transaction: "TXN789012" 
            }
          },
          {
            id: "#ORD004",
            customer: { 
              name: "Miraj Rajput", 
              email: "rajput@example.com", 
              phone: "+1 234-567-8903" 
            },
            total: 245.75,
            status: "Processing",
            date: "Jan 02, 2026",
            items: [
              { name: "Wireless Headphones", qty: 1, price: 129.99, total: 129.99 },
              { name: "Phone Case", qty: 2, price: 24.99, total: 49.98 },
              { name: "Screen Protector", qty: 1, price: 9.99, total: 9.99 },
              { name: "USB Cable", qty: 3, price: 18.59, total: 55.79 }
            ],
            shipping: { 
              address: "321 Oak Street, Boston, MA 02101", 
              method: "Standard Shipping", 
              tracking: null 
            },
            payment: { 
              method: "Credit Card", 
              status: "Paid", 
              transaction: "TXN456789" 
            }
          },
          {
            id: "#ORD005",
            customer: { 
              name: "Neel patel", 
              email: "neel@example.com", 
              phone: "+1 234-567-8904" 
            },
            total: 67.99,
            status: "Cancelled",
            date: "Jan 03, 2026",
            items: [
              { name: "T-Shirt", qty: 2, price: 19.99, total: 39.98 },
              { name: "Jeans", qty: 1, price: 28.01, total: 28.01 }
            ],
            shipping: { 
              address: "654 Pine Road, Miami, FL 33101", 
              method: "Express Delivery", 
              tracking: null 
            },
            payment: { 
              method: "Credit Card", 
              status: "Refunded", 
              transaction: "TXN345678" 
            }
          }
        ];

        setOrders(sampleOrders);
        setLoading(false);
        
        // Save to localStorage for persistence
        localStorage.setItem("adminOrders", JSON.stringify(sampleOrders));
      }, 500);
    }, []);

    // Load from localStorage if available
    useEffect(() => {
      const savedOrders = localStorage.getItem("adminOrders");
      if (savedOrders) {
        try {
          const parsedOrders = JSON.parse(savedOrders);
          if (parsedOrders && parsedOrders.length > 0) {
            setOrders(parsedOrders);
          }
        } catch (error) {
          console.error("Error loading orders from localStorage:", error);
        }
      }
      setLoading(false);
    }, []);

    // Filter orders based on search and status
    const filteredOrders = orders.filter(order => {
      if (!order || !order.id || !order.customer) return false;
      
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customer.email && order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = filterStatus === "all" || order.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });

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

    const openViewModal = (order) => {
      setCurrentOrder(order);
      setShowViewModal(true);
    };

    const updateOrderStatus = (orderId, newStatus) => {
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      // Update localStorage
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      localStorage.setItem("adminOrders", JSON.stringify(updatedOrders));
    };

    const printInvoice = () => {
      if (!currentOrder) return;
      
      const invoiceContent = `
        =================================
                INVOICE RECEIPT
        =================================
        Order ID: ${currentOrder.id}
        Date: ${currentOrder.date}
        Customer: ${currentOrder.customer.name}
        Email: ${currentOrder.customer.email}
        Phone: ${currentOrder.customer.phone}
        ---------------------------------
        ITEMS:
        ${currentOrder.items.map(item => 
          `${item.name} x${item.qty} @ $${item.price} = $${item.total}`
        ).join('\n      ')}
        ---------------------------------
        Subtotal: $${currentOrder.total.toFixed(2)}
        Shipping: $0.00
        Tax: $0.00
        ---------------------------------
        TOTAL: $${currentOrder.total.toFixed(2)}
        =================================
        Payment: ${currentOrder.payment.method}
        Status: ${currentOrder.payment.status}
        Shipping: ${currentOrder.shipping.method}
        Tracking: ${currentOrder.shipping.tracking || 'N/A'}
        =================================
        Thank you for your order!
      `;
      
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${currentOrder.id}</title>
            <style>
              body { font-family: monospace; padding: 20px; }
              .invoice { white-space: pre-wrap; line-height: 1.5; }
              @media print { button { display: none; } }
            </style>
          </head>
          <body>
            <pre class="invoice">${invoiceContent}</pre>
            <button onclick="window.print()">Print Invoice</button>
            <button onclick="window.close()">Close</button>
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
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Orders</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
            Manage and track customer orders ({orders.length} total)
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search by order ID, customer name, or email..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 
                rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none"/>
            </div>
            
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg 
                px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none">

                <option value="all">All Status</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{orders.length}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                ${orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Delivered</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {orders.filter(o => o.status === "Delivered").length}
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Processing</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {orders.filter(o => o.status === "Processing").length}
              </p>
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
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Total</th>
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
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-800 dark:text-white">{order.id}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">{order.customer?.name || 'N/A'}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                            {order.customer?.email || 'No email'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-gray-400 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{order.date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FaDollarSign className="text-gray-400 flex-shrink-0" />
                          <span className="font-bold text-gray-800 dark:text-white">
                            ${(order.total || 0).toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 
                             focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer min-w-[110px]">
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => openViewModal(order)} className="flex items-center gap-2 text-blue-600 
                        hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 px-3 py-2 rounded-lg 
                        hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                          <FaEye />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-4xl mb-4">📦</div>
                  <p className="text-lg font-medium">No orders found</p>
                  <p className="text-sm mt-2">Try adjusting your search or filter</p>
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white">{order.id}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{order.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Customer</p>
                        <p className="font-medium truncate">{order.customer?.name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Total</p>
                        <p className="font-bold">${(order.total || 0).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Items</p>
                        <p>{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Payment</p>
                        <p className="truncate">{order.payment?.method || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                        rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary">

                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <button onClick={() => openViewModal(order)} className="flex items-center gap-2 text-blue-600 
                      dark:text-blue-400 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 
                      dark:hover:bg-blue-900/50 transition-colors">
                        <FaEye size={14} />
                        <span className="text-sm">View</span>
                      </button>
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

                {/* Modal Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                      Order Details: {currentOrder.id}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
                      {currentOrder.date} • {currentOrder.items?.length || 0} item{currentOrder.items?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700 
                  dark:text-gray-400 dark:hover:text-gray-300 text-2xl p-2 hover:bg-gray-100 dark:hover:bg-gray-700 
                  rounded-full transition-colors">
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* Left Column - Order Summary */}
                  <div className="lg:col-span-2 space-y-6">

                    {/* Items */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 md:p-6">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <span>📦 Items Ordered</span>
                        <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                          {currentOrder.items?.length || 0} items
                        </span>
                      </h3>
                      <div className="space-y-3">
                        {currentOrder.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 dark:text-white">{item.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Quantity: {item.qty} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                            <p className="font-bold text-gray-800 dark:text-white ml-4">${item.total.toFixed(2)}</p>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-3 border-t dark:border-gray-700">
                          <p className="font-bold text-lg text-gray-800 dark:text-white">Total Amount</p>
                          <p className="font-bold text-xl text-primary">${currentOrder.total.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Shipping & Payment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      {/* Shipping */}
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 md:p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <FaTruck />
                          <span>Shipping Details</span>
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Delivery Address</p>
                            <p className="font-medium text-gray-800 dark:text-white">
                              {currentOrder.shipping?.address || 'No address provided'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Shipping Method</p>
                            <p className="font-medium text-gray-800 dark:text-white">
                              {currentOrder.shipping?.method || 'Standard'}
                            </p>
                          </div>
                          {currentOrder.shipping?.tracking && (
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Tracking Number</p>
                              <p className="font-medium text-blue-600 dark:text-blue-400">
                                {currentOrder.shipping.tracking}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Payment */}
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 md:p-6">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <FaDollarSign />
                          <span>Payment Information</span>
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                            <p className="font-medium text-gray-800 dark:text-white">
                              {currentOrder.payment?.method || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Payment Status</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              currentOrder.payment?.status === 'Paid' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            }`}>
                              {currentOrder.payment?.status || 'Pending'}
                            </span>
                          </div>
                          {currentOrder.payment?.transaction && (
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Transaction ID</p>
                              <p className="font-medium text-gray-800 dark:text-white">
                                {currentOrder.payment.transaction}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Customer & Actions */}
                  <div className="space-y-6">

                    {/* Customer Info */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 md:p-6">
                      <h3 className="font-semibold text-lg mb-4">👤 Customer Information</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {currentOrder.customer?.name || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {currentOrder.customer?.email || 'No email'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {currentOrder.customer?.phone || 'No phone'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Status Update */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 md:p-6">
                      <h3 className="font-semibold text-lg mb-4">🔄 Update Status</h3>
                      <select
                        value={currentOrder.status}
                        onChange={(e) => {
                          updateOrderStatus(currentOrder.id, e.target.value);
                          setCurrentOrder({...currentOrder, status: e.target.value});
                        }}
                        className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 
                        rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none">

                        <option value="Processing">🔄 Processing</option>
                        <option value="Shipped">🚚 Shipped</option>
                        <option value="Delivered">✅ Delivered</option>
                        <option value="Cancelled">❌ Cancelled</option>
                      </select>
                      <div className="mt-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentOrder.status)}`}>
                          Current Status: {currentOrder.status}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-primary/10 rounded-xl p-4 md:p-6">
                      <h3 className="font-semibold text-lg mb-4">⚡ Quick Actions</h3>
                      <div className="space-y-3">
                        <button onClick={printInvoice} className="w-full flex items-center justify-center gap-2 py-3 
                        bg-white dark:bg-gray-800 text-primary border border-primary rounded-lg hover:bg-primary 
                        hover:text-white transition-colors font-medium">
                          <FaPrint />
                          <span>Print Invoice</span>
                        </button>
                        <button className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">
                          Send Tracking Email
                        </button>
                        <button onClick={() => setShowViewModal(false)} className="w-full py-3 bg-gray-200 dark:bg-gray-700 
                        text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 
                        transition-colors font-medium">
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
      </div>
    );
  };

  export default AdminOrders;