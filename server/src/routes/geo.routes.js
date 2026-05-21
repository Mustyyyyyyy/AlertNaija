const express = require("express");
const router = express.Router();

router.get("/lookup", (req, res) => {
  var { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ message: "lat and lng required" });
  var latf = parseFloat(lat), lngf = parseFloat(lng);
  var d = Math.sqrt(Math.pow(latf - 9.082, 2) + Math.pow(lngf - 7.396, 2));
  if (d < 0.5) return res.json({ state: "Abuja/FCT", approx: true });
  return res.json({ state: "Nigeria", approx: true });
});

module.exports = router;
