const express = require("express");
const router = express.Router();
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly: admin } = require("../middleware/roleMiddleware");
const upload = require("../middleware/imageMiddleware");

router.route("/").get(getCategories).post(protect, admin,admin,upload.array("images", 5), createCategory);
router
    .route("/:id")
    .put(protect, admin, updateCategory)
    .delete(protect, admin, deleteCategory);

module.exports = router;
