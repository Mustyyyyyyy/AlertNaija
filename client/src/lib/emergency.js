import API from "./api";

export const fetchNearestPolice = async (lat, lng) => {
  const res = await API.get(
    `/police/nearest?lat=${lat}&lng=${lng}`
  );
  return res.data;
};

export const triggerSOS = async (payload) => {
  const res = await API.post("/alerts/sos", payload);
  return res.data;
};