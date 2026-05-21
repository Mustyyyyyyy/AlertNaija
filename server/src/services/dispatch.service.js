const prisma = require("../config/db");
const responderService = require("./responder.service");

exports.dispatchToClosestResponder = async (req, res, next) => {
  try {
    const { incidentId, type, lat, lng } = req.body;

    if (!lat || !lng) return res.status(400).json({ success: false, message: "lat and lng are required" });

    const incident = await prisma.incident.findUnique({
      where: { id: incidentId },
      include: { user: { select: { state: true } }, responder: true },
    });

    if (!incident) return res.status(404).json({ success: false, message: "Incident not found" });

    const best = await responderService.findBestResponder(lat, lng, type);
    if (!best) return res.status(404).json({ success: false, message: "No available responders" });

    const updated = await responderService.assignResponder(incident.id, best.id);

    require("../config/socket").getIO().to("command-center").emit("incidentAssigned", updated);

    res.json({ success: true, incident: updated, responderAssigned: best });
  } catch (error) {
    next(error);
  }
};
