const prisma = require("../config/db");
const { getIO } = require("../config/socket");

exports.createIncident = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const { type, description, lat, lng, imageUrl = null } = req.body;

    // Auto-Routing: High-risk types get CRITICAL priority immediately
    let priority = "NORMAL";
    if (["BANDITS", "SECURITY", "FIRE"].includes(type)) {
      priority = "CRITICAL";
    }

    const incident = await prisma.incident.create({
      data: { 
        type, 
        description, 
        lat: parseFloat(lat), 
        lng: parseFloat(lng), 
        imageUrl, 
        userId, 
        status: "PENDING",
        priority 
      },
      include: { user: { select: { id: true, fullName: true, state: true } } },
    });

    // Instant Broadcast to Agencies & Command Center
    getIO().to("command-center").emit("new-incident", incident);
    
    if (priority === "CRITICAL") {
      getIO().emit("high-priority-broadcast", { 
        message: `DEPLY IMMEDIATE: ${type} incident reported!`,
        incident 
      });
    }
    res.status(201).json({ success: true, incident });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create incident" });
  }
};

exports.getIncidents = async (req, res) => {
  try {
    const incidents = await prisma.incident.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, fullName: true, state: true } },
        responder: { select: { id: true, name: true, type: true } },
      },
    });
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch incidents" });
  }
};

exports.getIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const incident = await prisma.incident.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, email: true, state: true } },
        responder: { select: { id: true, name: true, type: true, state: true } },
      },
    });
    if (!incident) return res.status(404).json({ message: "Incident not found" });
    res.json(incident);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch incident" });
  }
};

exports.updateIncident = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.incident.update({
      where: { id },
      data: { status },
      include: { user: { select: { id: true, fullName: true, state: true } }, responder: { select: { id: true, name: true, type: true } } },
    });

    getIO().emit("incidentUpdated", updated);
    res.json({ success: true, updated });
  } catch (error) {
    next(error);
  }
};

exports.verifyIncident = async (req, res, next) => {
  try {
    const { id } = req.params;
    const incident = await prisma.incident.update({
      where: { id },
      data: { status: "RESOLVED" },
      include: { user: { select: { id: true, fullName: true } }, responder: { select: { id: true, name: true } } },
    });
    getIO().emit("incidentVerified", incident);
    res.json({ success: true, incident });
  } catch (err) {
    next(err);
  }
};
