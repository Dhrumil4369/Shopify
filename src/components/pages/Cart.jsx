import React from "react";
import { useCart } from "../../context/CartContext";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <div className="flex-grow flex flex-col items-center justify-center p-6">
          <FaShoppingCart className="text-8xl text-gray-300 dark:text-gray-700 mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-md">
            Looks like you haven't added anything to your cart yet. Start shopping!
          </p>
          <Link to="/" className="bg-gradient-to-r from-primary to-secondary text-white py-4 px-8 rounded-full 
          hover:scale-105 duration-300 font-semibold text-lg">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shipping = 99;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-10">
          Your Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item, index) => {
              const productId = item.id || item._id;
              
              return (
                <div 
                  key={`${productId}-${item.size || 'nosize'}-${item.color || 'nocolor'}-${index}`} 
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col sm:flex-row items-center gap-6 hover:shadow-xl transition-shadow"
                >
                  <img 
                    src={item.img || item.image || "https://via.placeholder.com/150"} 
                    alt={item.title || item.name || "Product"}
                    className="w-32 h-32 object-cover rounded-xl border border-gray-200 dark:border-gray-700"
                  />

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                      {item.title || item.name || "Product"}
                    </h3>
                    
                    {item.size && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Size: <span className="font-medium">{item.size}</span>
                      </p>
                    )}
                    
                    {item.color && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Color: <span className="font-medium">{item.color}</span>
                      </p>
                    )}
                    
                    <p className="text-2xl font-bold text-primary mb-4">
                      ₹{Number(item.price || 0).toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                      <button
                        onClick={() => updateQuantity(productId, item.quantity - 1, item.size, item.color)}
                        disabled={item.quantity <= 1}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                          item.quantity <= 1
                            ? "bg-gray-300 cursor-not-allowed text-gray-500"
                            : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                        }`}
                      >
                        <FaMinus className="text-sm" />
                      </button>

                      <span className="text-xl font-bold w-12 text-center">
                        {item.quantity}
                      </span>

                      <button 
                        onClick={() => updateQuantity(productId, item.quantity + 1, item.size, item.color)} 
                        className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal + Remove */}
                  <div className="text-center sm:text-right min-w-[140px]">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      ₹{(Number(item.price || 0) * item.quantity).toFixed(2)}
                    </p>
                    <button 
                      onClick={() => removeFromCart(productId, item.size, item.color)} 
                      className="text-red-500 hover:text-red-700 text-2xl transition" 
                      title="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="text-right mt-8">
              <button 
                onClick={clearCart} 
                className="text-red-600 hover:text-red-800 font-medium flex items-center gap-2 justify-end mx-auto sm:mx-0"
              >
                <FaTrash /> Clear Entire Cart
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 text-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-semibold">₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax (18%)</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t dark:border-gray-700 pt-4 mt-6">
                  <div className="flex justify-between text-2xl font-bold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link to="/checkout" className="block mt-8">
                <button className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-full 
                hover:scale-105 duration-300 font-bold text-xl">
                  Proceed to Checkout
                </button>
              </Link>

              <Link
                to="/"
                className="block text-center mt-4 text-primary hover:underline font-medium"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;