import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { IoMdSearch, IoMdClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ isMobile = false }) => {
  const API_URL = 'https://dhrumil-backend.vercel.app/api/products';
  
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const debounceTimeout = useRef(null);
  const navigate = useNavigate();

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch products from API
  const fetchProducts = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(API_URL);
      
      // Check if the response has the correct structure
      const products = response.data.products || response.data || [];
      
      // Filter products based on search query
      const filteredProducts = products.filter(product => {
        const searchLower = searchQuery.toLowerCase();
        return (
          (product.name && product.name.toLowerCase().includes(searchLower)) ||
          (product.category && product.category.toLowerCase().includes(searchLower)) ||
          (product.description && product.description.toLowerCase().includes(searchLower)) ||
          (product.brand && product.brand.toLowerCase().includes(searchLower))
        );
      }).slice(0, 5); // Limit to 5 suggestions
      
      setSuggestions(filteredProducts);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching products:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (query.trim()) {
      debounceTimeout.current = setTimeout(() => {
        fetchProducts(query);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (query.trim()) {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (product) => {
    setShowSuggestions(false);
    if (product._id) {
      navigate(`/product/${product._id}`);
    } else if (product.id) {
      navigate(`/product/${product.id}`);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  // Desktop search bar
  if (!isMobile) {
    return (
      <div className="relative group" ref={searchRef}>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setShowSuggestions(true)}
          placeholder="Search products..."
          className="w-[200px] sm:w-[200px] group-hover:w-[300px] 
          transition-all duration-300 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-1 
          focus:border-primary dark:border-gray-500 dark:bg-gray-800 dark:text-white pr-10"
        />
        
        {query ? (
          <button
            onClick={clearSearch}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <IoMdClose className="text-lg" />
          </button>
        ) : (
          <IoMdSearch className="text-gray-500 group-hover:text-primary absolute top-1/2 -translate-y-1/2 right-4 text-lg" />
        )}
        
        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-80 overflow-y-auto z-50">
            {suggestions.map((product, index) => (
              <div
                key={product._id || product.id || index}
                onClick={() => handleSuggestionClick(product)}
                className={`flex items-center p-3 cursor-pointer transition-colors duration-150 ${
                  index === selectedIndex
                    ? 'bg-primary/10 dark:bg-gray-700'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                } ${index > 0 ? 'border-t border-gray-100 dark:border-gray-700' : ''}`}
              >
                {product.images && product.images[0] && (
                  <div className="flex-shrink-0 mr-3">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-md"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/40x40?text=Product';
                      }}
                    />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {product.name || 'Unnamed Product'}
                  </p>
                  <div className="flex items-center mt-1 space-x-2">
                    {product.category && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {product.category}
                      </span>
                    )}
                  </div>
                </div>
                
                {product.discountPrice && (
                  <div className="ml-2 flex-shrink-0">
                    <span className="font-bold text-primary dark:text-primary-light">
                      ₹{product.discountPrice}
                    </span>
                    {product.MRP && (
                      <span className="block text-xs text-gray-500 line-through">
                        ₹{product.MRP}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* No Results */}
        {showSuggestions && !isLoading && query.trim() && suggestions.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50">
            <p className="text-gray-600 dark:text-gray-300 text-center">
              No products found for "<span className="font-medium">{query}</span>"
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-300">Searching...</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Mobile search bar
  return (
    <div className="relative mb-4" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setShowSuggestions(true)}
          placeholder="Search products..."
          className="w-full p-3 rounded-full border border-gray-300 px-4 focus:outline-none focus:border-1 focus:border-primary dark:border-gray-500 dark:bg-gray-800 dark:text-white pr-12"
        />
        
        {query ? (
          <button
            onClick={clearSearch}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <IoMdClose className="text-lg" />
          </button>
        ) : null}
        
        <button
          onClick={handleSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary dark:hover:text-primary-light"
        >
          <IoMdSearch className="text-lg" />
        </button>
      </div>
      
      {/* Mobile Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto z-50">
          {suggestions.map((product, index) => (
            <div
              key={product._id || product.id || index}
              onClick={() => handleSuggestionClick(product)}
              className={`flex items-center p-3 cursor-pointer transition-colors duration-150 ${
                index === selectedIndex
                  ? 'bg-primary/10 dark:bg-gray-700'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              } ${index > 0 ? 'border-t border-gray-100 dark:border-gray-700' : ''}`}
            >
              {product.images && product.images[0] && (
                <div className="flex-shrink-0 mr-3">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded-md"
                  />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {product.name || 'Unnamed Product'}
                </p>
                <div className="flex items-center mt-1">
                  {product.category && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {product.category}
                    </span>
                  )}
                  {product.discountPrice && (
                    <span className="ml-2 font-bold text-primary dark:text-primary-light text-sm">
                      ₹{product.discountPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;