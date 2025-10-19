import axios from "axios";

// Vite: use import.meta.env.VITE_API_BASE, default to /api for same-origin
const envApiBase = (import.meta.env?.VITE_API_BASE || "").trim();
const API_BASE = envApiBase && envApiBase !== "" ? envApiBase.replace(/\/$/, "") : "/api";

export const createWaitlist = async (payload) => {
  const { data } = await axios.post(`${API_BASE}/waitlist`, payload);
  return data;
};

export const fetchWaitlist = async () => {
  const { data } = await axios.get(`${API_BASE}/waitlist`);
  return data;
};