import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import "./CartPage.css";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { fetchProductById } from "../api/productApi";
import { useEffect, useState } from "react";

const CartPage = () => {
  const {
    items,
    subtotal,
    itemCount,
    updateQty,
    removeFromCart,
    clearCart,
  } = useCart();

  const navigate = useNavigate();
  const { items: wishItems, remove: removeFromWishlist, moveToCart } =
    useWishlist();
  const [wishlistDetails, setWishlistDetails] = useState([]);

  // load product details for wishlist items (exclude ones already in cart)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const pids = wishItems || [];
        // filter out any pids that are already present in cart
        const filtered = pids.filter(
          (pid) =>
            !items.some((it) => String(it.productId) === String(pid))
        );
        // clear previous details immediately to avoid flicker with stale items
        if (mounted) setWishlistDetails([]);
        const details = [];
        for (const pid of filtered) {
          try {
            const p = await fetchProductById(pid);
            details.push(p);
          } catch (e) {
            details.push({
              _id: pid,
              name: "Product",
              price: 0,
              images: [],
            });
          }
        }
        if (mounted) setWishlistDetails(details);
      } catch (e) {
        console.error("Failed to load wishlist product details", e);
      }
    };
    load();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wishItems, items]);

  const handleCheckout = () => {
    // navigate to the checkout page where payment is simulated
    navigate("/checkout");
  };

  return (
    <>
      <Navbar />
      <main className="cart-main">
        {/* SECTION 1: YOUR CART */}
        <section className="cart-section">
          <h1 className="cart-title">Your Cart</h1>

          {items.length === 0 ? (
            <p className="cart-empty">
              Your bag is empty. Add some fragrances ✨
            </p>
          ) : (
            <>
              {/* Cart items */}
              <section className="cart-items">
                {items.map((item) => (
                  <article
                    key={`${item.productId}-${item.size || "nosize"}`}
                    className="cart-item"
                  >
                    <div className="cart-item-left">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="cart-item-image"
                      />
                      <div>
                        <h2 className="cart-item-name">{item.name}</h2>
                        {item.size && (
                          <p className="cart-item-detail">
                            Size: {item.size}
                          </p>
                        )}
                        <p className="cart-item-detail">
                          Price: ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="cart-item-right">
                      <div className="cart-qty-wrapper">
                        <button
                          type="button"
                          onClick={() =>
                            updateQty(
                              item.productId,
                              item.size,
                              item.qty - 1
                            )
                          }
                        >
                          −
                        </button>
                        <span>{item.qty}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQty(
                              item.productId,
                              item.size,
                              item.qty + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>

                      <div className="cart-item-total">
                        ₹{(item.qty * item.price).toFixed(2)}
                      </div>

                      <button
                        type="button"
                        className="cart-remove-btn"
                        onClick={() =>
                          removeFromCart(item.productId, item.size)
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}

                <button
                  type="button"
                  className="cart-clear-btn"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
              </section>

              {/* Order summary */}
              <aside className="cart-summary">
                <h2>Order Summary</h2>
                <div className="cart-summary-row">
                  <span>Items</span>
                  <span>{itemCount}</span>
                </div>
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {/* You can add tax / shipping here */}
                <button
                  type="button"
                  className="cart-checkout-btn"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
              </aside>
            </>
          )}
        </section>

        {/* SECTION 2: YOUR WISHLIST */}
        <section className="cart-section">
          <h1 className="cart-title">Your Wishlist</h1>

          {wishlistDetails.length === 0 ? (
            <p className="cart-empty">
              Your bag is empty. Add some fragrances ✨
            </p>
          ) : (
            wishlistDetails.map((p) => (
              <article
                key={p._id}
                className="cart-item cart-wishlist-item"
              >
                <div className="cart-item-left">
                  <img
                    src={p.images?.[0]}
                    alt={p.name}
                    className="cart-item-image"
                  />
                  <div>
                    <h2 className="cart-item-name">{p.name}</h2>
                    <p className="cart-item-detail">
                      Price: ₹{(p.price || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="cart-item-right">
                  <button
                    type="button"
                    className="wishlist-move-btn"
                    onClick={async () => {
                      try {
                        if (typeof moveToCart === "function") {
                          await moveToCart(p);
                        } else {
                          // fallback: directly add to cart then remove from wishlist
                          try {
                            // add to cart via useCart (we don't have addToCart here),
                            // so call removeFromWishlist to at least remove the item
                            await removeFromWishlist(p._id);
                          } catch (e) {
                            console.warn("Fallback moveToCart: remove failed", e);
                          }
                        }
                      } catch (e) {
                        console.error("Failed to move wishlist item to cart", e);
                      }
                    }}
                  >
                    Move to Cart
                  </button>

                  <button
                    type="button"
                    className="cart-remove-btn"
                    onClick={() => removeFromWishlist(p._id)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CartPage;
