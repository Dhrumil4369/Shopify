import React from "react";
import ProductGrid from "../common/ProductGrid";

const electronicsProducts = [
  { id: 301, img: "https://picsum.photos/seed/ele1/400/500", title: "Wireless Headphones", price: 3999, oldPrice: 5999, rating: 4.8 },
  { id: 302, img: "https://picsum.photos/seed/ele2/400/500", title: "Smart Watch Pro", price: 7999, oldPrice: 12999, rating: 4.7 },
  { id: 303, img: "https://picsum.photos/seed/ele3/400/500", title: "Bluetooth Speaker", price: 3499, oldPrice: 4999, rating: 4.6 },
  { id: 304, img: "https://picsum.photos/seed/ele4/400/500", title: "Gaming Laptop", price: 89999, oldPrice: 119999, rating: 4.9 },
  { id: 305, img: "https://picsum.photos/seed/ele5/400/500", title: "4K Action Camera", price: 14999, oldPrice: 21999, rating: 4.8 },
  { id: 306, img: "https://picsum.photos/seed/ele6/400/500", title: "Power Bank 20000mAh", price: 2499, oldPrice: 3999, rating: 4.7 },
];

const Electronics = () => {
  return <ProductGrid title="Electronics & Gadgets" products={electronicsProducts} />;
};

export default Electronics;