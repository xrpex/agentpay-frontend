import React, { useEffect, useState } from "react";
import ToolCard from "../components/ToolCard.jsx";
import { fetchTools } from "../lib/api.js";

const CATEGORIES = ["All", "Data", "Finance", "AI", "Dev"];

export default function MarketplacePage() {
  const [tools, setTools] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTools()
      .then(setTools)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const displayed = filter === "All" ? tools : tools.filter((t) => t.category === filter);

  return (
    <div>
      {/* Hero */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{
          fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
          fontWeight: 800,
          lineHeight: 1.2,
          marginBottom: "0.75rem",
          background: "linear-gradient(135deg, #e2e8f0 30%, #0ea5e9)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          AI Tool Marketplace
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1rem", maxWidth: "600px", lineHeight: 1.6 }}>
          Any AI agent can call these tools and pay per request using{" "}
          <span style={{ color: "var(--accent)", fontWeight: 600 }}>XRP on XRPL</span>{" "}
          via the x402 protocol — no API keys, no subscriptions.
        </p>
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding: "6px 14px",
              borderRadius: "99px",
              border: filter === cat ? "1px solid var(--accent)" : "1px solid var(--border)",
              background: filter === cat ? "var(--accent)20" : "var(--bg2)",
              color: filter === cat ? "var(--accent)" : "var(--muted)",
              fontWeight: 500,
              fontSize: "0.82rem",
              cursor: "pointer",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading && <p style={{ color: "var(--muted)" }}>Loading tools from server…</p>}
      {error && (
        <div style={{ background: "#ef444420", border: "1px solid #ef4444", borderRadius: "8px", padding: "1rem", color: "#ef4444" }}>
          ⚠️ Could not connect to backend: {error}
          <br /><small style={{ opacity: 0.7 }}>Is the backend running? Run: cd backend && npm start</small>
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "1rem",
      }}>
        {displayed.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
      </div>

      {!loading && !error && displayed.length === 0 && (
        <p style={{ color: "var(--muted)", textAlign: "center", padding: "3rem" }}>No tools in this category yet.</p>
      )}

      {/* x402 explainer */}
      <div style={{
        marginTop: "3rem",
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "1.5rem",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "1.5rem",
      }}>
        {[
          { icon: "🤖", title: "Agent-Native", desc: "AI agents discover and pay automatically via HTTP 402" },
          { icon: "⚡", title: "Instant Settlement", desc: "XRP settles in 3-5 seconds on XRPL mainnet" },
          { icon: "🔑", title: "No API Keys", desc: "Zero accounts or auth needed — payment IS the credential" },
          { icon: "📊", title: "Pay Per Use", desc: "Micro-payments from 0.005 XRP per call" },
        ].map((item) => (
          <div key={item.title}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.4rem" }}>{item.icon}</div>
            <div style={{ fontWeight: 600, marginBottom: "0.25rem", fontSize: "0.9rem" }}>{item.title}</div>
            <div style={{ color: "var(--muted)", fontSize: "0.82rem", lineHeight: 1.5 }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
