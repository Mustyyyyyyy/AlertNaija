const prisma = require("../config/db");

exports.logAction = async (userId, action, meta = {}) => {
  try {
    await prisma.auditLog.create({ data: { action, meta, userId: userId || null } });
  } catch (err) { console.warn("Audit log failed:", err.message); }
};
