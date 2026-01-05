import React from "react";
import { useCart } from "../../context/CartContext";

const bestSellingProducts = [
  { id: 1, name: "Best Selling T-Shirt", price: 999, image: "https://picsum.photos/seed/best1/300/400" },
  { id: 2, name: "Best Selling Shoes", price: 2999, image: "https://picsum.photos/seed/best2/300/400" },
  { id: 3, name: "Best Selling Jeans", price: 1799, image: "https://picsum.photos/seed/best3/300/400" },
  { id: 4, name: "Best Selling Watch", price: 4999, image: "https://picsum.photos/seed/best4/300/400" },
  { id: 5, name: "Best Selling Headphones", price: 3499, image: "https://picsum.photos/seed/best5/300/400" },
  { id: 6, name: "Best Selling Hoodie", price: 1999, image: "https://picsum.photos/seed/best6/300/400" },
];

const BestSelling = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Best Selling Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {bestSellingProducts.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 shadow hover:scale-105 transition duration-300 dark:bg-gray-800 dark:border-gray-700">
            <img src={item.image} alt={item.name} className="w-full h-[350px] object-cover rounded-md mb-3" />
            <h2 className="font-semibold text-lg dark:text-white">{item.name}</h2>
            <p className="text-green-600 font-bold dark:text-green-400">₹{item.price}</p>
            <button onClick={() => handleAddToCart(item)} className="mt-3 w-full bg-gradient-to-r from-primary to-secondary 
            text-white py-2 rounded-md hover:scale-105 duration-300">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSelling;