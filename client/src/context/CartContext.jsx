import { createContext, useContext, useEffect, useMemo, useState, useRef } from "react";

const CartContext = createContext();

// Key used in localStorage so cart is saved even after refresh
const CART_KEY = "perfume_cart_v1";

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Failed to parse cart from storage:", err);
      return [];
    }
  });

  const initializedRef = useRef(false);

  // mark that initial mount has completed so save effect can run afterwards
  useEffect(() => {
    initializedRef.current = true;
  }, []);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    // avoid overwriting storage on mount before initial load completes
    if (!initializedRef.current) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (err) {
      console.error("Failed to save cart:", err);
    }
  }, [items]);


  // Add item to cart
  const addToCart = (product, { size, qty = 1 } = {}) => {
    // normalize id: support both Mongo `_id` and legacy `id`
    const productId = product?._id || product?.id;
    if (!productId) return;

    setItems((prev) => {
      const index = prev.findIndex((item) => item.productId === productId && item.size === size);

      // If item (same product + size) already exists, increase qty
      if (index !== -1) {
        const copy = [...prev];
        copy[index] = { ...copy[index], qty: copy[index].qty + qty };
        return copy;
      }

      // Otherwise, add new item
      return [
        ...prev,
        {
          productId,
          name: product.name,
          price: product.price,
          size: size || null,
          image: product.images?.[0],
          qty,
        },
      ];
    });
  };

  // Update quantity of an item in cart
  const updateQty = (productId, size, qty) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.size === size
          ? { ...item, qty }
          : item
      )
    );
  };

  // Remove item completely
  const removeFromCart = (productId, size) => {
    setItems((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.size === size)
      )
    );
  };

  // Clear all items
  const clearCart = () => setItems([]);

  // Totals (derived values)
  const totals = useMemo(() => {
    const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
    const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
    return { itemCount, subtotal };
  }, [items]);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    ...totals, // itemCount + subtotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook for easy usage in components
export const useCart = () => useContext(CartContext);
