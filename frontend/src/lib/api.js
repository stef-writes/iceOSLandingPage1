import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL; // MUST be set via .env, do not hardcode
const API_BASE = `${BACKEND_URL}/api`;

export const createWaitlist = async (payload) => {
  const { data } = await axios.post(`${API_BASE}/waitlist`, payload);
  return data;
};

export const fetchWaitlist = async () => {
  const { data } = await axios.get(`${API_BASE}/waitlist`);
  return data;
};