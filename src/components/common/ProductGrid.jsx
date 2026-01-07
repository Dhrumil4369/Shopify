import React from "react";
import { FaStar } from "react-icons/fa";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // Fallback for image
  const imageUrl = product.img || product.image || "https://via.placeholder.com/400x500?text=No+Image";

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  // Clean object to add to cart (ensures image is saved correctly)
  const handleAddToCart = () => {
    const cartProduct = {
      id: product.id,
      img: imageUrl,
      title: product.title || product.name,
      price: product.price,
      rating: product.rating || 4.5,
      oldPrice: product.oldPrice || null,
      quantity: 1,
    };
    addToCart(cartProduct);
  };

  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
      {/* Image Section */}
      <div className="relative aspect-square">
        <img
          src={imageUrl}
          alt={product.title || product.name}
          className="w-full h-full object-cover"
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
            -{discount}%
          </span>
        )}
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      </div>

      {/* Details Section */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-white line-clamp-2 mb-2">
          {product.title || product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={
                  i < Math.floor(product.rating || 4.5)
                    ? "fill-current"
                    : "text-gray-300 dark:text-gray-600"
                }
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            ({(product.rating || 4.5).toFixed(1)})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{product.price}
            </p>
            {product.oldPrice && (
              <p className="text-sm text-gray-500 line-through">₹{product.oldPrice}</p>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-full hover:scale-105 transition-transform duration-300 font-medium text-lg"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const ProductGrid = ({ title, products }) => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Section Title - Now Properly Displayed */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mt-12 font-bold text-gray-800 dark:text-white">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
            Explore our premium collection of handpicked items just for you
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Optional: No products message */}
        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500 dark:text-gray-400">
              No products available at the moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;