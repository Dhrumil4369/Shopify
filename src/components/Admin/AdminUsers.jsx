// // src/components/pages/admin/AdminUsers.jsx
// import React from "react";

// const AdminUsers = () => {
//   const users = [
//     { id: 1, name: "John Doe", email: "john@example.com", role: "customer", joined: "Oct 2025" },
//     { id: 2, name: "Admin User", email: "admin@shopify.com", role: "admin", joined: "Jan 2025" },
//     { id: 3, name: "Alice Smith", email: "alice@gmail.com", role: "customer", joined: "Dec 2025" },
//   ];

//   return (
//     <div className="p-6 md:p-10">
//       <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Manage Users</h1>

//       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
//         <table className="w-full">
//           <thead className="bg-gray-50 dark:bg-gray-700">
//             <tr>
//               <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold">Joined</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//             {users.map((user) => (
//               <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
//                 <td className="px-6 py-4 font-medium">{user.name}</td>
//                 <td className="px-6 py-4">{user.email}</td>
//                 <td className="px-6 py-4">
//                   <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
//                     {user.role}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 text-sm">{user.joined}</td>
//                 <td className="px-6 py-4">
//                   <button className="text-blue-600 hover:underline mr-4">Edit</button>
//                   <button className="text-red-600 hover:underline">Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminUsers;  


import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaUserPlus, FaSearch, FaEnvelope, FaPhone, FaUserCircle } from "react-icons/fa";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "customer",
    status: "active"
  });

  useEffect(() => {
    const savedUsers = localStorage.getItem("adminUsers");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      const initialUsers = [
        { id: 1, name: "John Doe", email: "john@example.com", phone: "+1 234-567-8900", role: "customer", status: "active", joined: "Oct 2025", orders: 12, totalSpent: 1245.50 },
        { id: 2, name: "Admin User", email: "admin@shopify.com", phone: "+1 234-567-8901", role: "admin", status: "active", joined: "Jan 2025", orders: 0, totalSpent: 0 },
        { id: 3, name: "Alice Smith", email: "alice@gmail.com", phone: "+1 234-567-8902", role: "customer", status: "active", joined: "Dec 2025", orders: 3, totalSpent: 289.99 },
        { id: 4, name: "Bob Johnson", email: "bob@yahoo.com", phone: "+1 234-567-8903", role: "customer", status: "inactive", joined: "Nov 2025", orders: 8, totalSpent: 756.00 },
        { id: 5, name: "Emma Wilson", email: "emma@hotmail.com", phone: "+1 234-567-8904", role: "moderator", status: "active", joined: "Sep 2025", orders: 0, totalSpent: 0 },
      ];
      setUsers(initialUsers);
      localStorage.setItem("adminUsers", JSON.stringify(initialUsers));
    }
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("adminUsers", JSON.stringify(users));
    }
  }, [users]);

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const newUser = {
      id: Date.now(),
      ...formData,
      joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      orders: 0,
      totalSpent: 0
    };
    setUsers([...users, newUser]);
    setShowAddModal(false);
    resetForm();
  };

  const handleEditUser = (e) => {
    e.preventDefault();
    const updatedUsers = users.map((user) =>
      user.id === currentUser.id
        ? { ...user, ...formData }
        : user
    );
    setUsers(updatedUsers);
    setShowEditModal(false);
    resetForm();
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status
    });
    setShowEditModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "customer",
      status: "active"
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      case "moderator": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "customer": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getStatusColor = (status) => {
    return status === "active" 
      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Users</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mt-1">
            Manage user accounts and permissions
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-3 md:px-6 md:py-3 rounded-lg font-medium transition-all w-full md:w-auto"
        >
          <FaUserPlus />
          <span>Add User</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{users.length}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {users.filter(u => u.status === "active").length}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Admins</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {users.filter(u => u.role === "admin").length}
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">Customers</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {users.filter(u => u.role === "customer").length}
            </p>
          </div>
        </div>
      </div>

      {/* Users Table/Cards */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">User</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Role</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Activity</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Joined {user.joined}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <FaEnvelope className="text-gray-400" size={12} />
                        <span className="text-gray-700 dark:text-gray-300">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaPhone className="text-gray-400" size={12} />
                        <span className="text-gray-700 dark:text-gray-300">{user.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="font-medium">{user.orders} orders</p>
                      <p className="text-gray-500 dark:text-gray-400">
                        ${user.totalSpent.toFixed(2)} spent
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEditModal(user)}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <FaEdit />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <FaTrash />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No users found
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-800 dark:text-white truncate">
                            {user.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Joined {user.joined}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <FaEnvelope className="text-gray-400" size={12} />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaPhone className="text-gray-400" size={12} />
                          <span>{user.phone}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t dark:border-gray-700">
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Orders</p>
                            <p className="font-bold">{user.orders}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400">Total Spent</p>
                            <p className="font-bold">${user.totalSpent.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end gap-3">
                        <button
                          onClick={() => openEditModal(user)}
                          className="flex items-center gap-1 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/30"
                        >
                          <FaEdit size={14} />
                          <span className="text-sm">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="flex items-center gap-1 text-red-600 dark:text-red-400 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/30"
                        >
                          <FaTrash size={14} />
                          <span className="text-sm">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                  {showAddModal ? "Add New User" : "Edit User"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={showAddModal ? handleAddUser : handleEditUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    required
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    required
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    required
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="admin">Admin</option>
                      <option value="moderator">Moderator</option>
                      <option value="customer">Customer</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium"
                  >
                    {showAddModal ? "Add User" : "Save Changes"}
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

export default AdminUsers;