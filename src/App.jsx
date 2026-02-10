import React, { useState, useEffect } from "react";
import {BrowserRouter as Router,Routes,Route,useLocation} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Popup from "./components/Popup/Popup";

import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";
import TopProducts from "./components/TopProducts/TopProducts";
import Banner from "./components/Banner/Banner";
import CartNotification from './components/CartNotification/CartNotification'
import Testimonials from "./components/Testimonials/Testimonials";
import Subscribe from "./components/Subscribe/Subscribe";

import Login from "./components/pages/Login";
import Signup from "./components/pages/Signup";
import KidsWear from "./components/pages/KidsWear";
import MensWear from "./components/pages/MensWear";
import Electronics from "./components/pages/Electonics";
import TrendingProduct from "./components/pages/TrendingProduct";
import BestSelling from "./components/pages/BestSelling";
import TopRated from "./components/pages/TopRated";
import Cart from "./components/pages/Cart";
import Checkout from "./components/pages/CheckOut"
import ProductDetail from "./components/pages/ProductDetail";
import SearchResults from "./components/pages/SearchResults/SearchResults";

import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminProducts from "./components/Admin/AdminProducts";
import AdminOrders from "./components/Admin/AdminOrders";
import AdminUsers from "./components/Admin/AdminUsers";
import AdminSettings from "./components/Admin/AdminSettings";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

import AOS from "aos";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MainLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
    <CartNotification />
  </div>
);

const AdminLayout = () => <AdminDashboard />;

const AppContent = () => {
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

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white font-sans min-h-screen">
      {isAdminRoute ? (
        <Routes>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={
                <div className="p-6 md:p-10">
                  <h1 className="text-4xl font-bold">Dashboard Overview</h1>
                </div>
              }
            />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>

        
      ) : (
        <MainLayout>
          <>
            <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
            <Routes>
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
                  </>
                }
              />

              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/search" element={<SearchResults />} /> {/* Add this route */}

              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              <Route path="/kidswear" element={<KidsWear />} />
              <Route path="/menswear" element={<MensWear />} />
              <Route path="/electronics" element={<Electronics />} />
              <Route path="/trendingproducts" element={<TrendingProduct />} />
              <Route path="/bestselling" element={<BestSelling />} />
              <Route path="/toprated" element={<TopRated />} />

              <Route path="/cart" element={<Cart />} />
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </>
        </MainLayout>
      )}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;