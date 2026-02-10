  import React, { useState, useEffect } from "react";
  import { useAuth } from "../../context/AuthContext";
  import { useNavigate, useLocation, Outlet } from "react-router-dom";
  import { FaHome, FaBoxOpen, FaShoppingCart, FaUsers, FaCog, FaSignOutAlt, FaBars, FaTimes, FaChevronDown } from "react-icons/fa";

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/admin" },
    { name: "Products", icon: <FaBoxOpen />, path: "/admin/products" },
    { name: "Orders", icon: <FaShoppingCart />, path: "/admin/orders" },
    { name: "Users", icon: <FaUsers />, path: "/admin/users" },
    { name: "Settings", icon: <FaCog />, path: "/admin/settings" },
  ];

  const AdminDashboard = () => {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }, []);

    //  PROTECTED ROUTE
    useEffect(() => {
      if (!isLoading) {
        if (!isAuthenticated || user?.role !== "admin") {
          navigate("/login", { replace: true });
        }
      }
    }, [isLoading, isAuthenticated, user, navigate]);

    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth >= 768) {
          setSidebarOpen(true);
        } else {
          setSidebarOpen(false);
        }
      };
      
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Loading Admin Panel...
            </div>
          </div>
        </div>
      );
    }

    const handleLogout = () => {
      logout();
      navigate("/");
    };

    const handleMenuClick = (path) => {
      navigate(path);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
        setMobileMenuOpen(false);
      }
    };

    const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
      if (window.innerWidth < 768) {
        setMobileMenuOpen(!mobileMenuOpen);
      }
    };

    const isActive = (path) => location.pathname === path;

    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col md:flex-row">
        <header className="bg-white dark:bg-gray-800 shadow-sm h-16 flex items-center justify-between px-4 
          md:hidden sticky top-0 z-40">
          <button onClick={toggleSidebar} className="text-2xl text-gray-700 dark:text-gray-300 p-2" 
          aria-label="Toggle menu">
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
                {user?.name || "Admin"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
            </div>
            <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
              {user?.name?.charAt(0) || "A"}
            </div>
          </div>
        </header>

        {/* Sidebar for Desktop & Mobile */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform 
        transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        flex flex-col h-screen md:h-auto`}>

          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center font-bold">
                A
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-800 dark:text-white">Admin Panel</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Dashboard</p>
              </div>
            </div>
            <button onClick={toggleSidebar} className="md:hidden text-xl text-gray-600 dark:text-gray-300 p-2"
              aria-label="Close menu">
              <FaTimes />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => handleMenuClick(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm 
                      ${ isActive(item.path) ? "bg-primary text-white shadow-md" : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`} aria-current={isActive(item.path) ? "page" : undefined}>
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full 
              flex items-center justify-center font-semibold">
                {user?.name?.charAt(0) || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-800 dark:text-white truncate">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || "admin@example.com"}
                </p>
              </div>
            </div>
            
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 
            rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition 
            font-medium text-sm" aria-label="Logout">
              <FaSignOutAlt className="text-lg" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleSidebar} aria-hidden="true"/>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:min-h-screen">
          {/* Desktop Header */}
          <header className="hidden md:flex items-center justify-between bg-white dark:bg-gray-800 shadow-sm h-16 px-8">
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                {menuItems.find(item => isActive(item.path))?.name || "Dashboard"}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Welcome to your admin dashboard
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 
                hover:bg-gray-200 dark:hover:bg-gray-600 transition" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                    {user?.name?.charAt(0) || "A"}
                  </div>
                  <FaChevronDown className={`transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {mobileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-3 border-b dark:border-gray-700">
                      <p className="font-medium text-gray-800 dark:text-white">{user?.name || "Admin"}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || "admin@example.com"}</p>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 
                    dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
            {location.pathname === "/admin" ? (
              <DashboardHome user={user} />
            ) : (
              <Outlet />
            )}
          </main>
        </div>
      </div>
    );
  };

  // Dashboard Home Component
  const DashboardHome = ({ user }) => (
    <div>
      {/* Welcome Header */}
      <div className="mb-6 md:mb-10">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white">
          Welcome back, <span className="text-primary">{user?.name || "Admin"}</span> 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 md:mt-3 text-sm md:text-base lg:text-lg">
          Here's what's happening with your store today — {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
        {[
          { title: "Total Revenue", value: "$45,678", change: "+12%", icon: "💰", color: "from-blue-500 to-blue-600" },
          { title: "Total Orders", value: "856", change: "+8 today", icon: "📦", color: "from-green-500 to-green-600" },
          { title: "Total Products", value: "324", change: "12 low stock", icon: "🛍️", color: "from-purple-500 to-purple-600" },
          { title: "Active Users", value: "1,234", change: "+45 weekly", icon: "👥", color: "from-orange-500 to-red-600" },
        ].map((stat, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${stat.color} p-4 md:p-6 rounded-xl md:rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="text-sm md:text-base font-medium opacity-90 truncate">{stat.title}</h3>
              <span className="text-xl md:text-2xl">{stat.icon}</span>
            </div>
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2">{stat.value}</p>
            <p className="text-xs md:text-sm opacity-80 flex items-center gap-1">
              <span className="text-green-300">↑ {stat.change}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Activity & Tasks - Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 lg:p-8">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-6">
            Recent Activity
          </h2>
          <div className="space-y-3 md:space-y-4">
            {[
              { title: "New order #1234", desc: "John Doe • 5 mins ago", amount: "$156.98", type: "order" },
              { title: "Product restocked", desc: "Nike Air Max • 12 mins ago", status: "In Stock", type: "stock" },
              { title: "User registered", desc: "New customer signup", time: "30 mins ago", type: "user" },
            ].map((activity, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 md:py-3 border-b dark:border-gray-700 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm md:text-base text-gray-800 dark:text-white truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">
                    {activity.desc}
                  </p>
                </div>
                {activity.amount ? (
                  <span className="text-green-600 dark:text-green-400 font-bold text-sm md:text-base ml-2">
                    {activity.amount}
                  </span>
                ) : (
                  <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 md:px-3 py-1 rounded-full text-xs">
                    {activity.status}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 lg:p-8">
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-6">
            Pending Tasks
          </h2>
          <div className="space-y-3 md:space-y-4">
            {[
              { title: "Review 3 new products", priority: "high", count: 3 },
              { title: "Process 5 pending orders", priority: "medium", count: 5 },
              { title: "Respond to 12 customer messages", priority: "low", count: 12 },
            ].map((task, idx) => (
              <div key={idx} className={`p-3 md:p-4 rounded-lg md:rounded-xl border ${
                  task.priority === 'high' 
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700' 
                    : task.priority === 'medium'
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className={`font-medium text-sm md:text-base ${
                    task.priority === 'high' 
                      ? 'text-red-800 dark:text-red-300' 
                      : task.priority === 'medium'
                      ? 'text-yellow-800 dark:text-yellow-300'
                      : 'text-blue-800 dark:text-blue-300'
                  }`}>
                    {task.title}
                  </p>
                  <span className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-bold 
                  w-6 h-6 rounded-full flex items-center justify-center">
                    {task.count}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className={`w-full h-1.5 rounded-full ${
                    task.priority === 'high' 
                      ? 'bg-red-300 dark:bg-red-600' 
                      : task.priority === 'medium'
                      ? 'bg-yellow-300 dark:bg-yellow-600'
                      : 'bg-blue-300 dark:bg-blue-600'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  export default AdminDashboard;