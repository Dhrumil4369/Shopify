import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [authToken, setAuthToken] = useState(localStorage.getItem("token"));

  // Listen for storage changes (like logout/login)
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      if (newToken !== authToken) {
        setAuthToken(newToken);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [authToken]);

  // Get current user from localStorage (if any)
  const getCurrentUser = () => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  };

  // Generate unique cart key based on user or guest
  const getCartKey = () => {
    const user = getCurrentUser();
    const token = localStorage.getItem("token");
    
    if (token && user) {
      return `cart_${user.email || user.id}`; // User-specific cart
    }
    return "cart_guest"; // Guest cart
  };

  // 🔹 Load cart from localStorage based on user - THIS IS THE KEY FIX
  useEffect(() => {
    const cartKey = getCartKey();
    const savedCart = localStorage.getItem(cartKey);
    
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        localStorage.removeItem(cartKey);
      }
    } else {
      setCartItems([]);
    }
  }, [authToken]); // Reload cart when auth token changes

  // 🔹 Update cartCount and save to localStorage
  useEffect(() => {
    const totalQty = cartItems.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
    setCartCount(totalQty);
    
    // Save to localStorage with appropriate key
    const cartKey = getCartKey();
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, authToken]); // Also depend on authToken

  // 🔹 Add to cart
  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 0) + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // 🔹 Remove item
  const removeFromCart = (id) => {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // 🔹 Update quantity
  const updateQuantity = (id, qty) => {
    if (qty < 1) {
      removeFromCart(id);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: qty } : item
      )
    );
  };

  // 🔥 CLEAR CART
  const clearCart = () => {
    setCartItems([]);
    const cartKey = getCartKey();
    localStorage.removeItem(cartKey);
  };

  // 🔹 Clear cart for specific user (called on logout)
  const clearUserCart = (userEmailOrId) => {
    if (userEmailOrId) {
      localStorage.removeItem(`cart_${userEmailOrId}`);
    }
    setCartItems([]); // Clear current cart state
  };

  // 🔹 Total price
  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 0),
      0
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        clearUserCart,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};