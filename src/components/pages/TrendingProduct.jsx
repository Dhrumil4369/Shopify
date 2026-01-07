// import React from "react";
// import { useCart } from "../../context/CartContext";

// const trendingProducts = [
//   { id: 1, name: "Trending Sneakers", price: 3599, image: "https://picsum.photos/seed/trend1/300/400" },
//   { id: 2, name: "Trending Jacket", price: 2899, image: "https://picsum.photos/seed/trend2/300/400" },
//   { id: 3, name: "Trending Smart Watch", price: 6999, image: "https://picsum.photos/seed/trend3/300/400" },
//   { id: 4, name: "Trending Headphones", price: 4599, image: "https://picsum.photos/seed/trend4/300/400" },
//   { id: 5, name: "Trending Backpack", price: 2199, image: "https://picsum.photos/seed/trend5/300/400" },
//   { id: 6, name: "Trending Hoodie", price: 1999, image: "https://picsum.photos/seed/trend6/300/400" },
// ];

// const TrendingProduct = () => {
//   const { addToCart } = useCart();

//   const handleAddToCart = (product) => {
//     addToCart(product);
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6 text-center">Trending Products</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {trendingProducts.map((item) => (
//           <div key={item.id} className="border rounded-lg p-4 shadow hover:scale-105 transition duration-300 dark:bg-gray-800 
//           dark:border-gray-700">
//             <img src={item.image} alt={item.name} className="w-full h-[350px] object-cover rounded-md mb-3"/>

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

// export default TrendingProduct;
import React from "react";
import ProductGrid from "../common/ProductGrid";

const trendingProducts = [
  { id: 401, img: "https://picsum.photos/seed/trend1/400/500", title: "Viral Oversized Hoodie", price: 2199, oldPrice: 3499, rating: 4.9 },
  { id: 402, img: "https://picsum.photos/seed/trend2/400/500", title: "Cargo Pants Trend", price: 2499, oldPrice: 3999, rating: 4.8 },
  { id: 403, img: "https://picsum.photos/seed/trend3/400/500", title: "Retro Smart Watch", price: 6999, oldPrice: 9999, rating: 4.7 },
  { id: 404, img: "https://picsum.photos/seed/trend4/400/500", title: "Noise-Cancelling Headphones", price: 4599, oldPrice: 6999, rating: 4.9 },
  { id: 405, img: "https://picsum.photos/seed/trend5/400/500", title: "Minimalist Backpack", price: 1899, oldPrice: 2999, rating: 4.6 },
  { id: 406, img: "https://picsum.photos/seed/trend6/400/500", title: "Street Style Sneakers", price: 3599, oldPrice: 5499, rating: 4.8 },
  { id: 407, img: "https://picsum.photos/seed/trend7/400/500", title: "Vintage Sunglasses", price: 1299, oldPrice: 2199, rating: 4.7 },
  { id: 408, img: "https://picsum.photos/seed/trend8/400/500", title: "Cozy Knit Sweater", price: 2799, oldPrice: 4299, rating: 4.9 },
];

const TrendingProduct = () => {
  return <ProductGrid title="Trending Products Right Now" products={trendingProducts} />;
};

export default TrendingProduct;