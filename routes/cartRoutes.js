const express = require("express");
const router = express.Router();
const {
    getCart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(protect, getCart).post(protect, addToCart);
router.route("/:productId").delete(protect, removeFromCart).put(protect, updateCartItemQuantity);

module.exports = router;
