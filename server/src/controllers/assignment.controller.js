const prisma = require("../config/db");

exports.assignResponder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { responderId } = req.body;

    if (!responderId) return res.status(400).json({ success: false, message: "responderId is required" });

    const incident = await prisma.incident.update({
      where: { id },
      data: { responderId, status: "ASSIGNED" },
      include: { user: { select: { fullName: true, state: true } }, responder: { select: { id: true, name: true, type: true } } },
    });

    await prisma.responder.update({ where: { id: responderId }, data: { isAvailable: false } });

    require("../config/socket").getIO().to("command-center").emit("incidentAssigned", incident);

    res.json({ success: true, incident });
  } catch (error) {
    next(error);
  }
};
