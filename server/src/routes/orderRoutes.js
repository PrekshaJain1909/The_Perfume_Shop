import express from "express";
import { createOrder, getOrderById, getOrders } from "../controllers/orderController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// All order routes require authentication to ensure users see only their own orders
router.get("/", requireAuth, getOrders);

// POST /api/orders
// Allow guest checkout: creating an order does not require authentication.
router.post("/", createOrder);

// GET /api/orders/:id
router.get("/:id", requireAuth, getOrderById);

export default router;
