const express = require("express");
const { getDirectory, getResponder, createResponder, updateResponder } = require("../controllers/directory.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();
router.get("/", getDirectory);
router.get("/:id", getResponder);
router.post("/", protect, createResponder);
router.patch("/:id", protect, updateResponder);
module.exports = router;
