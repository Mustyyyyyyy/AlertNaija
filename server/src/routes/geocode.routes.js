const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ message: "lat and lng required" });

  const distance = Math.sqrt(Math.pow(parseFloat(lat) - 9.082, 2) + Math.pow(parseFloat(lng) - 7.396, 2));
  if (distance < 0.8) return res.json({ state: "FCT", approx: true });
  return res.json({ state: "Nigeria", approx: true });
});

module.exports = router;
