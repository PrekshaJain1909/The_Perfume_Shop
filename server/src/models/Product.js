// server/src/models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },

    fullDescription: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    sizes: {
      type: [String], // e.g. ["30ml", "50ml", "100ml"]
      default: [],
    },

    images: {
      type: [String], // array of image URLs
      required: true,
    },
    exclusive :{
    type: Boolean,
    default: false,
  },
    trending :{
    type: Boolean,
    default: false,   }
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  },

);

const Product = mongoose.model("Product", productSchema);
export default Product;
