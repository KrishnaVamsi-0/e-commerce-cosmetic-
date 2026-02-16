const express = require("express");
const { registerUser, loginUser, refreshToken } = require("../controllers/authController");

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
router.post("/refresh-token", refreshToken);


module.exports = router;
