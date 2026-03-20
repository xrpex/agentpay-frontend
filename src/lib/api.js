// src/lib/api.js
const BASE = rt.meta.env.VITE_BACKEND_URL ?? "https://agentpay-backend-production.up.railway.app";


export async function fetchTools() {
  const r = await fetch(`${BASE}/tools`);
  if (!r.ok) throw new Error("Failed to load tools");
  return r.json();
}

export async function fetchStats() {
  // Stub — replace with real Supabase query when backend is live
  return {
    total_calls: 1842,
    total_xrp_earned: 12.45,
    unique_agents: 34,
    top_tool: "web-scraper",
  };
}
