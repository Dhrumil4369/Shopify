import React, { useState } from "react";
import { useCart } from "../../context/CartContext";
import { FaLock, FaCreditCard, FaShippingFast, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://dhrumil-backend.vercel.app/api/orders";

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");

  // Updated form structure to match backend validation
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "credit",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fetch orders (GET)
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_BASE_URL, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) throw new Error("Failed to fetch orders");
      return await response.json();
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch order history");
    }
  };

  // Create order (POST) - Updated to match backend schema
  const createOrder = async (orderData) => {       
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create order");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  };

  // Update order (PUT)
  const updateOrder = async (orderId, updatedData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/update/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Failed to update order");
      return await response.json();
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  // Delete order (DELETE)
  const deleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/delete/${orderId}`, {
        method: "DELETE",
        headers: {
          ...(token && { "Authorization": `Bearer ${token}` })
        },
      });

      if (!response.ok) throw new Error("Failed to delete order");
      return await response.json();
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError("");

    const shippingCharge = 99;
    const subtotal = getTotalPrice();
    const tax = subtotal * 0.18;
    const totalAmount = subtotal + shippingCharge + tax;

    // Prepare order data matching backend schema
    const orderData = {
      shippingInfo: {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      orderItems: cartItems.map(item => ({
        product: item._id || item.id,
        name: item.title || item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.img || item.image,
      })),
      paymentMethod: formData.paymentMethod,
      itemsPrice: subtotal,
      taxPrice: tax,
      shippingPrice: shippingCharge,
      totalPrice: totalAmount,
    };

    console.log("Sending order data:", orderData); 

    try {
      // Create order via API
      const result = await createOrder(orderData);
      
      setIsProcessing(false);
      setIsSuccess(true);
      setOrderId(result.orderId || result._id || Date.now().toString().slice(-8));
      
      clearCart();

      setTimeout(() => {
        navigate("/");
      }, 5000);

    } catch (error) {
      setIsProcessing(false);
      setError(error.message || "Failed to place order. Please try again.");
    }
  };

  const shippingCharge = 99;
  const subtotal = getTotalPrice();
  const tax = subtotal * 0.18;
  const totalAmount = subtotal + shippingCharge + tax;

  // Payment method configuration matching backend
  const paymentMethods = [
    {
      value: "credit",
      label: "Credit/Debit Card",
      description: "Pay securely with your card"
    },
    {
      value: "upi",
      label: "UPI Payment",
      description: "Instant payment via UPI apps"
    },
    {
      value: "cash",
      label: "Cash on Delivery",
      description: "Pay when you receive the order"
    }
  ];

  // Empty cart state
  if (cartItems.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6 text-gray-300 dark:text-gray-700">🛒</div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Looks like you haven't added anything yet. Let's fix that!
          </p>
          <button onClick={() => navigate("/")} className="bg-gradient-to-r from-primary to-secondary text-white py-4 px-8 
          rounded-full hover:scale-105 duration-300 font-semibold text-lg">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800 dark:text-white">
        Checkout
      </h1>

      {/* Error Message */}
      {error && (
        <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-red-600 dark:text-red-400 text-center font-medium">{error}</p>
        </div>
      )}

      {isSuccess ? (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 text-center">
          <FaCheckCircle className="text-8xl text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
            Thank you for shopping with us. Your order has been confirmed and is being processed.
          </p>

          <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-6 mb-8">
            <p className="text-xl font-semibold text-gray-800 dark:text-white">
              Order ID: <span className="text-primary">SHOP-{orderId}</span>
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Estimated Delivery: 3-5 business days
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
              You can view your order history in your account dashboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate("/orders")} 
              className="bg-gray-800 dark:bg-gray-700 text-white py-3 px-8 rounded-full hover:scale-105 duration-300 font-bold"
            >
              View Orders
            </button>
            <button 
              onClick={() => navigate("/")} 
              className="bg-gradient-to-r from-primary to-secondary text-white py-3 px-10 rounded-full hover:scale-105 duration-300 font-bold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <FaShippingFast className="text-primary" />
                Order Summary
              </h2>

              <div className="space-y-6 max-h-96 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item._id || item.id} className="flex items-center gap-5 pb-6 border-b dark:border-gray-700 last:border-0">
                    <img src={item.img || item.image || "https://via.placeholder.com/100?text=No+Image"} 
                      alt={item.title || item.name} className="w-24 h-24 object-cover rounded-xl border border-gray-200 
                      dark:border-gray-700"/>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                        {item.title || item.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Quantity: <span className="font-medium">{item.quantity}</span>
                      </p>
                    </div>

                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="mt-8 space-y-4 border-t dark:border-gray-700 pt-6">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-semibold">₹{shippingCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600 dark:text-gray-400">Tax (18%)</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold pt-4 border-t dark:border-gray-700">
                  <span>Total</span>
                  <span className="text-primary">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <FaCreditCard className="text-primary" />
                Payment Method
              </h2>

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <label key={method.value} className="flex items-center p-4 border dark:border-gray-700 rounded-xl cursor-pointer 
                  hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value={method.value} 
                      checked={formData.paymentMethod === method.value}
                      onChange={handleInputChange} 
                      className="mr-4 text-primary"
                    />
                    <div>
                      <p className="font-semibold">
                        {method.label}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {method.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Shipping Form */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <FaShippingFast className="text-primary" />
                Shipping Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      placeholder="John Doe"
                      className="w-full p-4 border dark:border-gray-700 rounded-xl dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="john@example.com"
                      className="w-full p-4 border dark:border-gray-700 rounded-xl dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full p-4 border dark:border-gray-700 rounded-xl dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Delivery Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    placeholder="House no., Street, Landmark"
                    className="w-full p-4 border dark:border-gray-700 rounded-xl dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="Mumbai"
                      className="w-full p-4 border dark:border-gray-700 rounded-xl dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      placeholder="Maharashtra"
                      className="w-full p-4 border dark:border-gray-700 rounded-xl dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">PIN Code *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      placeholder="400001"
                      className="w-full p-4 border dark:border-gray-700 rounded-xl dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 flex items-start gap-4">
                  <FaLock className="text-primary text-2xl mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-primary">Secure Checkout</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Your payment and personal data are protected with 256-bit SSL encryption.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-5 rounded-xl hover:scale-105 duration-300 font-bold text-xl flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <FaLock />
                      Complete Payment ₹{totalAmount.toFixed(2)}
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-gray-500 mt-6">
                  By placing your order, you agree to our{" "}
                  <span className="text-primary underline">Terms of Service</span> and{" "}
                  <span className="text-primary underline">Privacy Policy</span>.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;