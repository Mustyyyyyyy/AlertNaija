const prisma = require("../../config/db");

exports.getAdminDashboardStats = async (req, res, next) => {
  try {
    const [
      totalIncidents, pendingIncidents, assignedIncidents, inProgressIncidents, resolvedIncidents,
      totalUsers, totalResponders, availableResponders,
    ] = await Promise.all([
      prisma.incident.count(),
      prisma.incident.count({ where: { status: "PENDING" } }),
      prisma.incident.count({ where: { status: "ASSIGNED" } }),
      prisma.incident.count({ where: { status: "IN_PROGRESS" } }),
      prisma.incident.count({ where: { status: "RESOLVED" } }),
      prisma.user.count(),
      prisma.responder.count(),
      prisma.responder.count({ where: { isAvailable: true } }),
    ]);

    const recentIncidents = await prisma.incident.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: { select: { fullName: true, state: true } }, responder: { select: { name: true, type: true } } },
    });

    const userGrowth = await prisma.user.aggregate({
      _count: true,
      _min: {
        createdAt: true,
      },
    });

    res.json({
      incidents: { total: totalIncidents, pending: pendingIncidents, assigned: assignedIncidents, inProgress: inProgressIncidents, resolved: resolvedIncidents },
      users: { total: totalUsers },
      responders: { total: totalResponders, available: availableResponders, busy: totalResponders - availableResponders },
      recentIncidents,
      userGrowth,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        role: true,
        state: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

exports.getAllResponders = async (req, res, next) => {
  try {
    const responders = await prisma.responder.findMany({
      select: {
        id: true,
        name: true,
        type: true,
        state: true,
        lat: true,
        lng: true,
        isAvailable: true,
        activeCases: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, responders });
  } catch (error) {
    next(error);
  }
};

exports.updateResponderAvailability = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    const responder = await prisma.responder.update({
      where: { id },
      data: { isAvailable: !!isAvailable },
    });

    res.json({ success: true, responder });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id } });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

exports.deleteResponder = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.responder.delete({ where: { id } });
    res.json({ success: true, message: "Responder deleted successfully" });
  } catch (error) {
    next(error);
  }
};