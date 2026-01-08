// src/components/pages/ProductDetail.jsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaStar, FaShoppingCart, FaHeart, FaShare, FaMinus, FaPlus } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import ProductGrid from "../common/ProductGrid";

// Sample related products (you can make this dynamic later)
const relatedProducts = [
  { id: 1001, img: "https://picsum.photos/seed/rel1/400/500", title: "Similar T-Shirt", price: 899, oldPrice: 1299, rating: 4.6 },
  { id: 1002, img: "https://picsum.photos/seed/rel2/400/500", title: "Trendy Hoodie", price: 1499, oldPrice: 2199, rating: 4.8 },
  { id: 1003, img: "https://picsum.photos/seed/rel3/400/500", title: "Kids Party Dress", price: 1299, oldPrice: 1899, rating: 4.7 },
  { id: 1004, img: "https://picsum.photos/seed/rel4/400/500", title: "Casual Sneakers", price: 1999, oldPrice: 2999, rating: 4.9 },
];

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data (in real app, fetch from backend or context)
  const product = {
    id: parseInt(id),
    title: "Premium Cotton Kids T-Shirt - Blue Panda",
    price: 899,
    oldPrice: 1499,
    rating: 4.8,
    reviews: 324,
    description: "Made from 100% premium cotton, this super soft and comfortable t-shirt is perfect for kids. Features a cute panda print that kids love. Available in multiple colors and sizes.",
    features: ["100% Cotton", "Machine Washable", "Skin Friendly", "Perfect Fit"],
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y"],
    colors: ["Blue", "Pink", "Yellow", "Green"],
    images: [
      "https://picsum.photos/seed/kid1/800/800",
      "https://picsum.photos/seed/kid2/800/800",
      "https://picsum.photos/seed/kid3/800/800",
      "https://picsum.photos/seed/kid4/800/800",
    ],
  };

  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div>
          <div className="relative mb-4">
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              className="w-full h-96 md:h-full object-cover rounded-xl shadow-lg"
            />
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              -{discount}%
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                onClick={() => setSelectedImage(idx)}
                className={`w-full h-24 object-cover rounded-lg cursor-pointer border-2 ${
                  selectedImage === idx ? "border-primary" : "border-gray-300"
                } hover:border-primary transition`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">{product.title}</h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.floor(product.rating) ? "fill-current" : "text-gray-300"} />
              ))}
            </div>
            <span className="text-gray-600 dark:text-gray-400">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          <div className="mb-8">
            <div className="flex items-baseline gap-4">
              <p className="text-4xl font-bold text-primary">₹{product.price}</p>
              <p className="text-2xl text-gray-500 line-through">₹{product.oldPrice}</p>
              <p className="text-green-600 font-semibold">{discount}% off</p>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">{product.description}</p>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Select Size</h3>
              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button key={size} className="border border-gray-300 rounded-lg px-4 py-2 hover:border-primary hover:bg-primary hover:text-white transition">
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100"
                >
                  <FaMinus />
                </button>
                <span className="px-6 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-100"
                >
                  <FaPlus />
                </button>
              </div>

              <button
                onClick={() => addToCart({ ...product, quantity })}
                className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-bold text-lg hover:scale-105 transition flex items-center justify-center gap-3"
              >
                <FaShoppingCart /> Add to Cart
              </button>

              <button className="p-4 border border-gray-300 rounded-xl hover:bg-red-50 hover:border-red-500 transition">
                <FaHeart className="text-xl text-red-500" />
              </button>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition">
                Buy Now
              </button>
              <button className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition">
                <FaShare />
              </button>
            </div>
          </div>

          <div className="mt-10 border-t pt-6">
            <h3 className="font-semibold mb-3">Key Features</h3>
            <ul className="space-y-2">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-12">You May Also Like</h2>
        <ProductGrid products={relatedProducts} />
      </div>
    </div>
  );
};

export default ProductDetail;