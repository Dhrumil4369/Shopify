import React from "react";
import ProductGrid from "../common/ProductGrid";

const topRatedProducts = [
  { id: 601, img: "https://picsum.photos/seed/rated1/400/500", title: "Ultra Comfort Sneakers", price: 4199, oldPrice: 5999, rating: 5.0 },
  { id: 602, img: "https://picsum.photos/seed/rated2/400/500", title: "Professional Laptop", price: 89999, oldPrice: 119999, rating: 4.9 },
  { id: 603, img: "https://picsum.photos/seed/rated3/400/500", title: "Premium Over-Ear Headphones", price: 5999, oldPrice: 8999, rating: 4.9 },
  { id: 604, img: "https://picsum.photos/seed/rated4/400/500", title: "Luxury Leather Jacket", price: 5499, oldPrice: 7999, rating: 5.0 },
  { id: 605, img: "https://picsum.photos/seed/rated5/400/500", title: "Advanced Fitness Watch", price: 12999, oldPrice: 17999, rating: 4.9 },
  { id: 606, img: "https://picsum.photos/seed/rated6/400/500", title: "High-End Gaming Laptop", price: 149999, oldPrice: 189999, rating: 4.9 },
  { id: 607, img: "https://picsum.photos/seed/rated7/400/500", title: "Designer Sunglasses", price: 3499, oldPrice: 5499, rating: 4.8 },
  { id: 608, img: "https://picsum.photos/seed/rated8/400/500", title: "Premium Winter Coat", price: 7999, oldPrice: 11999, rating: 5.0 },
];

const TopRated = () => {
  return <ProductGrid title="Top Rated Products" products={topRatedProducts} />;
};

export default TopRated;