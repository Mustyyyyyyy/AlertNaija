const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const prisma = require("../config/db");

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { emailOrPhone } = req.body;
    const user = await prisma.user.findFirst({
      where: { OR: [{ email: emailOrPhone }, { phone: emailOrPhone }] },
    });
    if (!user) {
      return res.json({ success: true, message: "If an account exists, a reset link has been sent." });
    }
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 3600000);
    await prisma.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt },
    });
    if (user.email) {
      console.log(`Password reset link: http://localhost:3000/reset/${token}`);
    }
    res.json({ success: true, message: "If an account exists, a reset link has been sent." });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });
    if (!resetToken || resetToken.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "Invalid or expired token." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });
    await prisma.passwordResetToken.delete({ where: { token } });
    res.json({ success: true, message: "Password reset successfully." });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    // ── Public registration is CITIZEN-only ───────────────────────────────
    // Admin / Operator accounts must be created via:  node seed-admin.cjs
    const { fullName, email, phone, password, state = null } = req.body;
    const cleanEmail = email ? email.trim() : null;
    const cleanPhone = phone ? phone.trim() : null;

    if (cleanEmail) {
      const existingEmail = await prisma.user.findUnique({ where: { email: cleanEmail } });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: "User with this email already exists" });
      }
    }

    if (cleanPhone) {
      const existingPhone = await prisma.user.findUnique({ where: { phone: cleanPhone } });
      if (existingPhone) {
        return res.status(400).json({ success: false, message: "User with this phone already exists" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      // role always defaults to CITIZEN — see Prisma schema @default("citizen")
      data: { fullName, email: cleanEmail, phone: cleanPhone, password: hashedPassword, state: state || null },
    });

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({ success: true, token, user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { emailOrPhone, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { OR: [{ email: emailOrPhone }, { phone: emailOrPhone }] },
    });

    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    res.json({ success: true, token, user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, fullName: true, email: true, phone: true, role: true, state: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { state } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { state: state || null },
      select: { id: true, fullName: true, email: true, phone: true, role: true, state: true, createdAt: true },
    });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
