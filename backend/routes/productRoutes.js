const express = require("express");
const {
  getAllProducts,
  getSingleProduct,
  createProduct
} = require("../controllers/productController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

// Admin route
router.post("/", protect, adminOnly, createProduct);

module.exports = router;
