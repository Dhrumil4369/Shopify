import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import { useCart } from "../../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://dhrumil-backend.vercel.app/api/products`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          const found = data.products.find((p) => p._id === id);
          if (found) {
            setProduct(found);
          } else {
            setError("Product not found");
          }
        } else {
          setError("Invalid response from server");
        }
      })
      .catch(() => setError("Failed to load product"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">{product.name}</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2 grid grid-cols-2 gap-4">
          {product.images.map((img, idx) => (
            <img key={idx} src={img} alt={product.name} className="w-full h-auto object-cover rounded-lg" />
          ))}
        </div>

        <div className="md:w-1/2">
          <p className="mb-3 text-white">
            <strong>Category:</strong> {product.category}</p>

            <div className="flex items-center gap-2 mb-4 text-white">
              <strong>Rating:</strong> 

              <div className="flex flex-row items-center text-yellow-400 gap-1">
                {[1,2,3,4,5].map((num) =>
                num <= Math.round(product.rating) ? (
                  <FaStar key={num} />
                ): (
                  <FaRegStar key={num} />
                )
                )}
              </div>
            <span className="text-sm text-gray-600">({product.rating})</span>
          </div>
          <p className="mb-4 text-lg"><strong>Price:</strong>{" "}

            <span className="text-green-600 font-bold text-xl">
              ₹{product.discountPrice}
            </span>{" "}

            <span className="line-through text-gray-400 ml-2">
              ₹{product.MRP}
            </span>
          </p>
            
          <p className="mb-4 text-white">
            <strong>Description:</strong> {product.description}
          </p>

          <div className="mb-6">
            <strong>Key Features:</strong>
            <ul className="list-disc ml-6 mt-2 text-white">
              {product.keyFeatures?.map((f, i) => (
              <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          <h3 className="mt-6 mb-3 font-semibold text-lg">Available Sizes</h3>
          <div className="flex gap-4 flex-wrap">
            {product.sizes?.map((s) => (
            <button key={s._id} onClick={() => setSelectedSize(s)}
            className={`border rounded-lg px-4 py-3 text-center w-20 transition
              ${selectedSize?.size === s.size
                ? "border-green-500 bg-green-200 text-black"
                : "hover:border-white"
              }`}>
              <p className="font-semibold text-lg">{s.size}</p>
              <p className="text-xs text-gray-500 mt-1">
                {s.quantity} left
              </p>
            </button>
            ))}
          </div>
          <div className="mt-8">
            <button disabled={!selectedSize} onClick={()=> addToCart({
              id: product._id,
                  title: product.name,
                  price: product.discountPrice,
                  img: product.images[0],
                  size: selectedSize.size,
                  quantity: 1,
            })
            }
            className={`w-full py-4 text-lg font-semibold rounded-xl transition
                ${
                  selectedSize
                    ? "bg-green-500 hover:bg-green-600 text-black"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
            >
              Add to Cart
            </button>
            {!selectedSize && (
              <p className="text-yellow-400 text-sm mt-2">
                Please select a size
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;