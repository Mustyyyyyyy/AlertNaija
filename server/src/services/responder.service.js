const prisma = require("../config/db");

exports.findBestResponder = async (lat, lng, type) => {
  const responders = await prisma.responder.findMany({ where: { isAvailable: true } });
  if (responders.length === 0) return null;

  const scored = responders.map(r => ({ ...r, distance: Math.sqrt(Math.pow(r.lat - lat, 2) + Math.pow(r.lng - lng, 2)) }));
  scored.sort((a, b) => a.distance - b.distance);
  return scored[0];
};

exports.assignResponder = async (incidentId, responderId) => {
  return prisma.incident.update({
    where: { id: incidentId },
    data: { responderId, status: "ASSIGNED" },
    include: { user: { select: { fullName: true, state: true } }, responder: { select: { name: true, type: true } } },
  });
};
