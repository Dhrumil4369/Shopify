// import React from "react";
// import { useCart } from "../../context/CartContext";

// const bestSellingProducts = [
//   { id: 1, name: "Best Selling T-Shirt", price: 999, image: "https://picsum.photos/seed/best1/300/400" },
//   { id: 2, name: "Best Selling Shoes", price: 2999, image: "https://picsum.photos/seed/best2/300/400" },
//   { id: 3, name: "Best Selling Jeans", price: 1799, image: "https://picsum.photos/seed/best3/300/400" },
//   { id: 4, name: "Best Selling Watch", price: 4999, image: "https://picsum.photos/seed/best4/300/400" },
//   { id: 5, name: "Best Selling Headphones", price: 3499, image: "https://picsum.photos/seed/best5/300/400" },
//   { id: 6, name: "Best Selling Hoodie", price: 1999, image: "https://picsum.photos/seed/best6/300/400" },
// ];

// const BestSelling = () => {
//   const { addToCart } = useCart();

//   const handleAddToCart = (product) => {
//     addToCart(product);
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6 text-center">Best Selling Products</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {bestSellingProducts.map((item) => (
//           <div key={item.id} className="border rounded-lg p-4 shadow hover:scale-105 transition duration-300 dark:bg-gray-800 dark:border-gray-700">
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

// export default BestSelling;
import React from "react";
import ProductGrid from "../common/ProductGrid";

const bestSellingProducts = [
  { id: 501, img: "https://picsum.photos/seed/best1/400/500", title: "Classic White Sneakers", price: 3999, oldPrice: 5999, rating: 4.9 },
  { id: 502, img: "https://picsum.photos/seed/best2/400/500", title: "Premium Cotton T-Shirt", price: 999, oldPrice: 1699, rating: 4.8 },
  { id: 503, img: "https://picsum.photos/seed/best3/400/500", title: "Wireless Earbuds Pro", price: 4999, oldPrice: 7999, rating: 4.7 },
  { id: 504, img: "https://picsum.photos/seed/best4/400/500", title: "Denim Jacket Classic", price: 2899, oldPrice: 4499, rating: 4.9 },
  { id: 505, img: "https://picsum.photos/seed/best5/400/500", title: "Fitness Smart Band", price: 2999, oldPrice: 4999, rating: 4.6 },
  { id: 506, img: "https://picsum.photos/seed/best6/400/500", title: "Leather Wallet", price: 1499, oldPrice: 2499, rating: 4.8 },
  { id: 507, img: "https://picsum.photos/seed/best7/400/500", title: "Running Shoes", price: 4499, oldPrice: 6999, rating: 4.9 },
  { id: 508, img: "https://picsum.photos/seed/best8/400/500", title: "Casual Backpack", price: 2199, oldPrice: 3499, rating: 4.7 },
];

const BestSelling = () => {
  return <ProductGrid title="Best Selling Products" products={bestSellingProducts} />;
};

export default BestSelling;