import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./OrderSuccessPage.css";
const OrderSuccess = () => {
  const { state } = useLocation();
  const orderId = state?.orderId || "(not available)";
  const subtotal = state?.subtotal ?? 0;
  const itemCount = state?.itemCount ?? 0;
  const items = state?.items || [];
  const customer = state?.customer || {};

  const downloadReceipt = async () => {
    try {
      // lazy-load jspdf to avoid Vite optimizeDeps prebundle issues
      const mod = await import("jspdf");
      const { jsPDF } = mod;
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Perfume Shop - Receipt", 14, 20);

      doc.setFontSize(12);
      let y = 32;
      doc.text(`Order ID: ${orderId}`, 14, y);
      y += 7;
      doc.text(`Date: ${new Date().toLocaleString()}`, 14, y);
      y += 7;
      if (customer?.name) {
        doc.text(`Customer: ${customer.name}`, 14, y);
        y += 7;
      }
      if (customer?.email) {
        doc.text(`Email: ${customer.email}`, 14, y);
        y += 7;
      }

      y += 4;
      doc.text(`Items (${itemCount})`, 14, y);
      y += 7;

      items.forEach((it) => {
        const line = `${it.name} ${it.size ? `(${it.size})` : ""} x${it.qty} @ ₹${it.price.toFixed(2)} = ₹${(
          it.qty * it.price
        ).toFixed(2)}`;
        // wrap long lines
        const split = doc.splitTextToSize(line, 180);
        doc.text(split, 14, y);
        y += split.length * 7;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });

      y += 6;
      doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, 14, y);

      doc.save(`receipt_${orderId}.pdf`);
    } catch (err) {
      // fallback: create a simple text blob
      const content = `Order ID: ${orderId}\nDate: ${new Date().toLocaleString()}\nItems: ${itemCount}\nTotal: ₹${subtotal.toFixed(2)}`;
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt_${orderId}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  useEffect(() => {
    // auto-download when visiting success page
    if (orderId && items.length > 0) {
      // small delay to ensure page renders before download starts
      setTimeout(() => downloadReceipt(), 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Navbar />
      <main className="order-success-container">
  <h1 className="order-success-title">Thank you for your order 🎉</h1>

  <p className="order-success-details">
    Your order ID: <strong>{orderId}</strong>
  </p>
  <p className="order-success-details">
    Items: {itemCount} • Total paid: ₹{subtotal.toFixed(2)}
  </p>
  <p className="order-success-customer">{customer?.name || ""}</p>

  <p className="order-success-message">
    You will receive an email confirmation shortly. Meanwhile, you can
    continue shopping and explore our latest fragrances.
  </p>

  <div className="order-success-actions">
    <button onClick={downloadReceipt} className="order-success-download">
      Download Receipt
    </button>

    <Link to="/" className="order-success-home">
      Back to Home
    </Link>
  </div>
</main>

      <Footer />
    </>
  );
};

export default OrderSuccess;


