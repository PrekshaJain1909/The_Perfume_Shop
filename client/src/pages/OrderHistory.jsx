import { useState, useEffect } from "react";
import { getOrdersByEmail } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";
import "./OrderHistory.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
const OrderHistory = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await getOrdersByEmail(email);
      setOrders(data);
    } catch (err) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const { user } = useAuth();

  useEffect(() => {
    // If user is logged in, auto-load their orders. Otherwise, try last email (legacy behavior).
    (async () => {
      try {
        const last = localStorage.getItem("perfume_last_order_email");
        const target = user?.email || last || "";
        if (target) {
          setEmail(target);
          setLoading(true);
          const data = await getOrdersByEmail(target);
          setOrders(data);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
    <Navbar />
    <div className="order-history-root">
      <h2>Order History</h2>
      <p>Enter the email used for the order to see previous purchases.</p>
      <div className="oh-form">
        <input
          type="email"
          placeholder="you@example.com (leave empty to show all orders)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={fetchOrders} disabled={loading}>
          {loading ? "Loading..." : "Fetch Orders"}
        </button>
      </div>

      {error && <div className="oh-error">{error}</div>}

      <div className="oh-list">
        {orders.length === 0 && !loading && <div>No orders found.</div>}
        {orders.map((o) => (
          <div key={o._id} className="oh-card">
            <div className="oh-row">
              <strong>Order ID:</strong> <span>{o._id}</span>
            </div>
            <div className="oh-row">
              <strong>Date:</strong> <span>{new Date(o.createdAt).toLocaleString()}</span>
            </div>
            <div className="oh-row">
              <strong>Subtotal:</strong> <span>₹{o.subtotal.toFixed(2)}</span>
            </div>
            <div className="oh-row">
              <strong>Status:</strong> <span>{o.status}</span>
            </div>
            <details className="oh-items">
              <summary>Items ({o.items.length})</summary>
              <ul>
                {o.items.map((it, idx) => (
                  <li key={idx}>
                    {it.name} {it.size ? `(${it.size})` : ""} — Qty: {it.qty} — ₹{it.price.toFixed(2)}
                  </li>
                ))}
              </ul>
            </details>
          </div>
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default OrderHistory;
