import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const navStyle = {
  background: "var(--bg2)",
  borderBottom: "1px solid var(--border)",
  padding: "0 2rem",
  display: "flex",
  alignItems: "center",
  gap: "2rem",
  height: "60px",
  position: "sticky",
  top: 0,
  zIndex: 100,
  overflowX: "auto",
};

const logoStyle = {
  fontWeight: 800,
  fontSize: "1.2rem",
  background: "linear-gradient(135deg, #0ea5e9, #7c3aed)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginRight: "auto",
  flexShrink: 0,
};

const linkStyle = ({ isActive }) => ({
  color: isActive ? "var(--accent)" : "var(--muted)",
  fontWeight: 500,
  fontSize: "0.9rem",
  padding: "4px 0",
  borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
  textDecoration: "none",
  transition: "color 0.2s",
  flexShrink: 0,
});

const badgeStyle = {
  background: "linear-gradient(135deg, #0ea5e9, #7c3aed)",
  color: "#fff",
  fontSize: "0.65rem",
  fontWeight: 700,
  padding: "2px 6px",
  borderRadius: "99px",
  marginLeft: "6px",
  verticalAlign: "middle",
  flexShrink: 0,
};

export default function Layout() {
  return (
    <>
      <nav style={navStyle}>
        <span style={logoStyle}>⚡ AgentPay</span>
        <NavLink to="/" style={linkStyle}>Marketplace</NavLink>
        <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
        <NavLink to="/docs" style={linkStyle}>Docs</NavLink>
        <NavLink to="/about" style={linkStyle}>About</NavLink>
        <span style={badgeStyle}>x402 · XRPL</span>
      </nav>
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <Outlet />
      </main>
    </>
  );
}
