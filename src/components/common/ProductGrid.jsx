  import React from "react";
  import { FaStar } from "react-icons/fa";
  import { useCart } from "../../context/CartContext";
  import { Link } from "react-router-dom";

  const ProductGrid = ({ 
    products = [],    title = "Products" }) => {
    const { addToCart } = useCart();

    if (!products.length)
      return (
        <p className="text-center text-gray-500 dark:text-gray-400 py-20">
          No products available
        </p>
      );

    const handleAddToCart = (product) => {
      addToCart({
        id: product.id,
        img: product.img,
        title: product.title,
        price: product.price,
        oldPrice: product.oldPrice,
        rating: product.rating,
        quantity: 1,
      });
    };

    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
            {title} 
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Premium handpicked products just for you
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => {
            const price = product.price || 0;
            const oldPrice = product.oldPrice || null;
            const discount =
              oldPrice && oldPrice > price
                ? Math.round(((oldPrice - price) / oldPrice) * 100)
                : 0;
            const rating = product.rating || 4.5;
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 >= 0.5;

            return (
              <div key={product.id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl transition-shadow 
              duration-300 flex flex-col overflow-hidden group">

                {/* Image */}
                <Link to={`/product/${product.id}`} className="relative overflow-hidden aspect-square">
                  <img src={product.img} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 
                  group-hover:scale-105"/>
                  {discount > 0 && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
                      -{discount}%
                    </span>
                  )}
                </Link>

                {/* Info */}
                <div className="p-4 flex flex-col flex-grow">
                  <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">
                    <h3 className="font-semibold text-lg dark:text-white mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-500">
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
                  <div className="mb-4 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                    {oldPrice && (
                      <span className="text-sm line-through text-gray-500">
                        ₹{oldPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button onClick={() => handleAddToCart(product)} className="mt-auto w-full bg-gradient-to-r from-primary to-secondary 
                  text-white py-2 rounded-full font-medium shadow-md hover:scale-105 transition-transform duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  export default ProductGrid;

