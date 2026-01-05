import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Restore user from localStorage on app load/refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // Helper function to clear user-specific cart
  const clearUserCart = () => {
    if (user) {
      // Clear user-specific cart from localStorage
      const userCartKey = `cart_${user.email || user.id}`;
      localStorage.removeItem(userCartKey);
      
      // Dispatch storage event to notify other tabs/components
      window.dispatchEvent(new Event("storage"));
    }
  };

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    
    // Notify about storage change
    window.dispatchEvent(new Event("storage"));
  };

  const logout = () => {
    // Clear user-specific cart before logging out
    if (user) {
      const userCartKey = `cart_${user.email || user.id}`;
      localStorage.removeItem(userCartKey);
    }
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    
    // Notify about storage change (important!)
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        isAuthenticated, 
        isLoading, 
        login, 
        logout,
        clearUserCart
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);