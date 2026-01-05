  import React from "react";
  import { useCart } from "../../context/CartContext";
  import {FaTrash,FaPlus,FaMinus,FaShoppingCart,} from "react-icons/fa";
  import { Link } from "react-router-dom";

  const Cart = () => {
    const {cartItems,removeFromCart,updateQuantity,clearCart, getTotalPrice,} = useCart();

    if (cartItems.length === 0) {
      return (
        <div className="min-h-screen flex flex-col">
          <div className="flex-grow flex flex-col items-center justify-center p-6">
            <FaShoppingCart className="text-6xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some items to get started!</p>
            <Link to="/" className="bg-gradient-to-r from-primary to-secondary text-white py-3 px-6 rounded-full 
              hover:scale-105 duration-300">
              Continue Shopping
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center">
              Shopping Cart
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* CART ITEMS */}
              <div className="lg:col-span-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-center border-b dark:border-gray-700 py-6">

                    <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-6"/>

                    <div className="flex-1 w-full">
                      <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                      <p className="text-primary font-bold mb-3">₹{item.price}</p>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="bg-gray-200 
                          dark:bg-gray-700 p-2 rounded-full">
                            <FaMinus />
                          </button>

                          <span className="text-lg font-semibold">
                            {item.quantity}
                          </span>

                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full">
                            <FaPlus />
                          </button>
                        </div>

                        {/* PRICE + REMOVE */}
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold">
                            ₹{item.price * item.quantity}
                          </span>

                          <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button onClick={clearCart} className="mt-6 flex items-center text-red-500 hover:text-red-700">
                  <FaTrash className="mr-2" />
                  Clear Cart
                </button>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg sticky top-24">
                  <h2 className="text-xl font-bold mb-4">
                    Order Summary
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{getTotalPrice()}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>₹99</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Tax (18%)</span>
                      <span>
                        ₹{(getTotalPrice() * 0.18).toFixed(2)}
                      </span>
                    </div>

                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>
                          ₹
                          {(getTotalPrice() + 99 + getTotalPrice() * 0.18 ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link to="/checkout">
                    <button className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg hover:scale-105 duration-300 mb-4">
                      Proceed to Checkout
                    </button>
                  </Link>

                  <Link to="/" className="block text-center text-primary hover:underline">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default Cart;
