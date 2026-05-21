import { create } from "zustand";

const useIncidentStore = create((set) => ({
  incidents: [],
  setIncidents: (incidents) => set({ incidents }),
  addIncident: (incident) => set((s) => ({ incidents: [incident, ...s.incidents] })),
  updateIncident: (id, patch) =>
    set((s) => ({
      incidents: s.incidents.map((inc) => (inc.id === id ? { ...inc, ...patch } : inc)),
    })),
}));

export default useIncidentStore;
