import React, { useState, useEffect, useRef } from "react";
import Logo from "../../assets/logo.png";
import { IoMdSearch, IoMdClose, IoMdMenu } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import DarkMode from "./DarkMode";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const Menu = [
  { id: 1, name: "Home", link: "/" },
  { id: 2, name: "Kids Wear", link: "/kidswear" },
  { id: 3, name: "Mens Wear", link: "/menswear" },
  { id: 4, name: "Electronics", link: "/electronics" },
  { id: 5, name: "Cart", link: "/cart" },
];

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsProfileDropdownOpen(false);
  };

  // ... (scroll and click-outside useEffects remain unchanged)

  return (
    <div className={`shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 fixed top-0 left-0 right-0 z-40 
      transition-transform duration-300 ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
      
      {/* upper Navbar */}
      <div className="bg-primary/40 py-3 sm:py-2">
        <div className="container flex justify-between items-center">
          <div className="flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="mobile-menu-button sm:hidden mr-3 text-2xl">
              {isMobileMenuOpen ? <IoMdClose /> : <IoMdMenu />}
            </button>
            
            <Link to="/" className="font-bold text-2xl sm:text-3xl flex gap-2 items-center">
              <img src={Logo} alt="Logo" className="w-10 h-10" />
              Shopify
            </Link>
          </div>

          <div className="flex justify-between items-center gap-4">
            {/* Search bar (unchanged) */}
            <div className="relative group hidden sm:block">
              <input
                type="text"
                placeholder="Search products..."
                className="w-[200px] sm:w-[200px] group-hover:w-[300px] 
                transition-all duration-300 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-1 
                focus:border-primary dark:border-gray-500 dark:bg-gray-800 dark:text-white"
              />
              <IoMdSearch className="text-gray-500 group-hover:text-primary absolute top-1/2 -translate-y-1/2 right-4" />
            </div>

            {/* ==== NEW: Admin Button (only for admin) ==== */}
            {isAuthenticated && user?.role === "admin" && (
              <Link
                to="/admin"
                className="hidden sm:flex bg-black  text-white py-2 px-6 rounded-full 
                hover:scale-105 duration-300 font-semibold items-center gap-2"
              >
                Admin
              </Link>
            )}

            {/* User Profile / Login */}
            {isAuthenticated ? (
              <div ref={profileDropdownRef} className="hidden sm:flex items-center gap-3 relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white py-2 px-4 rounded-full hover:scale-105 duration-300"
                >
                  <FaUser className="text-lg" />
                  <span>{user?.name || "Profile"}</span>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border dark:border-gray-700 min-w-[200px]">
                    <div className="px-4 py-2 border-b dark:border-gray-700">
                      <p className="font-semibold truncate">{user?.name}</p>
                      <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                    </div>
                    
                    {/* Optional: Admin link inside dropdown too */}
                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-500 flex items-center gap-2"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white py-2 px-4 rounded-full items-center gap-2 hover:scale-105"
              >
                Login
              </Link>
            )}

            {/* Cart button */}
            <Link
              to="/cart"
              className="relative bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white py-2 px-4 rounded-full flex items-center gap-3 group hover:scale-105"
            >
              <span className="group-hover:block hidden transition-all duration-200">Cart</span>
              <FaCartShopping className="text-xl text-white drop-shadow-sm" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <div>
              <DarkMode />
            </div>
          </div>
        </div>
      </div>

      {/* lower Navbar - Desktop menu (unchanged) */}
      <div className="hidden sm:block bg-white dark:bg-gray-900 py-3 border-t dark:border-gray-700">
        <div className="container">
          <ul className="flex items-center justify-center gap-6">
            {Menu.map((data) => (
              <li key={data.id}>
                <Link to={data.link} className="inline-block px-4 hover:text-primary duration-200 font-medium">
                  {data.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Mobile Menu - Add Admin link for admin users */}
      <div
        ref={mobileMenuRef}
        className={`sm:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-700 overflow-hidden 
        transition-all duration-300 ${isMobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="container py-4">
          {/* Mobile search */}
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full p-3 rounded-full border border-gray-300 px-4 focus:outline-none focus:border-1 focus:border-primary dark:border-gray-500 dark:bg-gray-800 dark:text-white"
              />
              <IoMdSearch className="text-gray-500 absolute top-1/2 -translate-y-1/2 right-4" />
            </div>
          </div>

          {/* Mobile menu items */}
          <ul className="space-y-3">
            {Menu.map((data) => (
              <li key={data.id}>
                <Link
                  to={data.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg duration-200 font-medium"
                >
                  {data.name}
                </Link>
              </li>
            ))}

            {/* Admin link in mobile menu */}
            {isAuthenticated && user?.role === "admin" && (
              <li>
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-lg duration-200 font-semibold text-purple-700 dark:text-purple-400"
                >
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>

          {/* Mobile Login/Logout section */}
          <div className="mt-6 pt-6 border-t dark:border-gray-700">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="px-4">
                  <p className="font-semibold truncate">{user?.name}</p>
                  <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                </div>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-2"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-full hover:scale-105 duration-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;