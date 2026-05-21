const express = require("express");
const adminDashboardRouter = require("./dashboard.routes");
const { protectAdmin } = require("../../middleware/admin.middleware");

const router = express.Router();

router.use("/dashboard", protectAdmin, adminDashboardRouter);

module.exports = router;