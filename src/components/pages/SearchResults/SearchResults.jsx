import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, Link } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchProducts = async () => {
      if (!query) return;
      
      setLoading(true);
      try {
        const response = await axios.get('https://dhrumil-backend.vercel.app/api/products');
        
        const allProducts = response.data.products || response.data || [];
        
        const filtered = allProducts.filter(product => 
          (product.name && product.name.toLowerCase().includes(query.toLowerCase())) ||
          (product.category && product.category.toLowerCase().includes(query.toLowerCase())) ||
          (product.brand && product.brand.toLowerCase().includes(query.toLowerCase()))
        );
        setProducts(filtered);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [query]);

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <Link to="/" className="inline-flex items-center text-primary hover:text-primary-dark mb-6">
        <IoMdArrowBack className="mr-2" />
        Back to Home
      </Link>
      
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Search Results for "{query}"
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Found {products.length} product{products.length !== 1 ? 's' : ''}
      </p>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Searching products...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(product => (
            <Link 
              to={`/product/${product._id || product.id}`}
              key={product._id || product.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/300x200?text=Product'} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {product.category}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <span className="font-bold text-primary dark:text-primary-light text-xl">
                      ₹{product.discountPrice}
                    </span>
                    {product.MRP && (
                      <span className="block text-sm text-gray-500 line-through">
                        ₹{product.MRP}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    {[1, 2, 3, 4, 5].map(num => (
                      num <= Math.round(product.rating || 0) ? 
                        <span key={num}>★</span> : 
                        <span key={num}>☆</span>
                    ))}
                    <span className="text-sm text-gray-600 ml-1">({product.rating || 0})</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            No products found for "{query}"
          </p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Try searching with different keywords
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;