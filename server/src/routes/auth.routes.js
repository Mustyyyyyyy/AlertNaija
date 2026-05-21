const express = require("express");
const { login, register, me, forgotPassword, resetPassword, updateProfile } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", protect, me);
router.patch("/profile", protect, updateProfile);
module.exports = router;
