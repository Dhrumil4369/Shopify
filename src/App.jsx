import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from "react-router-dom";

// Common Components
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Popup from "./components/Popup/Popup";

// Home Page Components
import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";
import TopProducts from "./components/TopProducts/TopProducts";
import Banner from "./components/Banner/Banner";
import Testimonials from "./components/Testimonials/Testimonials";
import Subscribe from "./components/Subscribe/Subscribe";

// Pages
import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import KidsWear from "./components/pages/KidsWear";
import MensWear from "./components/pages/MensWear";
import Electronics from "./components/pages/Electonics";
import TrendingProduct from "./components/pages/TrendingProduct";
import BestSelling from "./components/pages/BestSelling";
import TopRated from "./components/pages/TopRated";
import Cart from "./components/pages/Cart";
import Checkout from "./components/pages/CheckOut";

// Admin Pages
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminProducts from "./components/Admin/AdminProducts";
import AdminOrders from "./components/Admin/AdminOrders";
import AdminUsers from "./components/Admin/AdminUsers";
import AdminSettings from "./components/Admin/AdminSettings";

// Context Providers
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

// Animation & Styles
import AOS from "aos";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Layout for normal pages (with Navbar & Footer)
const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
);

// Layout for Admin Panel (NO Navbar & NO Footer)
const AdminLayout = () => <AdminDashboard />;

const App = () => {
  const [orderPopup, setOrderPopup] = useState(false);
  const location = useLocation();

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
      offset: 100,
    });
    AOS.refresh();
  }, []);

  // Check if current route is under /admin
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <AuthProvider>
      <CartProvider>
        <div className="bg-white dark:bg-gray-900 dark:text-white font-sans min-h-screen">
          {/* Conditionally render layout */}
          {isAdminRoute ? (
            <Routes>
              {/* All Admin Routes use AdminLayout (which includes sidebar) */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<div className="p-6 md:p-10"><h1 className="text-4xl font-bold">Dashboard Overview</h1></div>} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
          ) : (
            <MainLayout>
              <Routes>
                {/* Home Page */}
                <Route
                  path="/"
                  element={
                    <>
                      <Hero handleOrderPopup={handleOrderPopup} />
                      <Products />
                      <TopProducts handleOrderPopup={handleOrderPopup} />
                      <Banner />
                      <Testimonials />
                      <Subscribe />
                      <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
                    </>
                  }
                />

                {/* Authentication */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Product Categories */}
                <Route path="/kidswear" element={<KidsWear />} />
                <Route path="/menswear" element={<MensWear />} />
                <Route path="/electronics" element={<Electronics />} />
                <Route path="/trendingproducts" element={<TrendingProduct />} />
                <Route path="/bestselling" element={<BestSelling />} />
                <Route path="/toprated" element={<TopRated />} />

                {/* Cart & Checkout */}
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
              </Routes>
            </MainLayout>
          )}
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;