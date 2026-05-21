const express = require("express");
const { verifyIncident } = require("../controllers/verification.controller");
const { protect } = require("../middleware/auth.middleware");
const router = express.Router();
router.patch("/incidents/:id/verify", protect, verifyIncident);
module.exports = router;
