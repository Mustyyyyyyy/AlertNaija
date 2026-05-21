const express = require("express");
const router = express.Router();

/**
 * Inline emergency contact data.
 * Mirrors src/utils/nigeriaStates.js on the client side.
 * Must be kept in sync manually or extracted to a shared JSON file.
 */
const CONTACTS = {
  Abia: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police",  phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",    phone: "0803-322-8411", icon: "🚨" },
      { label: "FRSC",    phone: "0802-395-6611", icon: "🚗" },
      { label: "Fire",    phone: "0805-605-5555", icon: "🔥" },
      { label: "FEMI/SGBV",phone:"0800-862-4670",  icon: "🛡️" },
    ],
  },
  Adamawa: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police",     phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",       phone: "0803-322-8411", icon: "🚨" },
      { label: "NDLEA",      phone: "0808-806-0111", icon: "⚖️" },
    ],
  },
  "Akwa Ibom": {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police", phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",   phone: "0803-322-8411", icon: "🚨" },
      { label: "FRSC",   phone: "0802-395-6611", icon: "🚗" },
    ],
  },
  Anambra: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police", phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",   phone: "0803-322-8411", icon: "🚨" },
      { label: "Fire",   phone: "0805-605-5555", icon: "🔥" },
      { label: "FRSC",   phone: "0802-395-6611", icon: "🚗" },
    ],
  },
  Bauchi: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police", phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",   phone: "0803-322-8411", icon: "🚨" },
    ],
  },
  Bayelsa: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police", phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",   phone: "0803-322-8411", icon: "🚨" },
      { label: "Fire",   phone: "0805-605-5555", icon: "🔥" },
    ],
  },
  Benue: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police", phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",   phone: "0803-322-8411", icon: "🚨" },
      { label: "FRSC",   phone: "0802-395-6611", icon: "🚗" },
    ],
  },
  Borno: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police",  phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",    phone: "0803-322-8411", icon: "🚨" },
      { label: "NDLEA",   phone: "0808-806-0111", icon: "⚖️" },
    ],
  },
  "Cross River": {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police", phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",   phone: "0803-322-8411", icon: "🚨" },
      { label: "NCDC",   phone: "0800-9700-0010", icon: "🏥" },
    ],
  },
  Delta: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police", phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",   phone: "0803-322-8411", icon: "🚨" },
      { label: "FRSC",   phone: "0802-395-6611", icon: "🚗" },
      { label: "NCDC",   phone: "0800-9700-0010", icon: "🏥" },
    ],
  },
  Ebonyi: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police", phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",   phone: "0803-322-8411", icon: "🚨" },
    ],
  },
  Edo: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police", phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",   phone: "0803-322-8411", icon: "🚨" },
      { label: "FRSC",   phone: "0802-395-6611", icon: "🚗" },
      { label: "Fire",   phone: "0805-605-5555", icon: "🔥" },
    ],
  },
  Ekiti: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police", phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",   phone: "0803-322-8411", icon: "🚨" },
    ],
  },
  Enugu: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police", phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",   phone: "0803-322-8411", icon: "🚨" },
      { label: "FRSC",   phone: "0802-395-6611", icon: "🚗" },
      { label: "Fire",   phone: "0805-605-5555", icon: "🔥" },
      { label: "NCDC",   phone: "0800-9700-0010", icon: "🏥" },
    ],
  },
  FCT: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police",    phone: "0803-200-0196",  icon: "🚓" },
      { label: "NEMA",      phone: "0803-322-8411",  icon: "🚨" },
      { label: "FRSC",      phone: "0802-395-6611",  icon: "🚗" },
      { label: "Fire",      phone: "0805-605-5555",  icon: "🔥" },
      { label: "NCDC",      phone: "0800-9700-0010", icon: "🏥" },
      { label: "FEMI/SGBV", phone: "0800-862-4670",  icon: "🛡️" },
      { label: "NDLEA",     phone: "0808-806-0111",  icon: "⚖️" },
    ],
  },
  Gombe: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police", phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",   phone: "0803-322-8411", icon: "🚨" },
    ],
  },
  Imo: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police", phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",   phone: "0803-322-8411", icon: "🚨" },
      { label: "Fire",   phone: "0805-605-5555", icon: "🔥" },
    ],
  },
  Jigawa: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police", phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",   phone: "0803-322-8411", icon: "🚨" },
    ],
  },
  Kaduna: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police",    phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",      phone: "0803-322-8411", icon: "🚨" },
      { label: "NDLEA",     phone: "0808-806-0111", icon: "⚖️" },
    ],
  },
  Kano: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police",    phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",      phone: "0803-322-8411", icon: "🚨" },
      { label: "NDLEA",     phone: "0808-806-0111", icon: "⚖️" },
    ],
  },
  Katsina: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police",    phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",      phone: "0803-322-8411", icon: "🚨" },
      { label: "NDLEA",     phone: "0808-806-0111", icon: "⚖️" },
    ],
  },
  Kebbi: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police", phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",   phone: "0803-322-8411", icon: "🚨" },
    ],
  },
  Kogi: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police", phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",   phone: "0803-322-8411", icon: "🚨" },
    ],
  },
  Kwara: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police", phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",   phone: "0803-322-8411", icon: "🚨" },
      { label: "FRSC",   phone: "0802-395-6611", icon: "🚗" },
    ],
  },
  Lagos: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police",    phone: "0803-200-0196",  icon: "🚓" },
      { label: "NEMA",      phone: "0803-322-8411",  icon: "🚨" },
      { label: "FRSC",      phone: "0802-395-6611",  icon: "🚗" },
      { label: "Fire",      phone: "0805-605-5555",  icon: "🔥" },
      { label: "NCDC",      phone: "0800-9700-0010", icon: "🏥" },
      { label: "FEMI/SGBV", phone: "0800-862-4670",  icon: "🛡️" },
      { label: "NDLEA",     phone: "0808-806-0111",  icon: "⚖️" },
    ],
  },
  Nasarawa: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police", phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",   phone: "0803-322-8411", icon: "🚨" },
    ],
  },
  Niger: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police", phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",   phone: "0803-322-8411", icon: "🚨" },
    ],
  },
  Ogun: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police", phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",   phone: "0803-322-8411", icon: "🚨" },
      { label: "FRSC",   phone: "0802-395-6611", icon: "🚗" },
      { label: "Fire",   phone: "0805-605-5555", icon: "🔥" },
    ],
  },
  Ondo: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police", phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",   phone: "0803-322-8411", icon: "🚨" },
      { label: "FRSC",   phone: "0802-395-6611", icon: "🚗" },
    ],
  },
  Osun: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police", phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",   phone: "0803-322-8411", icon: "🚨" },
      { label: "Fire",   phone: "0805-605-5555", icon: "🔥" },
    ],
  },
  Oyo: {
    phone: "0803-200-0196",
    contacts: [
      { label: " Police", phone: "0803-200-0196", icon: "🚓" },
      { label: " NEMA",   phone: "0803-322-8411", icon: "🚨" },
      { label: " FRSC",   phone: "0802-395-6611", icon: "🚗" },
    ],
  },
  Plateau: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police",    phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",      phone: "0803-322-8411", icon: "🚨" },
      { label: "NDLEA",     phone: "0808-806-0111", icon: "⚖️" },
    ],
  },
  Rivers: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police", phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",   phone: "0803-322-8411", icon: "🚨" },
      { label: "FRSC",   phone: "0802-395-6611", icon: "🚗" },
      { label: "Fire",   phone: "0805-605-5555", icon: "🔥" },
      { label: "NCDC",   phone: "0800-9700-0010", icon: "🏥" },
    ],
  },
  Sokoto: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police",    phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",      phone: "0803-322-8411", icon: "🚨" },
      { label: "NDLEA",     phone: "0808-806-0111", icon: "⚖️" },
    ],
  },
  Taraba: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police", phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",   phone: "0803-322-8411", icon: "🚨" },
    ],
  },
  Yobe: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police",    phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",      phone: "0803-322-8411", icon: "🚨" },
      { label: "NDLEA",     phone: "0808-806-0111", icon: "⚖️" },
    ],
  },
  Zamfara: {
    phone: "0803-200-0196",
    contacts: [
      { label: "Police",    phone: "0803-200-0196", icon: "🚓" },
      { label: "NEMA",      phone: "0803-322-8411", icon: "🚨" },
      { label: "NDLEA",     phone: "0808-806-0111", icon: "⚖️" },
    ],
  },
};

router.get("/", (req, res) => {
  const { state } = req.query;
  if (!state) {
    return res.json({ success: true, states: Object.keys(CONTACTS), data: CONTACTS });
  }
  const data = CONTACTS[state] || null;
  return res.json({ success: true, state: state || null, data });
});

module.exports = router;
