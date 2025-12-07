import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  // Accept either a Mongo ObjectId or a plain string/product code.
  // Use Mixed so legacy non-ObjectId product IDs (e.g. "1") won't fail validation.
  productId: { type: mongoose.Schema.Types.Mixed, required: false },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  qty: { type: Number, required: true },
  size: { type: String },
  image: { type: String },
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
    },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    status: { type: String, default: "placed" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
