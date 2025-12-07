import mongoose from "mongoose";

const wishlistItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.Mixed, required: true },
  addedAt: { type: Date, default: Date.now },
});

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: { type: [wishlistItemSchema], default: [] },
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
export default Wishlist;
