import axios from "axios";

// Prefer env override, otherwise use same-origin relative /api (works on Vercel when rewrites are configured)
const envBackendUrl = process.env.REACT_APP_BACKEND_URL?.trim();
const API_BASE = envBackendUrl && envBackendUrl !== "" ? `${envBackendUrl.replace(/\/$/, "")}/api` : "/api";

export const createWaitlist = async (payload) => {
  const { data } = await axios.post(`${API_BASE}/waitlist`, payload);
  return data;
};

export const fetchWaitlist = async () => {
  const { data } = await axios.get(`${API_BASE}/waitlist`);
  return data;
};