import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductGrid from "../common/ProductGrid";

const Menswear = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "https://dhrumil-backend.vercel.app/api/products"
        );

        if (!isMounted) return;

        const data = res.data;

        if (data.success && Array.isArray(data.products)) {
          const mensProducts = data.products.filter(
            (item) =>
              item.category?.toLowerCase().includes("mens") ||
              item.category?.toLowerCase().includes("men") ||
              item.category?.toLowerCase().includes("mens wear"));

          const mapped = mensProducts.map((item) => ({
            id: item._id,
            title: item.name || "Unnamed Product",
            price: Number(item.discountPrice) || 0,
            oldPrice: Number(item.MRP) || null,
            rating: Number(item.rating) || 4.5,
            img:
              item.images?.[0] ||
              "https://via.placeholder.com/400x500?text=No+Image",
            fullData: item,
          }));

          setProducts(mapped);
        } else {
          setError("Invalid response format from server");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Loading Men's Collection...
          </p>
          
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-xl font-semibold text-red-600 dark:text-red-500 px-4 text-center">
          {error}
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-lg text-gray-500 dark:text-gray-400">
          No men's wear products available at the moment
        </p>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ProductGrid 
          title="Men's Collection" 
          products={products} 
        />
      </div>
    </section>
  );
};

export default Menswear;