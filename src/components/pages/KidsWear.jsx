import React from "react";
import ProductGrid from "../common/ProductGrid";
import { useCart } from "../../context/CartContext";


const kidsProducts = [
  { id: 101, img: "https://picsum.photos/400/500?random=101", title: "Cute Panda Kids T-Shirt", price: 799, oldPrice: 1299, rating: 4.8 },
  { id: 102, img: "https://picsum.photos/400/500?random=102", title: "Kids Denim Overall", price: 1299, oldPrice: 1899, rating: 4.7 },
  { id: 103, img: "https://picsum.photos/400/500?random=103", title: "Cozy Winter Jacket", price: 1999, oldPrice: 2999, rating: 4.9 },
  { id: 104, img: "https://picsum.photos/400/500?random=104", title: "Colorful Kids Hoodie", price: 1499, oldPrice: 2199, rating: 4.6 },
  { id: 105, img: "https://picsum.photos/400/500?random=105", title: "Summer Play Set", price: 899, oldPrice: 1499, rating: 4.8 },
  { id: 106, img: "https://picsum.photos/400/500?random=106", title: "Kids Sporty Sneakers", price: 1799, oldPrice: 2499, rating: 4.9 },
];

const KidsWear = () => {
  return <ProductGrid title="Kids Wear Collection" products={kidsProducts} />;

return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center mb-10">Kids Wear</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {kidsProducts.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 shadow hover:scale-105 transition duration-300 
          dark:bg-gray-800 dark:border-gray-700">
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

export default KidsWear;