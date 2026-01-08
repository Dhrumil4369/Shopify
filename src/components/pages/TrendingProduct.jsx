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