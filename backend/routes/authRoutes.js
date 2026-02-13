const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

const { adminOnly } = require("../middleware/roleMiddleware");

router.get("/admin-test", protect, adminOnly, (req, res) => {
  res.json({ message: "Welcome Admin" });
});

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
