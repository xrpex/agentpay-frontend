import React from "react";
import { useNavigate } from "react-router-dom";

const CATEGORY_COLORS = {
  Data: "#0ea5e9",
  Finance: "#22c55e",
  AI: "#a855f7",
  Dev: "#f59e0b",
};

export default function ToolCard({ tool }) {
  const navigate = useNavigate();
  const color = CATEGORY_COLORS[tool.category] ?? "#64748b";
  const xrp = (parseInt(tool.price_drops, 10) / 1_000_000).toFixed(4);

  return (
    <div
      onClick={() => navigate(`/tool/${tool.id}`)}
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "1.5rem",
        cursor: "pointer",
        transition: "border-color 0.2s, transform 0.15s",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Glow accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
        background: `linear-gradient(90deg, ${color}80, ${color}00)`,
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "2rem" }}>{tool.icon}</span>
        <span style={{
          background: `${color}20`,
          color,
          fontSize: "0.7rem",
          fontWeight: 600,
          padding: "3px 8px",
          borderRadius: "99px",
          border: `1px solid ${color}40`,
        }}>
          {tool.category}
        </span>
      </div>

      <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.4rem" }}>{tool.name}</h3>
      <p style={{ color: "var(--muted)", fontSize: "0.82rem", lineHeight: 1.5, marginBottom: "1rem" }}>
        {tool.description}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginBottom: "2px" }}>Per request</div>
          <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.9rem", fontWeight: 600, color: "var(--accent)" }}>
            {xrp} XRP
          </div>
        </div>
        <div style={{
          fontSize: "0.7rem",
          color: "var(--muted)",
          fontFamily: "JetBrains Mono, monospace",
          background: "var(--bg3)",
          padding: "4px 8px",
          borderRadius: "6px",
        }}>
          {tool.method ?? "GET"} {tool.path}
        </div>
      </div>
    </div>
  );
}
