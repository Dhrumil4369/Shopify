  // import React from "react";
  // import { useCart } from "../../context/CartContext";

  // const mensProducts = [
  //   { id: 1, name: "Men T-Shirt", price: 999, image: "https://picsum.photos/seed/men1/300/400" },
  //   { id: 2, name: "Men Jeans", price: 1599, image: "https://picsum.photos/seed/men2/300/400" },
  //   { id: 3, name: "Men Jacket", price: 2499, image: "https://picsum.photos/seed/men3/300/400" },
  //   { id: 4, name: "Men Hoodie", price: 1899, image: "https://picsum.photos/seed/men4/300/400" },
  //   { id: 5, name: "Men Shorts", price: 899, image: "https://picsum.photos/seed/men5/300/400" },
  //   { id: 6, name: "Men Shoes", price: 2999, image: "https://picsum.photos/seed/men6/300/400" },
  // ];

  // const MensWear = () => {
  //   const { addToCart } = useCart();

  //   const handleAddToCart = (product) => {
  //     addToCart(product);
  //   };

  //   return (
  //     <div className="p-6">
  //       <h1 className="text-2xl font-bold mb-6 text-center">Mens Wear</h1>

  //       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  //         {mensProducts.map((item) => (
  //           <div key={item.id} className="border rounded-lg p-4 shadow hover:scale-105 transition duration-300 dark:bg-gray-800 
  //           dark:border-gray-700">

  //             <img src={item.image} alt={item.name} className="w-full h-[350px] object-cover rounded-md mb-3" />

  //             <h2 className="font-semibold text-lg dark:text-white">{item.name}</h2>
  //             <p className="text-green-600 font-bold dark:text-green-400">₹{item.price}</p>

  //             <button onClick={() => handleAddToCart(item)} className="mt-3 w-full bg-gradient-to-r from-primary to-secondary 
  //             text-white py-2 rounded-md hover:scale-105 duration-300">
  //               Add to Cart
  //             </button>
  //           </div>
  //         ))}
  //       </div>
  //     </div>
  //   );
  // };

  // export default MensWear;
  import React from "react";
import ProductGrid from "../common/ProductGrid";

const mensProducts = [
  { id: 201, img: "https://picsum.photos/seed/men1/400/500", title: "Formal Shirt", price: 1599, oldPrice: 2499, rating: 4.7 },
  { id: 202, img: "https://picsum.photos/seed/men2/400/500", title: "Slim Fit Jeans", price: 1999, oldPrice: 2999, rating: 4.6 },
  { id: 203, img: "https://picsum.photos/seed/men3/400/500", title: "Leather Jacket", price: 3999, oldPrice: 5999, rating: 4.9 },
  { id: 204, img: "https://picsum.photos/seed/men4/400/500", title: "Casual Hoodie", price: 1899, oldPrice: 2799, rating: 4.5 },
  { id: 205, img: "https://picsum.photos/seed/men5/400/500", title: "Running Shoes", price: 2999, oldPrice: 4499, rating: 4.8 },
  { id: 206, img: "https://picsum.photos/seed/men6/400/500", title: "Classic Watch", price: 4999, oldPrice: 7999, rating: 4.9 },
];

const MensWear = () => {
  return <ProductGrid title="Men's Fashion" products={mensProducts} />;
};

export default MensWear;