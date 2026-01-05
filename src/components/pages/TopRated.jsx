import React from "react";
import { useCart } from "../../context/CartContext";

const topRatedProducts = [
  { id: 1, name: "Top Rated Sneakers", price: 3999, image: "https://picsum.photos/seed/rated1/300/400" },
  { id: 2, name: "Top Rated Smartphone", price: 32999, image: "https://picsum.photos/seed/rated2/300/400" },
  { id: 3, name: "Top Rated Headphones", price: 4999, image: "https://picsum.photos/seed/rated3/300/400" },
  { id: 4, name: "Top Rated Jacket", price: 2899, image: "https://picsum.photos/seed/rated4/300/400" },
  { id: 5, name: "Top Rated Smart Watch", price: 7999, image: "https://picsum.photos/seed/rated5/300/400" },
  { id: 6, name: "Top Rated Laptop", price: 74999, image: "https://picsum.photos/seed/rated6/300/400" },
];

const TopRated = () => {
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Top Rated Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {topRatedProducts.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 shadow hover:scale-105 transition duration-300 dark:bg-gray-800 
          dark:border-gray-700">
            <img src={item.image} alt={item.name} className="w-full h-[350px] object-cover rounded-md mb-3"/>

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

export default TopRated;