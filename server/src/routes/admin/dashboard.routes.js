const express = require("express");
const {
  getAdminDashboardStats,
  getAllUsers,
  getAllResponders,
  updateResponderAvailability,
  deleteUser,
  deleteResponder,
} = require("../../controllers/admin/dashboard.controller");
const { protect } = require("../../middleware/auth.middleware");

const router = express.Router();

router.get("/dashboard/stats", protect, getAdminDashboardStats);
router.get("/users", protect, getAllUsers);
router.get("/responders", protect, getAllResponders);
router.patch("/responders/:id/availability", protect, updateResponderAvailability);
router.delete("/users/:id", protect, deleteUser);
router.delete("/responders/:id", protect, deleteResponder);

module.exports = router;