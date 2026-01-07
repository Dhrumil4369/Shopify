import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';

const CartNotification = ({ count, show }) => {
  if (!show) return null;

  return (
    <div className="fixed top-40 right-14 z-50 animate-bounce">
      <div className="relative">
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-full shadow-lg">
          <FaShoppingCart className="text-2xl" />
        </div>
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-ping">
          {count}
        </span>
        <div className="absolute top-16 -left-10 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
          Item added to cart!
        </div>
      </div>
    </div>
  );
};

export default CartNotification;
