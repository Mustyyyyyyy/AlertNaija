const prisma = require("../config/db");
const dispatchService = require("./dispatch.service");

const TYPE_PRIORITY = { FIRE: 3, MEDICAL: 2, SECURITY: 1, RESCUE: 2 };

exports.autoDispatchIncident = async (incidentId) => {
  const incident = await prisma.incident.findUnique({
    where: { id: incidentId },
    include: { user: { select: { state: true } } },
  });

  if (!incident || incident.responderId) return incident;

  const priority = TYPE_PRIORITY[incident.type] || 0;
  if (priority < 2) return incident;

  try {
    await dispatchService.dispatchToClosestResponder(
      { body: { incidentId: incident.id, type: incident.type, lat: incident.lat, lng: incident.lng } },
      { json: () => {} },
      () => {}
    );
  } catch (e) { /* ignore dispatch failures */ }

  return incident;
};
