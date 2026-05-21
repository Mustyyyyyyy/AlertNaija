const express = require("express");
const adminDashboardRouter = require("./dashboard.routes");

const router = express.Router();

// All admin routes require admin authentication
router.use("/dashboard", require("../../middleware/admin.middleware"), adminDashboardRouter);

module.exports = router;