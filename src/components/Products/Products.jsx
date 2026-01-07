

import React from "react";
import { FaStar } from "react-icons/fa";
import { useCart } from "../../context/CartContext";

const ProductsData = [
  { id: 1, img: "https://picsum.photos/seed/w1/400/500", title: "Women Ethnic Wear", rating: 5.0, price: 1299, oldPrice: 1999 },
  { id: 2, img: "https://picsum.photos/seed/w2/400/500", title: "Red Western Dress", rating: 4.5, price: 1599, oldPrice: 2499 },
  { id: 3, img: "https://picsum.photos/seed/w3/400/500", title: "Stylish Goggles", rating: 4.7, price: 799, oldPrice: 1299 },
  { id: 4, img: "https://picsum.photos/seed/w4/400/500", title: "Printed T-Shirt", rating: 4.4, price: 999, oldPrice: 1499 },
  { id: 5, img: "https://picsum.photos/seed/w5/400/500", title: "Fashion Pink Top", rating: 4.6, price: 1199, oldPrice: 1899 },
  { id: 6, img: "https://picsum.photos/seed/w6/400/500", title: "Casual Denim Jacket", rating: 4.8, price: 2199, oldPrice: 3499 },
];

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
      <div className="relative">
        <img src={product.img} alt={product.title} className="w-full h-80 object-cover" />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{discount}%
          </span>
        )}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-white line-clamp-2 mb-2">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < Math.floor(product.rating) ? "fill-current" : "text-gray-300"} />
            ))}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">({product.rating})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{product.price}</p>
            {product.oldPrice && (
              <p className="text-sm text-gray-500 line-through">₹{product.oldPrice}</p>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full hover:scale-105 transition-transform duration-300 font-medium"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold text-lg">Top Selling</p>
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mt-2">Our Best Products</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
            Explore our handpicked collection of premium quality products loved by thousands.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {ProductsData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;