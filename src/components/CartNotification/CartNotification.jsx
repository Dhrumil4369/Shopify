import React from 'react';
import { FaShoppingCart, FaCheckCircle } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

const CartNotification = () => {
  const { showNotification, notificationCount } = useCart();

  if (!showNotification) return null;

  return (
    <div className="fixed top-24 right-4 md:right-8 z-50 animate-slide-in-right">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 flex items-center gap-3 border-l-4 border-green-500 min-w-[280px]">
        <div className="bg-green-500 text-white p-3 rounded-full">
          <FaCheckCircle className="text-2xl" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 dark:text-white">Added to Cart!</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {notificationCount} item{notificationCount > 1 ? 's' : ''} added successfully
          </p>
        </div>
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-2 rounded-full">
          <FaShoppingCart className="text-xl" />
        </div>
      </div>
    </div>
  );
};

export default CartNotification;