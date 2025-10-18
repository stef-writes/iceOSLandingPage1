import axios from "axios";
import { saveWaitlistEntry, getWaitlistEntries } from "../mock/mock";

// Vite: use import.meta.env.VITE_API_BASE, default to /api for same-origin
const envApiBase = (import.meta.env?.VITE_API_BASE || "").trim();
const API_BASE = envApiBase && envApiBase !== "" ? envApiBase.replace(/\/$/, "") : "/api";
const USE_MOCK = String(process.env.REACT_APP_USE_MOCK || "").toLowerCase() === "true";

export const createWaitlist = async (payload) => {
  if (USE_MOCK) {
    return saveWaitlistEntry(payload);
  }
  try {
    const { data } = await axios.post(`${API_BASE}/waitlist`, payload);
    return data;
  } catch (err) {
    const detail = err?.response?.data?.detail || "";
    const isBackendNotConfigured = detail.toLowerCase().includes("backend not configured");
    const isNetwork = !err.response;
    if (process.env.NODE_ENV !== "production" && (isBackendNotConfigured || isNetwork)) {
      // Dev/local fallback to mock storage so the form "works" during preview
      return saveWaitlistEntry(payload);
    }
    throw err;
  }
};

export const fetchWaitlist = async () => {
  if (USE_MOCK) return getWaitlistEntries();
  try {
    const { data } = await axios.get(`${API_BASE}/waitlist`);
    return data;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") return getWaitlistEntries();
    throw err;
  }
};