import { createContext, useContext, useEffect, useState } from "react";
import * as wishlistApi from "../api/wishlistApi";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";

const WishlistContext = createContext();
const W_KEY = "perfume_wishlist_v1";

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const { addToCart: cartAddToCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // load from localStorage first
  useEffect(() => {
    try {
      const saved = localStorage.getItem(W_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch (e) {}
  }, []);

  // when login state changes, if user is logged in, fetch server wishlist and merge
  useEffect(() => {
    const sync = async () => {
      if (user && user.email) {
        setLoading(true);
        try {
          const serverItems = await wishlistApi.getWishlist();
          // serverItems is array of { productId, addedAt }
          const serverProductIds = serverItems.map((i) => String(i.productId));
          const localProductIds = items.map((i) => String(i));
          // merge: union
          const union = Array.from(new Set([...localProductIds, ...serverProductIds]));
          setItems(union);
          // ensure server has all local items
          for (const pid of localProductIds) {
            if (!serverProductIds.includes(pid)) {
              try { await wishlistApi.addToWishlist(pid); } catch (e) {}
            }
          }
        } catch (e) {
          console.warn("Failed to sync wishlist", e);
        } finally {
          setLoading(false);
        }
      }
    };
    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // save to localStorage on change
  useEffect(() => {
    try { localStorage.setItem(W_KEY, JSON.stringify(items)); } catch (e) {}
  }, [items]);

  const add = async (productId) => {
    const pid = String(productId);
    if (items.includes(pid)) return;
    setItems((s) => [...s, pid]);
    if (user) {
      try { await wishlistApi.addToWishlist(pid); } catch (e) { console.warn(e); }
    }
  };

  const remove = async (productId) => {
    const pid = String(productId);
    setItems((s) => s.filter((x) => x !== pid));
    if (user) {
      try { await wishlistApi.removeFromWishlist(pid); } catch (e) { console.warn(e); }
    }
  };

  const toggle = async (productId) => {
    const pid = String(productId);
    if (items.includes(pid)) await remove(pid); else await add(pid);
  };

  // Move a wishlist product into the cart (atomic helper exposed to UI)
  const moveToCart = async (product) => {
    if (!product) return;
    const pid = String(product._id || product.id || product.productId || "");
    try {
      // Add to cart first (local optimistic)
      cartAddToCart(product, { qty: 1 });
    } catch (e) {
      console.error("Failed to add to cart in moveToCart", e);
    }
    // remove from wishlist (best-effort)
    try {
      await remove(pid);
    } catch (e) {
      console.warn("Failed to remove wishlist item after moveToCart", e);
    }
  };

  return (
    <WishlistContext.Provider value={{ items, loading, add, remove, toggle, moveToCart }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
