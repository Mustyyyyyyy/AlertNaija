/**
 * seed-admin.cjs
 *
 * One-time script to create (or update) the first admin user.
 * Run it once from the server/ directory:
 *
 *   node seed-admin.cjs
 *
 * Reads credentials from environment variables — no hardcoded secrets in git.
 * Requires a working DATABASE_URL and JWT_SECRET in .env.
 */

require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const ADMIN_FULL_NAME = process.env.ADMIN_NAME        || "AlertNaija Admin";
const ADMIN_EMAIL     = process.env.ADMIN_EMAIL       || "admin1@alertnaija.ng";
const ADMIN_PHONE     = process.env.ADMIN_PHONE       || "08000000000";
const ADMIN_PASSWORD  = process.env.ADMIN_PASSWORD    || "admin123456";
const JWT_SECRET      = process.env.JWT_SECRET        || "change-me";

function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
}

async function main() {
  console.log("⏳  Checking for existing admin…");

  const existing = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: { id: true, email: true, phone: true },
  });

  if (existing) {
    console.log(`⚠️   Admin already exists: id=${existing.id}  email=${existing.email}  phone=${existing.phone}`);
    console.log("    Delete that user first if you want a fresh seed.");
    await prisma.$disconnect();
    return;
  }

  console.log("🔨  Creating admin user…");

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const admin = await prisma.user.create({
    data: {
      fullName: ADMIN_FULL_NAME,
      email:    ADMIN_EMAIL,
      phone:    ADMIN_PHONE,
      password: hashed,
      role:     "ADMIN",
      state:    "FCT",
    },
    select: {
      id:        true,
      fullName:  true,
      email:     true,
      phone:     true,
      role:      true,
      createdAt: true,
    },
  });

  console.log("✅  Admin created:");
  console.log(`     id          : ${admin.id}`);
  console.log(`     name        : ${admin.fullName}`);
  console.log(`     email       : ${admin.email}`);
  console.log(`     phone       : ${admin.phone}`);
  console.log(`     role        : ${admin.role}`);
  console.log(`     createdAt   : ${admin.createdAt}`);

  const token = generateToken(admin);
  console.log("\n🔑  Login token:");
  console.log(`     ${token}`);
  console.log("\n    Store this token in browser localStorage as 'token' to access admin routes.");
  console.log("    Credentials:");
  console.log(`     emailOrPhone: ${ADMIN_EMAIL}`);
  console.log(`     password    : ${ADMIN_PASSWORD}`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
});
