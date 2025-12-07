// server/src/controllers/reviewController.js
import Review from "../models/Review.js";
import Product from "../models/Product.js";

/**
 * @desc   Get all reviews for a product
 * @route  GET /api/products/:id/reviews
 * @access Public
 */
export const getReviewsByProduct = async (req, res) => {
  const { id: productId } = req.params;

  try {
    // Optional: check if product exists (can skip for performance)
    const productExists = await Product.exists({ _id: productId });
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    const reviews = await Review.find({ product: productId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    return res.status(500).json({
      message: "Failed to fetch reviews",
    });
  }
};

/**
 * @desc   Create a new review for a product
 * @route  POST /api/products/:id/reviews
 * @access Public
 */
export const createReview = async (req, res) => {
  const { id: productId } = req.params;
  const { authorName, rating, comment } = req.body;

  // Basic validation
  if (!authorName || !comment || typeof rating === "undefined") {
    return res.status(400).json({
      message: "authorName, rating and comment are required",
    });
  }

  try {
    // Ensure product exists
    const productExists = await Product.exists({ _id: productId });
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    const review = new Review({
      product: productId,
      authorName: authorName.trim(),
      rating,
      comment: comment.trim(),
    });

    const savedReview = await review.save();

    return res.status(201).json(savedReview);
  } catch (error) {
    console.error("Error creating review:", error.message);
    return res.status(500).json({
      message: "Failed to create review",
    });
  }
};
