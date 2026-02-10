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