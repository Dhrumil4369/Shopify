import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter, FaEye, FaTimes, FaImage } from "react-icons/fa";
import axios from "axios";


const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    images: [""],
    rating: 0,
    MRP: "",
    discountPrice: "",
    percentageOff: 0,
    category: "Mens Wear",
    bestSelling: false,
    quantity: 0,
    remainingQuantity: 0,
    sizes: [],
    description: "",
    keyFeatures: [""],
  });
  
  const categories = ["Mens Wear","Kids Wear","Electronics",];

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Auto-hide error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("https://dhrumil-backend.vercel.app/api/products");
      
      // Handle different possible response structures
      let productsData = [];
      if (Array.isArray(res.data)) {
        productsData = res.data;
      } else if (res.data && Array.isArray(res.data.products)) {
        productsData = res.data.products;
      } else if (res.data && res.data.data) {
        productsData = Array.isArray(res.data.data) ? res.data.data : [];
      }
      
      setProducts(productsData);
    } catch (error) {
      console.error("Failed to fetch products", error);
      setError("Failed to load products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // // Check if product with same name already exists
  // const checkDuplicateProduct = (productName, excludeId = null) => {
  //   return products.some(product => 
  //     product.name.toLowerCase().trim() === productName.toLowerCase().trim() && 
  //     product._id !== excludeId
  //   );
  // };

  const filteredProducts = products.filter((product) => {
    const name = product.name?.toLowerCase() || "";
    const desc = product.description?.toLowerCase() || "";
    const category = product.category?.toLowerCase() || "";

    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      desc.includes(searchTerm.toLowerCase()) ||
      category.includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  /*  FORM HANDLING  */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleArrayInputChange = (field, index, value) => { 
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field) => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeArrayField = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes];
    if (!newSizes[index]) {
      newSizes[index] = { size: "", quantity: 0, mrp: 0, discountPrice: 0, image: "" };
    }
    newSizes[index][field] = field === 'quantity' || field === 'mrp' || field === 'discountPrice' 
      ? Number(value) 
      : value;
    setFormData({ ...formData, sizes: newSizes });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      images: [""],
      rating: 0,
      MRP: "",
      discountPrice: "",
      percentageOff: 0,
      category: "Mens Wear",
      bestSelling: false,
      quantity: 0,
      remainingQuantity: 0,
      sizes: [],
      description: "",
      keyFeatures: [""],
    });
  };

  /* ADD PRODUCT */
  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    // // Check for duplicate product
    // if (checkDuplicateProduct(formData.name)) {
    //   setError(`A product with the name "${formData.name}" already exists. Please use a different name.`);
    //   return;
    // }

    try {
      const productData = {
        ...formData,
        MRP: Number(formData.MRP),
        discountPrice: Number(formData.discountPrice),
        quantity: Number(formData.quantity),
        remainingQuantity: Number(formData.remainingQuantity),
        rating: Number(formData.rating),
        percentageOff: Number(formData.percentageOff),
        sizes: formData.sizes.filter(size => size.size && size.size.trim() !== ""),
        images: formData.images.filter(img => img.trim() !== ""),
        keyFeatures: formData.keyFeatures.filter(feature => feature.trim() !== ""),
      };

      await axios.post("https://dhrumil-backend.vercel.app/api/products/create", productData);
      
      setSuccessMessage("Product added successfully!");
      fetchProducts();
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error("Add product failed", error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to add product. Please try again.");
      }
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    
    // // Check for duplicate product (excluding current product being edited)
    // if (checkDuplicateProduct(formData.name, currentProduct._id)) {
    //   setError(`A product with the name "${formData.name}" already exists. Please use a different name.`);
    //   return;
    // }

    try {
      const productData = {
        ...formData,
        MRP: Number(formData.MRP),
        discountPrice: Number(formData.discountPrice),
        quantity: Number(formData.quantity),
        remainingQuantity: Number(formData.remainingQuantity),
        rating: Number(formData.rating),
        percentageOff: Number(formData.percentageOff),
        sizes: formData.sizes.filter(size => size.size && size.size.trim() !== ""),
        images: formData.images.filter(img => img.trim() !== ""),
        keyFeatures: formData.keyFeatures.filter(feature => feature.trim() !== ""),
      };

      await axios.put(`https://dhrumil-backend.vercel.app/api/products/update/${currentProduct._id}`, productData);
      
      setSuccessMessage("Product updated successfully!");
      fetchProducts();
      setShowEditModal(false);
      resetForm();
      setCurrentProduct(null);
    } catch (error) {
      console.error("Edit product failed", error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to update product. Please try again.");
      }
    }
  };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name || "",
      images: product.images && product.images.length > 0 ? product.images : [""],
      rating: product.rating || 0,
      MRP: product.MRP || product.mrp || "",
      discountPrice: product.discountPrice || "",
      percentageOff: product.percentageOff || 0,
      category: product.category || "Mens Wear",
      bestSelling: product.bestSelling || false,
      quantity: product.quantity || 0,
      remainingQuantity: product.remainingQuantity || 0,
      sizes: product.sizes && product.sizes.length > 0 ? product.sizes : [],
      description: product.description || "",
      keyFeatures: product.keyFeatures && product.keyFeatures.length > 0 ? product.keyFeatures : [""],
    });
    setShowEditModal(true);
  };

  const openViewModal = (product) => {
    setCurrentProduct(product);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await axios.delete(`https://dhrumil-backend.vercel.app/api/products/delete/${id}`);
      setSuccessMessage("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Delete product failed", error);
      setError("Failed to delete product. Please try again.");
    }
  };

  const getStockStatus = (stock) => {
    if (stock > 50) return <span className="px-2 py-1 rounded bg-green-900/30 text-green-400 text-xs">In Stock</span>;
    if (stock > 10) return <span className="px-2 py-1 rounded bg-yellow-900/30 text-yellow-400 text-xs">Low Stock</span>;
    if (stock > 0) return <span className="px-2 py-1 rounded bg-orange-900/30 text-orange-400 text-xs">Limited</span>;
    return <span className="px-2 py-1 rounded bg-red-900/30 text-red-400 text-xs">Out of Stock</span>;
  };

  const calculateDiscount = (mrp, discountPrice) => {
    if (!mrp || !discountPrice) return 0;
    return Math.round(((mrp - discountPrice) / mrp) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          <p className="text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Product Management</h1>
          <p className="text-gray-400 mt-1">Manage your product inventory and details</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-gradient-to-r bg-yellow-600 text-white px-6 py-3 rounded-lg 
        shadow-lg flex items-center gap-2 transition-all duration-200 hover:shadow-xl">
          <FaPlus />
          Add New Product
        </button>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-900/20 border border-green-800/30 text-green-400 rounded-lg">
          <div className="flex items-center justify-between">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage("")} className="text-green-400 hover:text-green-300">
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-800/30 text-red-400 rounded-lg">
          <div className="flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError("")} className="text-red-400 hover:text-red-300">
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Search + Filter */}
      <div className="bg-gray-800 rounded-xl shadow-lg p-4 mb-6 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input className="pl-12 pr-4 py-3 w-full bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 
            focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500" placeholder="Search products by name, description, or category..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />
              <select className="pl-10 pr-8 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 
              focus:ring-purple-500 focus:border-transparent appearance-none text-white" value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="all" className="bg-gray-800">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-gray-800">{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-900 to-gray-800">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-300">Product</th>
                <th className="text-left p-4 font-semibold text-gray-300">Category</th>
                <th className="text-left p-4 font-semibold text-gray-300">Price</th>
                <th className="text-left p-4 font-semibold text-gray-300">Stock</th>
                <th className="text-left p-4 font-semibold text-gray-300">Status</th>
                <th className="text-left p-4 font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-750 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {product.images && product.images[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover border 
                          border-gray-700"/>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-900 border border-gray-700 flex items-center justify-center">
                            <FaImage className="text-gray-600" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-white">{product.name }</div>
                          <div className="text-sm text-gray-400 truncate max-w-xs">
                            {product.description?.substring(0, 60)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-purple-900/30 text-purple-400 rounded-full text-sm border border-purple-800/30">
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">
                          ₹{product.discountPrice || product.price}
                        </span>
                        {product.MRP && product.MRP > (product.discountPrice || product.price) && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{product.MRP}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-900 rounded-full h-2">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-2 rounded-full" 
                            style={{ width: `${Math.min(100, (product.remainingQuantity / (product.quantity || 1)) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-300">
                          {product.remainingQuantity || 0}/{product.quantity || 0}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      {getStockStatus(product.remainingQuantity || product.stock)}
                      {product.bestSelling && (
                        <span className="ml-2 px-2 py-1 rounded bg-purple-900/30 text-purple-400 text-xs border border-purple-800/30">
                          Best Seller
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => openViewModal(product)} className="p-2 text-blue-400 hover:bg-blue-900/20 
                        rounded-lg transition-colors border border-blue-900/30 hover:border-blue-700/50" title="View Details">
                          <FaEye />
                        </button>

                        <button onClick={() => openEditModal(product)} className="p-2 text-emerald-400 hover:bg-emerald-900/20 
                        rounded-lg transition-colors border border-emerald-900/30 hover:border-emerald-700/50" title="Edit">
                          <FaEdit />
                        </button>

                        <button onClick={() => handleDelete(product._id)} className="p-2 text-red-400 hover:bg-red-900/20 
                        rounded-lg transition-colors border border-red-900/30 hover:border-red-700/50" title="Delete">
                          <FaTrash />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-gray-600 text-6xl mb-4">📦</div>
                      <div className="text-lg font-medium text-gray-400">No products found</div>
                      <p className="text-gray-500 mt-2">
                        {searchTerm || filterCategory !== "all" 
                          ? "Try adjusting your search or filter" 
                          : "Get started by adding your first product"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showViewModal && currentProduct && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white">{currentProduct.name}</h2>
                <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-300 hover:bg-gray-700 
                p-2 rounded-lg transition-colors">
                  <FaTimes size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="rounded-xl overflow-hidden mb-4 border border-gray-700">
                    {currentProduct.images && currentProduct.images[0] ? (
                      <img src={currentProduct.images[0]} alt={currentProduct.name} className="w-full h-64 object-cover"/>
                    ) : (
                      <div className="w-full h-64 bg-gray-900 flex items-center justify-center">
                        <FaImage className="text-gray-600 text-4xl" />
                      </div>
                    )}
                  </div>

                  {currentProduct.images && currentProduct.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {currentProduct.images.slice(1).map((img, idx) => (
                        <img key={idx} src={img} alt={`${currentProduct.name} ${idx + 2}`} className="w-20 h-20 object-cover 
                        rounded-lg border border-gray-700"/>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">Product Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                        <p className="text-sm text-gray-400">Category</p>
                        <p className="font-medium text-white">{currentProduct.category}</p>
                      </div>
                      <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                        <p className="text-sm text-gray-400">Rating</p>
                        <p className="font-medium text-yellow-400">{currentProduct.rating || 'N/A'} ⭐</p>
                      </div>
                      <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                        <p className="text-sm text-gray-400">MRP</p>
                        <p className="font-medium text-gray-300">₹{currentProduct.MRP}</p>
                      </div>
                      <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                        <p className="text-sm text-gray-400">Discounted Price</p>
                        <p className="font-medium text-emerald-400">₹{currentProduct.discountPrice}</p>
                      </div>
                      <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                        <p className="text-sm text-gray-400">Discount</p>
                        <p className="font-medium text-red-400">{currentProduct.percentageOff || calculateDiscount(currentProduct.MRP, currentProduct.discountPrice)}% OFF</p>
                      </div>
                      <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                        <p className="text-sm text-gray-400">Best Selling</p>
                        <p className="font-medium text-purple-400">{currentProduct.bestSelling ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">Stock Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                        <p className="text-sm text-gray-400">Total Quantity</p>
                        <p className="font-medium text-white">{currentProduct.quantity}</p>
                      </div>
                      <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                        <p className="text-sm text-gray-400">Remaining</p>
                        <p className="font-medium text-white">{currentProduct.remainingQuantity}</p>
                      </div>
                    </div>
                  </div>

                  {currentProduct.sizes && currentProduct.sizes.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">Available Sizes</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentProduct.sizes.map((size, idx) => (
                          <div key={idx} className="border border-gray-700 bg-gray-900/50 rounded-lg p-3 min-w-[100px] hover:border-purple-500/50 transition-colors">
                            <p className="font-semibold text-white text-center">{size.size}</p>
                            <p className="text-sm text-gray-400 text-center">Qty: {size.quantity}</p>
                            <p className="text-sm text-emerald-400 text-center">₹{size.discountPrice}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentProduct.keyFeatures && currentProduct.keyFeatures.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">Key Features</h3>
                      <ul className="space-y-2">
                        {currentProduct.keyFeatures.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-300">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-gray-700">Description</h3>
                    <p className="text-gray-300 bg-gray-900/30 p-4 rounded-lg border border-gray-700">
                      {currentProduct.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <form onSubmit={showAddModal ? handleAddProduct : handleEditProduct} className="p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-gray-700 pb-4">
                <h2 className="text-2xl font-bold text-white">
                  {showAddModal ? "Add New Product" : "Edit Product"}
                </h2>
                <button type="button" onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                    setCurrentProduct(null);
                  }}
                  className="text-gray-400 hover:text-gray-300 hover:bg-gray-700 p-2 rounded-lg transition-colors">
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Product Name *
                  </label>
                  <input name="name" placeholder="Enter product name" value={formData.name} onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 
                    focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-500" required/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="w-full bg-gray-900 
                  border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent 
                  text-white" required>
                    {categories.map((category) => (
                      <option key={category} value={category} className="bg-gray-800">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    MRP (₹) *
                  </label>
                  <input name="MRP" type="number" placeholder="799" value={formData.MRP} onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 
                    focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-500" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Discount Price (₹) *
                  </label>
                  <input name="discountPrice" type="number" placeholder="599" value={formData.discountPrice} onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 
                    focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-500" required/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Total Quantity *
                  </label>
                  <input name="quantity" type="number" placeholder="100" value={formData.quantity} onChange={handleInputChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 
                    focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-500" required/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating (0-5)
                  </label>
                  <input name="rating" type="number" min="0" max="5" step="0.1" placeholder="4.5" value={formData.rating}
                    onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 
                    focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-500"/>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image URLs
                </label>
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input type="text" placeholder="https://picsum.photos/seed/tshirt1/800/800" value={image}
                      onChange={(e) => handleArrayInputChange("images", index, e.target.value)} className="flex-1 bg-gray-900 
                      border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 
                      focus:border-transparent text-white placeholder-gray-500"/>
                    {formData.images.length > 1 && (
                      <button type="button" onClick={() => removeArrayField("images", index)} className="px-4 py-2 bg-red-900/30 
                      text-red-400 rounded-lg hover:bg-red-900/50 border border-red-800/30">
                        Remove
                      </button>
                    )}
                  </div>
                ))}

                <button type="button" onClick={() => addArrayField("images")} className="mt-2 px-4 py-2 bg-yellow-900/30 
                text-yellow-400 rounded-lg hover:bg-yellow-900/50 border border-yellow-800/30">
                  Add Image URL
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sizes
                </label>
                {formData.sizes.map((size, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2 mb-2">
                    <select value={size.size || ""} onChange={(e) => handleSizeChange(index, "size", e.target.value)}
                      className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2
                      focus:ring-yellow-600 focus:border-transparent text-white">

                      <option value="" className="bg-gray-800">Select Size</option>
                      {sizeOptions.map((opt) => (
                        <option key={opt} value={opt} className="bg-gray-800">{opt}</option>
                      ))}
                    </select>

                    <input type="number" placeholder="Qty" value={size.quantity || ""} 
                    onChange={(e) => handleSizeChange(index, "quantity", e.target.value)} className="bg-gray-900 border 
                    border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent 
                    text-white placeholder-gray-500"/>

                    <input type="number"
                      placeholder="MRP"
                      value={size.mrp || ""}
                      onChange={(e) => handleSizeChange(index, "mrp", e.target.value)}
                      className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent text-white placeholder-gray-500"
                    />
                    <input
                      type="number"
                      placeholder="Discounted"
                      value={size.discountPrice || ""}
                      onChange={(e) => handleSizeChange(index, "discountPrice", e.target.value)}
                      className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent text-white placeholder-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newSizes = formData.sizes.filter((_, i) => i !== index);
                        setFormData({ ...formData, sizes: newSizes });
                      }}
                      className="px-3 py-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 border border-red-800/30"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, sizes: [...formData.sizes, {}] })}
                  className="mt-2 px-4 py-2 bg-yellow-900/30 text-yellow-400 rounded-lg hover:bg-yellow-900/50 border border-yellow-800/30"
                >
                  Add Size Variant
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Key Features
                </label>
                {formData.keyFeatures.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="100% Cotton"
                      value={feature}
                      onChange={(e) => handleArrayInputChange("keyFeatures", index, e.target.value)}
                      className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent text-white placeholder-gray-500"
                    />
                    {formData.keyFeatures.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayField("keyFeatures", index)}
                        className="px-4 py-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50 border border-red-800/30"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayField("keyFeatures")}
                  className="mt-2 px-4 py-2 bg-yellow-900/30 text-yellow-400 rounded-lg hover:bg-yellow-900/50 border border-yellow-800/30"
                >
                  Add Feature
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  placeholder="Detailed product description..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-500"
                  required
                />
              </div>

              <div className="flex items-center p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                <input
                  type="checkbox"
                  name="bestSelling"
                  checked={formData.bestSelling}
                  onChange={handleInputChange}
                  className="h-5 w-5 rounded accent-yellow-500  focus:ring-yellow-500 bg-gray-800 border border-gray-700"
                />
                <label className="ml-3 text-sm font-medium text-gray-300">
                  Mark as Best Selling Product
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                    setCurrentProduct(null);
                  }}
                  className="flex-1 border border-gray-600 text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-yellow-600 text-white px-6 py-3 rounded-lg transition-all duration-300 
                shadow-lg hover:bg-yellow-500 hover:shadow-yellow-500/40 hover:shadow-inner">
                  {showAddModal ? "Add Product" : "Update Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;