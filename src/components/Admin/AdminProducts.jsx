import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter } from "react-icons/fa";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    category: "Mens Wear",
    price: "",
    stock: "",
    image: "",
    description: ""
  });

  // Categories
  const categories = ["All", "Mens Wear", "Kids Wear", "Electronics", "Home & Living", "Accessories"];

  useEffect(() => {
    const savedProducts = localStorage.getItem("adminProducts");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      const initialProducts = [
        { id: 1, name: "Nike Air Max", category: "Mens Wear", price: 120, stock: 45, image: "https://picsum.photos/seed/prod1/200/200", description: "Premium running shoes" },
        { id: 2, name: "Summer Dress", category: "Kids Wear", price: 35, stock: 12, image: "https://picsum.photos/seed/prod2/200/200", description: "Light summer dress for kids" },
        { id: 3, name: "Wireless Earbuds", category: "Electronics", price: 89, stock: 0, image: "https://picsum.photos/seed/prod3/200/200", description: "Bluetooth 5.0 earbuds" },
        { id: 4, name: "Leather Jacket", category: "Mens Wear", price: 199, stock: 8, image: "https://picsum.photos/seed/prod4/200/200", description: "Genuine leather jacket" },
        { id: 5, name: "Smart Watch", category: "Electronics", price: 249, stock: 25, image: "https://picsum.photos/seed/prod5/200/200", description: "Fitness tracker with GPS" },
      ];
      setProducts(initialProducts);
      localStorage.setItem("adminProducts", JSON.stringify(initialProducts));
    }
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("adminProducts", JSON.stringify(products));
    }
  }, [products]);

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const newProduct = {
      id: Date.now(),
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
    };
    setProducts([...products, newProduct]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditProduct = (e) => {
    e.preventDefault();
    const updatedProducts = products.map((prod) =>
      prod.id === currentProduct.id
        ? { ...prod, ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) }
        : prod
    );
    setProducts(updatedProducts);
    setShowEditModal(false);
    resetForm();
  };

  const openEditModal = (product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image: product.image,
      description: product.description
    });
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((prod) => prod.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({ name: "", category: "Mens Wear", price: "", stock: "", image: "", description: ""});
  };

  const getStockStatus = (stock) => {
    if (stock > 20) return { text: "In Stock", color: "bg-green-100 text-green-800" };
    if (stock > 0) return { text: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
    return { text: "Out of Stock", color: "bg-red-100 text-red-800" };
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Products</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
            Manage your products and inventory
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark 
        text-white px-4 py-3 md:px-6 md:py-3 rounded-lg font-medium transition-all w-full md:w-auto">
          <FaPlus />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 
              rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"/>
          </div>
          
          {/* Filter */}
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-gray-50 dark:bg-gray-700 
            border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent 
            flex-1 md:flex-none">
              {categories.map(cat => (
                <option key={cat} value={cat === "All" ? "all" : cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Products</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{products.length}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">In Stock</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {products.filter(p => p.stock > 0).length}
            </p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Low Stock</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {products.filter(p => p.stock > 0 && p.stock <= 20).length}
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Out of Stock</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {products.filter(p => p.stock === 0).length}
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid/Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Product</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Price</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover"/>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">{product.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-800 dark:text-white">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{product.stock} units</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEditModal(product)} className="flex items-center gap-2 text-blue-600 
                        hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                          <FaEdit />
                          <span className="hidden lg:inline">Edit</span>
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="flex items-center gap-2 text-red-600 
                        hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                          <FaTrash />
                          <span className="hidden lg:inline">Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden">
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No products found
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product.stock);
                return (
                  <div key={product.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="flex gap-4">
                      <img src={product.image} alt={product.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0"/>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-800 dark:text-white truncate">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {product.description}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${stockStatus.color}`}>
                            {stockStatus.text}
                          </span>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Category:</span>
                            <span className="ml-2 font-medium">{product.category}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Price:</span>
                            <span className="ml-2 font-bold">${product.price.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400">Stock:</span>
                            <span className="ml-2 font-medium">{product.stock} units</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end gap-3">
                          <button onClick={() => openEditModal(product)} className="flex items-center gap-1 text-blue-600 
                          dark:text-blue-400 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                            <FaEdit size={14} />
                            <span className="text-sm">Edit</span>
                          </button>
                          <button onClick={() => handleDelete(product.id)} className="flex items-center gap-1 text-red-600 dark:text-red-400 
                          px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/30">
                            <FaTrash size={14} />
                            <span className="text-sm">Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                  {showAddModal ? "Add New Product" : "Edit Product"}
                </h2>
                <button onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={showAddModal ? handleAddProduct : handleEditProduct} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Product Name</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter product name"
                      required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 
                      focus:ring-2 focus:ring-primary focus:border-transparent"/>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select name="category" value={formData.category} onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 
                      focus:ring-primary focus:border-transparent">
                      {categories.filter(c => c !== "All").map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price ($)</label>
                    <input name="price" type="number" step="0.01" min="0" value={formData.price} onChange={handleInputChange}
                      placeholder="0.00" required  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                      dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"/>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Stock Quantity</label>
                    <input name="stock" type="number" min="0" value={formData.stock} onChange={handleInputChange} placeholder="0"
                      required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 
                      focus:ring-2 focus:ring-primary focus:border-transparent"/>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input name="image" value={formData.image} onChange={handleInputChange} placeholder="https://example.com/image.jpg"
                    required className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 
                    focus:ring-2 focus:ring-primary focus:border-transparent"/>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea name="description" value={formData.description}vonChange={handleInputChange}
                    placeholder="Enter product description" rows="3" className="w-full p-3 border border-gray-300 dark:border-gray-600 
                    rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent resize-none"/>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button type="button" onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg 
                    hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark 
                  transition font-medium">
                    {showAddModal ? "Add Product" : "Save Changes"}

                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;