const express = require("express");
const { createIncident, getIncidents, getIncident, updateIncident, verifyIncident } = require("../controllers/incident.controller");
const { protect } = require("../middleware/auth.middleware");
const { incidentLimiter } = require("../middleware/rate-limit.middleware");

const router = express.Router();
router.post("/", protect, incidentLimiter, createIncident);
router.get("/", getIncidents);
router.get("/:id", getIncident);
router.patch("/:id", protect, updateIncident);
router.patch("/:id/verify", protect, verifyIncident);
module.exports = router;
