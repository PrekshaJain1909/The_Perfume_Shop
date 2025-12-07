import Order from "../models/Order.js";
import stream from "stream";
import mongoose from "mongoose";

const bufferFromStream = (readable) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    readable.on("data", (c) => chunks.push(c));
    readable.on("end", () => resolve(Buffer.concat(chunks)));
    readable.on("error", reject);
  });

const generateReceiptPdf = async (order) => {
  // Lazy-load pdfkit so missing package doesn't crash the entire server at import time
  let PDFDocument;
  try {
    const mod = await import("pdfkit");
    PDFDocument = mod.default || mod;
  } catch (err) {
    console.error("pdfkit not available. Install with 'npm install pdfkit' to enable PDF receipts.");
    // Fallback: return a simple text buffer as a minimal receipt
    const lines = [];
    lines.push("Perfume Shop - Receipt");
    lines.push(`Order ID: ${order._id}`);
    lines.push(`Date: ${order.createdAt.toLocaleString()}`);
    lines.push(`Customer: ${order.customer.name} <${order.customer.email}>`);
    lines.push("Items:");
    order.items.forEach((it) => {
      lines.push(`- ${it.name} ${it.size ? `(${it.size})` : ""} x${it.qty} @ ₹${it.price.toFixed(2)} = ₹${(it.qty * it.price).toFixed(2)}`);
    });
    lines.push(`Subtotal: ₹${order.subtotal.toFixed(2)}`);
    return Buffer.from(lines.join("\n"), "utf8");
  }

  const doc = new PDFDocument({ size: "A4", margin: 40 });
  const passthrough = new stream.PassThrough();
  doc.pipe(passthrough);

  doc.fontSize(18).text("Perfume Shop", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(12).text(`Order ID: ${order._id}`);
  doc.text(`Date: ${order.createdAt.toLocaleString()}`);
  doc.moveDown(0.5);

  doc.text(`Customer: ${order.customer.name}`);
  doc.text(`Email: ${order.customer.email}`);
  doc.moveDown(0.5);

  doc.text("Items:");
  doc.moveDown(0.2);

  order.items.forEach((it) => {
    doc.text(`${it.name} ${it.size ? `(${it.size})` : ""}`);
    doc.text(`  Qty: ${it.qty}  Price: ₹${it.price.toFixed(2)}  Total: ₹${(it.qty * it.price).toFixed(2)}`);
    doc.moveDown(0.2);
  });

  doc.moveDown(0.5);
  doc.text(`Subtotal: ₹${order.subtotal.toFixed(2)}`);

  doc.end();

  const buffer = await bufferFromStream(passthrough);
  return buffer;
};

// Sends email using SMTP details in env; returns true if sent, false otherwise
const trySendEmail = async (to, subject, text, attachments = []) => {
  const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, MAIL_FROM } = process.env;
  if (!MAIL_HOST || !MAIL_PORT || !MAIL_USER || !MAIL_PASS) return false;

  // Lazy-load nodemailer to avoid startup crashes when it's not installed
  let nodemailer;
  try {
    const mod = await import("nodemailer");
    nodemailer = mod.default || mod;
  } catch (err) {
    console.error("nodemailer not available. Install with 'npm install nodemailer' to enable email sending.");
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: Number(MAIL_PORT),
    secure: Number(MAIL_PORT) === 465, // true for 465, false for other ports
    auth: { user: MAIL_USER, pass: MAIL_PASS },
  });

  await transporter.sendMail({
    from: MAIL_FROM || MAIL_USER,
    to,
    subject,
    text,
    attachments,
  });
  return true;
};

export const createOrder = async (req, res) => {
  try {
    const { customer, items, subtotal } = req.body;
    if (!customer || !items || !items.length) {
      return res.status(400).json({ message: "Invalid order payload" });
    }

    // Normalize item.productId: convert valid ObjectId strings into ObjectId instances,
    // otherwise keep the original value (e.g. legacy IDs like "1").
    const normalizedItems = items.map((it) => {
      const pid = it.productId;
      if (pid && typeof pid === "string" && mongoose.Types.ObjectId.isValid(pid)) {
        return { ...it, productId: mongoose.Types.ObjectId(pid) };
      }
      return it;
    });

    // associate with authenticated user when available
    const orderData = { customer, items: normalizedItems, subtotal };
    if (req.user && req.user._id) orderData.userId = req.user._id;

    const order = new Order(orderData);
    const saved = await order.save();

    // Generate PDF receipt
    const pdfBuffer = await generateReceiptPdf(saved);

    // Try to email the receipt
    let emailed = false;
    try {
      emailed = await trySendEmail(
        customer.email,
        `Your order ${saved._id} - Perfume Shop`,
        `Thanks for your order. Order ID: ${saved._id}`,
        [
          {
            filename: `receipt_${saved._id}.pdf`,
            content: pdfBuffer,
          },
        ]
      );
    } catch (err) {
      console.error("Email send failed:", err.message);
      emailed = false;
    }

    // If we couldn't email, return the PDF as base64 to allow client download
    const pdfBase64 = emailed ? null : pdfBuffer.toString("base64");

    return res.status(201).json({
      orderId: saved._id,
      emailed,
      pdfBase64,
      order: saved,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    // In development return the stack to aid debugging
    return res.status(500).json({ message: error.message || "Failed to create order", stack: error.stack });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).lean();
    if (!order) return res.status(404).json({ message: "Order not found" });

    // ensure the requesting user owns this order
    if (req.user && order.userId) {
      const uid = String(req.user._id);
      if (String(order.userId) !== uid) return res.status(403).json({ message: "Forbidden" });
    }

    return res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const { email } = req.query;

    // If an email query param is provided, allow fetching orders by customer email (guest lookup)
    if (email) {
      const orders = await Order.find({ "customer.email": String(email) }).sort({ createdAt: -1 }).lean();
      return res.json(orders);
    }

    // Otherwise require authentication and return only orders for the authenticated user
    const userId = req.user && req.user._id;
    if (!userId) return res.status(401).json({ message: "Not authorized" });
    const orders = await Order.find({ userId }).sort({ createdAt: -1 }).lean();

    return res.json(orders);
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
