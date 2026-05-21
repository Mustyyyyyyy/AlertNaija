const express = require("express");
const upload = require("../middleware/upload.middleware");
const uploadService = require("../services/upload.service");

const router = express.Router();

router.post("/image", upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No image uploaded" });
    const url = await uploadService.uploadImage(req.file);
    res.json({ success: true, url });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
