const express = require("express");
const { getAnalytics } = require("../controllers/analytics.controller");
const router = express.Router();
router.get("/", getAnalytics);
module.exports = router;
