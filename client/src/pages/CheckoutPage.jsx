import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../api/orderApi";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import "./CartPage.css";
import { useAuth } from "../context/AuthContext";

const CheckoutPage = () => {
  const { items, subtotal, itemCount, clearCart } = useCart();
  const navigate = useNavigate();

  const { user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  // 🔴 was: const handlePay = (e) => {
  const handlePay = async (e) => {   // ✅ make this async
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !address.trim()) {
      setError("Please fill name, email and address to proceed.");
      return;
    }

    setProcessing(true);

    const payload = {
      customer: { name: name.trim(), email: email.trim(), address: address.trim() },
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        qty: i.qty,
        size: i.size,
        image: i.image,
      })),
      subtotal,
    };

    try {
      const res = await createOrder(payload);

      // if server returned a pdfBase64 (no email configured), trigger download
      if (res?.pdfBase64) {
        const link = document.createElement("a");
        const byteCharacters = atob(res.pdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `receipt_${res.orderId}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      }

      // clear cart after successful order
      clearCart();
      // persist the email so Order History can auto-load for this user
      try {
        localStorage.setItem("perfume_last_order_email", payload.customer.email);
      } catch (e) {
        console.warn("Could not persist last order email", e);
      }
      setProcessing(false);
      Swal.fire({
        icon: "success",
        title: "Order placed",
        text: "Thank you for your purchase.",
      });
      navigate("/order-success", {
        state: {
          orderId: res.orderId,
          subtotal,
          itemCount,
          items: payload.items,
          customer: payload.customer,
        },
      });
    } catch (err) {
      console.error("Order failed:", err);
      setProcessing(false);
      Swal.fire({
        icon: "error",
        title: "Order failed",
        text: err.message || "Unable to place order.",
      });
    }
  };

  useEffect(() => {
    // If user is logged in prefill name/email
    if (user) {
      setName((n) => n || user.name || "");
      setEmail((e) => e || user.email || "");
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <main className="cart-main">
        <div className="checkout-header">
          <h1 className="cart-title">Checkout</h1>
          <div className="checkout-steps">
            <span className="step completed">Cart</span>
            <span className="step current">Payment</span>
            <span className="step">Confirmation</span>
          </div>
        </div>

        {items.length === 0 ? (
          <p className="cart-empty">Your bag is empty. Add some fragrances ✨</p>
        ) : (
          <div className="checkout-vertical">
            <section className="cart-items checkout-items">
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
                        <p className="cart-item-detail">Size: {item.size}</p>
                      )}
                      <p className="cart-item-detail">
                        Price: ₹{item.price.toFixed(2)}
                      </p>
                      <p className="cart-item-detail">Qty: {item.qty}</p>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <section className="cart-summary checkout-summary">
              <h2>Payment</h2>

              <div className="cart-summary-row">
                <span>Items</span>
                <span>{itemCount}</span>
              </div>
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <form onSubmit={handlePay} style={{ marginTop: 12 }}>
                <fieldset disabled={processing} className="checkout-fieldset">
                <label className="checkout-label">
                  Full name
                  <input
                    className="checkout-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </label>

                <label className="checkout-label">
                  Email
                  <input
                    className="checkout-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>

                <label className="checkout-label">
                  Shipping address
                  <textarea
                    className="checkout-textarea"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </label>

                <label className="checkout-label">
                  Card (test)
                  <input className="checkout-input" type="text" placeholder="4242 4242 4242 4242" />
                </label>
                {error && <p className="checkout-error">{error}</p>}

                <button
                  type="submit"
                  className="cart-checkout-btn checkout-pay-btn"
                  disabled={processing}
                >
                  {processing ? "Processing…" : `Pay ₹${subtotal.toFixed(2)}`}
                </button>
                </fieldset>
              </form>
            </section>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default CheckoutPage;
