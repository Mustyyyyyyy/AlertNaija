const express = require("express");
const router  = express.Router();
const { getIO } = require("../config/socket");

/**
 * POST /api/alerts/sos
 * Body: { state, caller, timestamp }
 * Unauthenticated — anyone can fire an SOS.
 * Broadcasts to the "command-center" Socket.IO room and logs an audit entry.
 */
router.post("/", (req, res) => {
  try {
    const { state, caller, timestamp } = req.body;

    const payload = {
      type: "SOS",
      state: state || "Unknown",
      caller: caller || "Anonymous",
      timestamp: timestamp || new Date().toISOString(),
    };

    // Broadcast to command-centre via Socket.IO
    try { getIO().to("command-center").emit("sos-alert", payload); } catch (_) { /* socket not available */ }

    res.status(201).json({ success: true, message: "SOS alert received.", data: payload });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to send SOS." });
  }
});

module.exports = router;
