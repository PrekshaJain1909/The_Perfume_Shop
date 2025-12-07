// server/src/controllers/productController.js
import Product from "../models/Product.js";

/**
 * @desc   Get all products
 * @route  GET /api/products
 * @access Public
 */
export const getProducts = async (req, res) => {
  try {
    // You can add filters / pagination later if needed
    const products = await Product.find().sort({ createdAt: -1 });

    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};

/**
 * @desc   Get single product by ID
 * @route  GET /api/products/:id
 * @access Public
 */
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error.message);

    // If invalid ObjectId or other error
    return res.status(500).json({
      message: "Failed to fetch product",
    });
  }
};
