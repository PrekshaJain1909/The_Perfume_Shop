// server/src/routes/reviewRoutes.js
import express from "express";
import {
  getReviewsByProduct,
  createReview,
} from "../controllers/reviewController.js";

const router = express.Router();

/**
 * Base path assumed: /api/reviews
 *
 * Endpoints:
 *   GET  /:productId      -> get all reviews for specific product
 *   POST /:productId      -> create a review for specific product
 */

// Get reviews for a product
router.get("/:productId", getReviewsByProduct);

// Add a new review for a product
router.post("/:productId", createReview);

export default router;
