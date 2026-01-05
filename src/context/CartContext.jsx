import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // 🔹 Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCartItems(parsedCart);
      setCartCount(
        parsedCart.reduce((sum, item) => sum + item.quantity, 0)
      );
    }
  }, []);

  // 🔹 Save cart to localStorage on update
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    const totalCount = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    setCartCount(totalCount);
  }, [cartItems]);

  // 🔹 Add to cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });

    setNotificationCount((prev) => prev + 1);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  // 🔹 Remove item
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  // 🔹 Update quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // 🔹 CLEAR CART (USE ON LOGOUT)
  const clearCart = () => {
    setCartItems([]);
    setCartCount(0);
    setNotificationCount(0);
    setShowNotification(false);
    localStorage.removeItem("cart");
  };

  // 🔹 Total price
  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
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
        clearCart, // 👈 call this on logout
        getTotalPrice,
        showNotification,
        notificationCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
