import React, { useEffect, useState } from "react";

const MOCK_LOGS = [
  { id: 1, tool_id: "web-scraper", drops_paid: 10000, agent_wallet: "rAgent1...abc", called_at: "2026-03-20T10:14:22Z" },
  { id: 2, tool_id: "price-oracle", drops_paid: 5000, agent_wallet: "rAgent2...xyz", called_at: "2026-03-20T10:13:01Z" },
  { id: 3, tool_id: "ai-summarizer", drops_paid: 20000, agent_wallet: "rAgent1...abc", called_at: "2026-03-20T10:11:44Z" },
  { id: 4, tool_id: "code-executor", drops_paid: 30000, agent_wallet: "rAgent3...qrs", called_at: "2026-03-20T10:09:15Z" },
  { id: 5, tool_id: "defi-feed", drops_paid: 10000, agent_wallet: "rAgent2...xyz", called_at: "2026-03-20T10:07:03Z" },
  { id: 6, tool_id: "web-scraper", drops_paid: 10000, agent_wallet: "rAgent4...lmn", called_at: "2026-03-20T09:55:10Z" },
  { id: 7, tool_id: "price-oracle", drops_paid: 5000, agent_wallet: "rAgent1...abc", called_at: "2026-03-20T09:50:33Z" },
];

const TOOL_ICONS = {
  "web-scraper": "🌐",
  "price-oracle": "📈",
  "ai-summarizer": "🤖",
  "defi-feed": "💹",
  "code-executor": "⚡",
};

function StatCard({ label, value, sub, color = "var(--accent)" }) {
  return (
    <div style={{
      background: "var(--card)",
      border: "1px solid var(--border)",
      borderRadius: "12px",
      padding: "1.25rem 1.5rem",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
        background: `linear-gradient(90deg, ${color}, transparent)`,
      }} />
      <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.4rem", fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: "1.8rem", fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color }}>{value}</div>
      {sub && <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: "0.25rem" }}>{sub}</div>}
    </div>
  );
}

function MiniBar({ label, value, max, color }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "0.82rem" }}>{label}</span>
        <span style={{ fontSize: "0.82rem", fontFamily: "JetBrains Mono, monospace", color: "var(--muted)" }}>{value} calls</span>
      </div>
      <div style={{ background: "var(--bg3)", borderRadius: "99px", height: "6px" }}>
        <div style={{ width: `${pct}%`, background: color, height: "6px", borderRadius: "99px", transition: "width 0.6s" }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (SUPABASE_URL && SUPABASE_ANON) {
      fetch(`${SUPABASE_URL}/rest/v1/usage_logs?order=called_at.desc&limit=50`, {
        headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
      })
        .then((r) => r.json())
        .then((data) => { setLogs(Array.isArray(data) ? data : MOCK_LOGS); })
        .catch(() => setLogs(MOCK_LOGS))
        .finally(() => setLoading(false));
    } else {
      // Use demo data if Supabase not configured
      setTimeout(() => { setLogs(MOCK_LOGS); setLoading(false); }, 400);
    }
  }, []);

  const totalDrops = logs.reduce((s, l) => s + (l.drops_paid ?? 0), 0);
  const totalXRP = (totalDrops / 1_000_000).toFixed(4);
  const uniqueAgents = new Set(logs.map((l) => l.agent_wallet)).size;

  // Calls per tool
  const toolCounts = logs.reduce((acc, l) => {
    acc[l.tool_id] = (acc[l.tool_id] ?? 0) + 1;
    return acc;
  }, {});
  const maxCalls = Math.max(...Object.values(toolCounts), 1);

  const TOOL_COLORS = {
    "web-scraper": "#0ea5e9",
    "price-oracle": "#22c55e",
    "ai-summarizer": "#a855f7",
    "defi-feed": "#f59e0b",
    "code-executor": "#ef4444",
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.4rem" }}>Earnings Dashboard</h1>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
          Real-time usage stats from Supabase.{" "}
          {!import.meta.env.VITE_SUPABASE_URL && (
            <span style={{ color: "var(--amber)" }}>⚠️ Demo data — add VITE_SUPABASE_URL to .env to go live.</span>
          )}
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <StatCard label="Total Calls" value={logs.length} sub="all time" color="var(--accent)" />
        <StatCard label="XRP Earned" value={`${totalXRP}`} sub="platform share" color="#22c55e" />
        <StatCard label="Drops Settled" value={totalDrops.toLocaleString()} sub="on XRPL" color="#a855f7" />
        <StatCard label="Unique Agents" value={uniqueAgents} sub="distinct wallets" color="#f59e0b" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
        {/* Tool usage chart */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "1.25rem" }}>Calls per Tool</h2>
          {Object.entries(toolCounts).sort((a, b) => b[1] - a[1]).map(([tool, count]) => (
            <MiniBar
              key={tool}
              label={`${TOOL_ICONS[tool] ?? "🔧"} ${tool}`}
              value={count}
              max={maxCalls}
              color={TOOL_COLORS[tool] ?? "var(--accent)"}
            />
          ))}
          {Object.keys(toolCounts).length === 0 && (
            <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>No data yet.</p>
          )}
        </div>

        {/* Recent calls feed */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "1.25rem" }}>Recent Calls</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", maxHeight: "320px", overflowY: "auto" }}>
            {loading ? (
              <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Loading…</p>
            ) : (
              logs.slice(0, 20).map((log, i) => (
                <div key={log.id ?? i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "0.6rem 0.75rem", background: "var(--bg2)", borderRadius: "8px",
                  fontSize: "0.8rem",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span>{TOOL_ICONS[log.tool_id] ?? "🔧"}</span>
                    <span style={{ fontWeight: 500 }}>{log.tool_id}</span>
                  </div>
                  <div style={{ color: "var(--muted)", fontFamily: "JetBrains Mono, monospace", fontSize: "0.75rem" }}>
                    {log.agent_wallet?.slice(0, 12)}…
                  </div>
                  <div style={{ color: "#22c55e", fontFamily: "JetBrains Mono, monospace" }}>
                    +{(log.drops_paid / 1_000_000).toFixed(4)} XRP
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Wallet info reminder */}
      <div style={{
        background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: "10px",
        padding: "1rem 1.5rem", display: "flex", gap: "1rem", alignItems: "center",
      }}>
        <span style={{ fontSize: "1.5rem" }}>💼</span>
        <div>
          <div style={{ fontWeight: 600, marginBottom: "2px", fontSize: "0.9rem" }}>Platform Wallet</div>
          <div style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
            Set <code style={{ background: "var(--bg3)", padding: "1px 5px", borderRadius: "4px" }}>XRPL_PAY_TO</code> in
            your backend <code style={{ background: "var(--bg3)", padding: "1px 5px", borderRadius: "4px" }}>.env</code> to
            your XRPL wallet. All payments settle there directly on-ledger via the t54.ai x402 facilitator.
          </div>
        </div>
      </div>
    </div>
  );
}
