const { WebPush } = require("./pushNotifications");

const PUSH_TOPIC = "emergency-alerts";

exports.sendPushNotification = async (title, body, incident = null) => {
  const payload = JSON.stringify({ title, body, data: incident ? { incidentId: incident.id } : {} });
  try { await WebPush.sendNotification({ topic: PUSH_TOPIC }, payload); }
  catch (err) { console.warn("Push notification failed:", err.message); }
};

exports.notifyNewIncident = async (incident) => {
  await exports.sendPushNotification(`New ${incident.type.charAt(0) + incident.type.slice(1).toLowerCase()} Incident`, `A new ${incident.type.toLowerCase()} incident has been reported.`, incident);
};

exports.notifyAssigned = async (incident) => {
  if (!incident.responder) return;
  await exports.sendPushNotification("Incident Assigned", "You have been assigned to an incident.", incident);
};
