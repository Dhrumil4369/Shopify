import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductGrid from "../common/ProductGrid";

const Electronics = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchElectronics = async () => {
      try {
        const res = await axios.get("https://dhrumil-backend.vercel.app/api/products");

        if (!isMounted) return;

        if (res.data?.success && Array.isArray(res.data.products)) {
          const electronicsItems = res.data.products.filter((item) =>
            item.category?.toLowerCase().includes("electronics") ||
            item.category?.toLowerCase().includes("gadget") ||
            item.category?.toLowerCase().includes("mobile") ||
            item.category?.toLowerCase().includes("laptop") ||
            item.category?.toLowerCase().includes("headphone") ||
            item.category?.toLowerCase().includes("speaker") ||
            item.name?.toLowerCase().includes("watch") ||
            item.name?.toLowerCase().includes("camera") ||
            item.name?.toLowerCase().includes("power bank")
          );

          const formatted = electronicsItems.map((item) => ({
            id: item._id,
            title: item.name || "Product",
            price: Number(item.discountPrice) || item.MRP || 0,
            oldPrice: Number(item.MRP) || null,
            rating: Number(item.rating) || 4.5,
            img:
              item.images?.[0] ||
              "https://via.placeholder.com/400x500?text=No+Image",
            fullData: item,
          }));

          setProducts(formatted);
        } else {
          setError("Invalid response format");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load electronics");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchElectronics();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-lg text-gray-500">Loading electronics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-600 text-xl">
        {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-lg text-gray-600">No electronics available right now</p>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <ProductGrid title="Electronics & Gadgets" products={products} />
      </div>
    </section>
  );
};

export default Electronics;