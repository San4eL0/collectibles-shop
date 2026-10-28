import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product) => {
    setItems((prev) => {
      const exist = prev.find((i) => i.id === product.id);
      if (exist) return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const updateQuantity = (id, q) => q < 1 ? removeItem(id) : setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity: q } : i));
  const clearCart = () => setItems([]);

  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalPrice, totalCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);