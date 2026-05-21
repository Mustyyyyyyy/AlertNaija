// Quick test: does basic prisma query work?
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  await p['$connect']();
  try {
    const rows = await p.incident.findMany({
      include: {
        user: { select: { id: true, fullName: true, state: true } },
        responder: { select: { id: true, name: true, type: true } },
      }
    });
    console.log('incidents rows:', rows.length);
  } catch (e) {
    console.error('QUERY ERROR:', e.message, e.code, e.meta);
  } finally {
    await p['$disconnect']();
  }
})();
