const prisma = require("../config/db");

exports.verifyIncident = async (req, res, next) => {
  try {
    const { id } = req.params;
    const incident = await prisma.incident.update({
      where: { id },
      data: { status: "RESOLVED" },
      include: { user: { select: { id: true, fullName: true } }, responder: { select: { id: true, name: true } } },
    });
    require("../config/socket").getIO().emit("incidentVerified", incident);
    res.json({ success: true, incident });
  } catch (error) {
    next(error);
  }
};
