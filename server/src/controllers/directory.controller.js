const prisma = require("../config/db");

exports.getDirectory = async (req, res, next) => {
  try {
    const { state, type, available } = req.query;
    const where = {};
    if (state) where.state = state;
    if (type) where.type = type;
    if (available === "true") where.isAvailable = true;

    const responders = await prisma.responder.findMany({ where, orderBy: { name: "asc" } });
    res.json(responders);
  } catch (error) {
    next(error);
  }
};

exports.getResponder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const responder = await prisma.responder.findUnique({ where: { id } });
    if (!responder) return res.status(404).json({ message: "Responder not found" });
    res.json(responder);
  } catch (error) {
    next(error);
  }
};

exports.createResponder = async (req, res, next) => {
  try {
    const responder = await prisma.responder.create({ data: req.body });
    res.status(201).json({ success: true, responder });
  } catch (error) {
    next(error);
  }
};

exports.updateResponder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const responder = await prisma.responder.update({ where: { id }, data: req.body });
    res.json({ success: true, responder });
  } catch (error) {
    next(error);
  }
};
