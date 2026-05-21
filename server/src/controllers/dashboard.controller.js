const prisma = require("../config/db");

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalIncidents, pendingIncidents, assignedIncidents, inProgressIncidents, resolvedIncidents,
      totalResponders, availableResponders,
    ] = await Promise.all([
      prisma.incident.count(),
      prisma.incident.count({ where: { status: "PENDING" } }),
      prisma.incident.count({ where: { status: "ASSIGNED" } }),
      prisma.incident.count({ where: { status: "IN_PROGRESS" } }),
      prisma.incident.count({ where: { status: "RESOLVED" } }),
      prisma.responder.count(),
      prisma.responder.count({ where: { isAvailable: true } }),
    ]);

    const recentIncidents = await prisma.incident.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: { select: { fullName: true, state: true } }, responder: { select: { name: true, type: true } } },
    });

    res.json({
      incidents: { total: totalIncidents, pending: pendingIncidents, assigned: assignedIncidents, inProgress: inProgressIncidents, resolved: resolvedIncidents },
      responders: { total: totalResponders, available: availableResponders, busy: totalResponders - availableResponders },
      recentIncidents,
    });
  } catch (error) {
    next(error);
  }
};
