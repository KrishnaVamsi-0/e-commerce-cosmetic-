const express = require("express");
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly: admin } = require("../middleware/roleMiddleware");
const upload = require("../middleware/imageMiddleware"); 

router.route("/").get(getProducts).post(protect, admin,upload.array("images", 5), createProduct);
router
    .route("/:id")
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin,upload.array("images", 5), deleteProduct);

module.exports = router;