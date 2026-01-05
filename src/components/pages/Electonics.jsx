import React from "react";
import { useCart } from "../../context/CartContext"; // Add this import

const electronicsProducts = [
  { id: 1, name: "Smartphone", price: 24999, image: "https://picsum.photos/seed/electro1/300/400" },
  { id: 2, name: "Laptop", price: 59999, image: "https://picsum.photos/seed/electro2/300/400" },
  { id: 3, name: "Headphones", price: 2999, image: "https://picsum.photos/seed/electro3/300/400" },
  { id: 4, name: "Smart Watch", price: 4999, image: "https://picsum.photos/seed/electro4/300/400" },
  { id: 5, name: "Bluetooth Speaker", price: 3499, image: "https://picsum.photos/seed/electro5/300/400" },
  { id: 6, name: "Wireless Mouse", price: 1299, image: "https://picsum.photos/seed/electro6/300/400" },
];

const Electronics = () => {
  const { addToCart } = useCart(); // Get addToCart function

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Electronics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {electronicsProducts.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 shadow hover:scale-105 transition duration-300">
            <img src={item.image} alt={item.name} className="w-full h-[350px] object-cover rounded-md mb-3"/>

            <h2 className="font-semibold text-lg">{item.name}</h2>
            <p className="text-green-600 font-bold">₹{item.price}</p>

            <button onClick={() => handleAddToCart(item)} className="mt-3 w-full bg-primary text-white py-2 rounded-md 
            hover:bg-primary/90 transition-colors">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Electronics;