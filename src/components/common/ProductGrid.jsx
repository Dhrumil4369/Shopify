import React from "react";
import { FaStar } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // Safe access to product properties
  const title = product.title || product.name || "Untitled Product";
  const price = Number(product.price) || 0;
  const oldPrice = product.oldPrice ? Number(product.oldPrice) : null;
  const rating = Number(product.rating) || 4.5;
  const imageUrl =
    product.img ||
    product.image ||
    "https://via.placeholder.com/400x500?text=No+Image";

  // Calculate discount percentage safely
  const discount = oldPrice && oldPrice > price
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const cartItem = {
      id: product.id,
      img: imageUrl,
      title,
      price,
      rating,
      oldPrice,
      quantity: 1,
    };

    addToCart(cartItem);
  };

  // Full stars count
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      {/* Image Container */}
      <Link
        to={`/product/${product.id}`}
        className="relative aspect-square overflow-hidden block"
        aria-label={`View details of ${title}`}
      >
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {discount > 0 && (
          <span className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-md z-10">
            -{discount}%
          </span>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
      </Link>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        <Link
          to={`/product/${product.id}`}
          className="block hover:text-primary transition-colors"
        >
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2 mb-3">
            {title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`w-4 h-4 ${
                  i < fullStars
                    ? "fill-yellow-500"
                    : i === fullStars && hasHalfStar
                    ? "fill-yellow-500/50"
                    : "fill-gray-300 dark:fill-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-end justify-between mb-6 flex-grow">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{price.toLocaleString("en-IN")}
            </p>
            {oldPrice && (
              <p className="text-sm text-gray-500 line-through mt-1">
                ₹{oldPrice.toLocaleString("en-IN")}
              </p>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white font-medium py-3 rounded-full hover:scale-105 active:scale-100 transition-all duration-300 shadow-md hover:shadow-lg"
          aria-label={`Add ${title} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const ProductGrid = ({ title = "Featured Products", products = [] }) => {
  if (!products || products.length === 0) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <p className="text-2xl text-gray-500 dark:text-gray-400">
            No products available at the moment.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl mt-10 font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our premium collection of handpicked items just for you
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;