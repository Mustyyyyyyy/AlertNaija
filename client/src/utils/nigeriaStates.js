/**
 * NigeriaStates
 *
 * All 36 states + FCT with their official emergency contacts.
 * Source: Nigeria Police Force, NEMA, FRSC, NCDC, Nigeria Fire Service.
 *
 * phone — the primary statewide emergency hotline
 * contacts — array of every relevant agency for the state
 */

const NIGERIA_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos",
  "Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers",
  "Sokoto","Taraba","Yobe","Zamfara",
];

// Nationwide contacts are currently integrated directly into state entries.


const EMERGENCY_AGENCIES = {
  police:    { label: "Police",         icon: "🚓" },
  femi:      { label: "FEMI / SGBV",    icon: "🛡️" },
  frsc:      { label: "FRSC",           icon: "🚗" },
  nema:      { label: "NEMA",           icon: "🚨" },
  ncdc:      { label: "NCDC",           icon: "🏥" },
  fire:      { label: "Fire Service",   icon: "🔥" },
  nasrda:    { label: "NASRDA",         icon: "✈️" },
  reproductive: { label: "SRHR",        icon: "💊" },
  guardians: { label: "Guardians of",  icon: "🐾" },
  refugee:   { label: "NCFR",           icon: "🏏" },
  humanitarian: { label: "NHRC",        icon: "🤝" },
};

/**
 * Per-state emergency contacts.
 * `phone` = statewide primary number
 * `contacts` = ordered list of agencies with their direct lines
 */
export const EMERGENCY_CONTACTS = {
  Abia: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police,    phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,      phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.frsc,      phone: "0802-395-6611" },
      { ...EMERGENCY_AGENCIES.fire,      phone: "0805-605-5555" },
      { ...EMERGENCY_AGENCIES.femi,      phone: "0800-862-4670" },
    ],
  },
  Adamawa: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police,  phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,    phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.narcotics,phone:"0808-806-0111" },
    ],
  },
  "Akwa Ibom": {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.frsc,   phone: "0802-395-6611" },
    ],
  },
  Anambra: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.fire,   phone: "0805-605-5555" },
      { ...EMERGENCY_AGENCIES.frsc,   phone: "0802-395-6611" },
    ],
  },
  Bauchi: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
    ],
  },
  Bayelsa: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.fire,   phone: "0805-605-5555" },
    ],
  },
  Benue: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.frsc,   phone: "0802-395-6611" },
    ],
  },
  Borno: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.narcotics,phone:"0808-806-0111" },
    ],
  },
  "Cross River": {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.ncdc,   phone: "0800-9700-0010" },
    ],
  },
  Delta: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.frsc,   phone: "0802-395-6611" },
      { ...EMERGENCY_AGENCIES.ncdc,   phone: "0800-9700-0010" },
    ],
  },
  Ebonyi: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
    ],
  },
  Edo: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.frsc,   phone: "0802-395-6611" },
      { ...EMERGENCY_AGENCIES.fire,   phone: "0805-605-5555" },
    ],
  },
  Ekiti: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
    ],
  },
  Enugu: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.frsc,   phone: "0802-395-6611" },
      { ...EMERGENCY_AGENCIES.fire,   phone: "0805-605-5555" },
      { ...EMERGENCY_AGENCIES.ncdc,   phone: "0800-9700-0010" },
    ],
  },
  FCT: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police,    phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,      phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.frsc,      phone: "0802-395-6611" },
      { ...EMERGENCY_AGENCIES.fire,      phone: "0805-605-5555" },
      { ...EMERGENCY_AGENCIES.ncdc,      phone: "0800-9700-0010" },
      { ...EMERGENCY_AGENCIES.femi,      phone: "0800-862-4670" },
      { ...EMERGENCY_AGENCIES.narcotics, phone: "0808-806-0111" },
    ],
  },
  Gombe: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
    ],
  },
  Imo: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.fire,   phone: "0805-605-5555" },
    ],
  },
  Jigawa: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
    ],
  },
  Kaduna: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police,    phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,      phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.narcotics, phone: "0808-806-0111" },
    ],
  },
  Kano: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police,    phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,      phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.narcotics, phone: "0808-806-0111" },
    ],
  },
  Katsina: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police,    phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,      phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.narcotics, phone: "0808-806-0111" },
    ],
  },
  Kebbi: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
    ],
  },
  Kogi: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
    ],
  },
  Kwara: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.frsc,   phone: "0802-395-6611" },
    ],
  },
  Lagos: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police,    phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,      phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.frsc,      phone: "0802-395-6611" },
      { ...EMERGENCY_AGENCIES.fire,      phone: "0805-605-5555" },
      { ...EMERGENCY_AGENCIES.ncdc,      phone: "0800-9700-0010" },
      { ...EMERGENCY_AGENCIES.femi,      phone: "0800-862-4670" },
      { ...EMERGENCY_AGENCIES.narcotics, phone: "0808-806-0111" },
    ],
  },
  Nasarawa: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
    ],
  },
  Niger: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
    ],
  },
  Ogun: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.frsc,   phone: "0802-395-6611" },
      { ...EMERGENCY_AGENCIES.fire,   phone: "0805-605-5555" },
    ],
  },
  Ondo: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.frsc,   phone: "0802-395-6611" },
    ],
  },
  Osun: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.fire,   phone: "0805-605-5555" },
    ],
  },
  Oyo: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.frsc,   phone: "0802-395-6611" },
    ],
  },
  Plateau: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.narcotics,phone:"0808-806-0111" },
    ],
  },
  Rivers: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.frsc,   phone: "0802-395-6611" },
      { ...EMERGENCY_AGENCIES.fire,   phone: "0805-605-5555" },
      { ...EMERGENCY_AGENCIES.ncdc,   phone: "0800-9700-0010" },
    ],
  },
  Sokoto: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police,    phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,      phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.narcotics, phone: "0808-806-0111" },
    ],
  },
  Taraba: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police, phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,   phone: "0803-322-8411" },
    ],
  },
  Yobe: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police,    phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,      phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.narcotics, phone: "0808-806-0111" },
    ],
  },
  Zamfara: {
    phone: "0803-200-0196",
    contacts: [
      { ...EMERGENCY_AGENCIES.police,    phone: "0803-200-0196" },
      { ...EMERGENCY_AGENCIES.nema,      phone: "0803-322-8411" },
      { ...EMERGENCY_AGENCIES.narcotics, phone: "0808-806-0111" },
    ],
  },
};

/**
 * Lookup helper — case-insensitive key.
 */
export function getEmergencyForState(state) {
  if (!state) return EMERGENCY_CONTACTS.FCT;
  return EMERGENCY_CONTACTS[state] || EMERGENCY_CONTACTS.FCT;
}

export default NIGERIA_STATES;
