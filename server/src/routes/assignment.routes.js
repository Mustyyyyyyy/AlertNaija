const express = require("express");
const { assignResponder } = require("../controllers/assignment.controller");
const { protect } = require("../middleware/auth.middleware");
const router = express.Router();
router.patch("/:id/assign", protect, assignResponder);
module.exports = router;
