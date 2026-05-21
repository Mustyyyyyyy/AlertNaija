const prisma = require("../config/db");

exports.getAnalytics = async (req, res) => {
  try {
    const incidents = await prisma.incident.findMany({});
    const total = incidents.length;
    const byType = {};
    const byStatus = {};
    incidents.forEach((inc) => { byType[inc.type] = (byType[inc.type] || 0) + 1; byStatus[inc.status] = (byStatus[inc.status] || 0) + 1; });
    const responders = await prisma.responder.findMany({});
    const available = responders.filter((r) => r.isAvailable).length;
    const resolutionRate = total > 0 ? Math.round(((byStatus.RESOLVED || 0) / total) * 100) : 0;
    res.json({ total, byType, byStatus, responders: { total: responders.length, available, busy: responders.length - available }, resolutionRate });
  } catch (e) {
    res.status(500).json({ success: false, message: "Failed to fetch analytics" });
  }
};
