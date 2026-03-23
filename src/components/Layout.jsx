import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const nav = {
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

const logo = {
  fontWeight: 800,
  fontSize: "1.2rem",
  background: "linear-gradient(135deg, #0ea5e9, #7c3aed)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  marginRight: "auto",
  flexShrink: 0,
};

const link = ({ isActive }) => ({
  color: isActive ? "var(--accent)" : "var(--muted)",
  fontWeight: 500,
  fontSize: "0.9rem",
  padding: "4px 0",
  borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
  textDecoration: "none",
  transition: "color 0.2s",
  flexShrink: 0,
});

const badge = {
  background: "linear-gradient(135deg, #0ea5e9, #7c3aed)",
  color: "#fff",
  fontSize: "0.65rem",
  fontWeight: 700,
  padding: "2px 6px",
  borderRadius: "99px",
  flexShrink: 0,
};

export default function Layout() {
  return (
    <>
      <nav style={nav}>
        <span style={logo}>⚡ AgentPay</span>
        <NavLink to="/" style={link}>Marketplace</NavLink>
        <NavLink to="/dashboard" style={link}>Dashboard</NavLink>
        <NavLink to="/about" style={link}>About</NavLink>
        <span style={badge}>x402 · XRPL</span>
      </nav>
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <Outlet />
      </main>
    </>
  );
}
