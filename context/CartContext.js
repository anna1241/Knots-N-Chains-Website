// context/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const userId = 'user-id';  // Get this from logged-in user data

  // Fetch cart from backend
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cart/${userId}`);
        setCart(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCart();
  }, [userId]);

  // Add product to cart
  const addToCart = async (productId, quantity, color) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/cart/${userId}`, {
        productId,
        quantity,
        color,
      });
      setCart(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};
