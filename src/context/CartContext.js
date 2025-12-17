import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (produit, quantite = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.produit_id === produit.id);
      if (existing) {
        return prevCart.map(item =>
          item.produit_id === produit.id
            ? { ...item, quantite: item.quantite + quantite }
            : item
        );
      }
      return [...prevCart, {
        produit_id: produit.id,
        nom: produit.nom,
        prix: produit.prix,
        quantite,
        unite: produit.unite
      }];
    });
  };

  const updateQuantity = (produitId, quantite) => {
    if (quantite <= 0) {
      removeFromCart(produitId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.produit_id === produitId ? { ...item, quantite } : item
      )
    );
  };

  const removeFromCart = (produitId) => {
    setCart(prevCart => prevCart.filter(item => item.produit_id !== produitId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.prix * item.quantite), 0);
  };

  const getItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantite, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getTotal,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
