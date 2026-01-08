import React from "react";
import ProductGrid from "../common/ProductGrid";

const mensProducts = [
  { id: 201, img: "https://picsum.photos/seed/men1/400/500", title: "Formal Shirt", price: 1599, oldPrice: 2499, rating: 4.7 },
  { id: 202, img: "https://picsum.photos/seed/men2/400/500", title: "Slim Fit Jeans", price: 1999, oldPrice: 2999, rating: 4.6 },
  { id: 203, img: "https://picsum.photos/seed/men3/400/500", title: "Leather Jacket", price: 3999, oldPrice: 5999, rating: 4.9 },
  { id: 204, img: "https://picsum.photos/seed/men4/400/500", title: "Casual Hoodie", price: 1899, oldPrice: 2799, rating: 4.5 },
  { id: 205, img: "https://picsum.photos/seed/men5/400/500", title: "Running Shoes", price: 2999, oldPrice: 4499, rating: 4.8 },
  { id: 206, img: "https://picsum.photos/seed/men6/400/500", title: "Classic Watch", price: 4999, oldPrice: 7999, rating: 4.9 },
];

const MensWear = () => {
  return <ProductGrid title="Men's Fashion" products={mensProducts} />;
};

export default MensWear;