// Vite: use import.meta.env.VITE_API_BASE, default to /api for same-origin
const envApiBase = (import.meta.env?.VITE_API_BASE || "").trim();
const API_BASE = envApiBase && envApiBase !== "" ? envApiBase.replace(/\/$/, "") : "/api";

export const createWaitlist = async (payload) => {
  const resp = await fetch(`${API_BASE}/waitlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!resp.ok) throw Object.assign(new Error('Request failed'), { response: { status: resp.status, data: await resp.json().catch(()=>({})) }});
  return await resp.json();
};

export const fetchWaitlist = async (params = {}) => {
  const search = new URLSearchParams(params);
  const resp = await fetch(`${API_BASE}/waitlist?${search.toString()}`);
  if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`);
  return await resp.json();
};