const express = require("express");
const {
  getAdminDashboardStats,
  getAllUsers,
  getAllResponders,
  updateResponderAvailability,
} = require("../../controllers/admin/dashboard.controller");
const { protect } = require("../../middleware/auth.middleware");

const router = express.Router();

router.get("/dashboard/stats", protect, getAdminDashboardStats);
router.get("/users", protect, getAllUsers);
router.get("/responders", protect, getAllResponders);
router.patch("/responders/:id/availability", protect, updateResponderAvailability);

module.exports = router;