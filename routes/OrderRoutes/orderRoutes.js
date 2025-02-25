const express = require("express");
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../../Controllers/orderController");
const { protect } = require("../../middleware/authmiddleware");


const router = express.Router();

// Define order-related routes
router.get("/", protect, getOrders); 
router.get("/:id", protect, getOrderById);
router.post("/", protect, createOrder);
router.put("/:id", protect, updateOrder);
router.delete("/:id", protect, deleteOrder);

module.exports = router;
