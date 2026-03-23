import React, { useState, useEffect } from "react";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? "agentpay2026";
const SESSION_KEY = "agentpay_admin_auth";
const SESSION_TTL = 1000 * 60 * 60 * 8; // 8 hours

export default function AdminGuard({ children }) {
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  // Check existing session on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const { ts } = JSON.parse(raw);
        if (Date.now() - ts < SESSION_TTL) {
          setAuthed(true);
        } else {
          sessionStorage.removeItem(SESSION_KEY);
        }
      }
    } catch {}
  }, []);

  // Lockout countdown
  useEffect(() => {
    if (!locked) return;
    if (lockTimer <= 0) { setLocked(false); return; }
    const t = setTimeout(() => setLockTimer((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [locked, lockTimer]);

  function handleLogin() {
    if (locked) return;
    if (input === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ts: Date.now() }));
      setAuthed(true);
      setError("");
    } else {
      const next = attempts + 1;
      setAttempts(next);
      setInput("");
      if (next >= 5) {
        setLocked(true);
        setLockTimer(30);
        setError("Too many attempts. Locked for 30 seconds.");
      } else {
        setError(`Incorrect password. ${5 - next} attempt${5 - next !== 1 ? "s" : ""} remaining.`);
      }
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
    setInput("");
  }

  if (authed) {
    return (
      <>
        <div style={{
          display: "flex", justifyContent: "flex-end", marginBottom: "1rem",
        }}>
          <button
            onClick={handleLogout}
            style={{
              background: "var(--bg2)", border: "1px solid var(--border)",
              color: "var(--muted)", fontSize: "0.78rem", padding: "5px 12px",
              borderRadius: "6px", cursor: "pointer", fontWeight: 500,
            }}
          >
            🔒 Lock Dashboard
          </button>
        </div>
        {children}
      </>
    );
  }

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "60vh",
    }}>
      <div style={{
        background: "var(--card)", border: "1px solid var(--border)",
        borderRadius: "16px", padding: "2.5rem 2rem", width: "100%", maxWidth: "360px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Top accent */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "2px",
          background: "linear-gradient(90deg, #0ea5e9, #7c3aed)",
        }} />

        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🔐</div>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.25rem" }}>
            Admin Dashboard
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
            Enter password to access earnings data
          </p>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Admin password"
            disabled={locked}
            autoFocus
            style={{
              width: "100%", background: "var(--bg3)",
              border: `1px solid ${error ? "var(--red)" : "var(--border)"}`,
              borderRadius: "8px", padding: "0.7rem 1rem",
              color: "var(--text)", fontSize: "0.9rem",
              outline: "none", boxSizing: "border-box",
            }}
          />
        </div>

        {error && (
          <div style={{
            background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.3)",
            borderRadius: "6px", padding: "0.5rem 0.75rem",
            color: "#f43f5e", fontSize: "0.78rem", marginBottom: "1rem",
          }}>
            {locked ? `🔒 ${lockTimer}s remaining` : `⚠️ ${error}`}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={locked}
          style={{
            width: "100%",
            background: locked ? "var(--border)" : "linear-gradient(135deg, #0ea5e9, #7c3aed)",
            color: "#fff", border: "none", borderRadius: "8px",
            padding: "0.7rem", fontWeight: 600, fontSize: "0.9rem",
            cursor: locked ? "not-allowed" : "pointer",
          }}
        >
          {locked ? `Locked (${lockTimer}s)` : "Unlock Dashboard"}
        </button>

        <p style={{
          color: "var(--muted)", fontSize: "0.72rem", textAlign: "center",
          marginTop: "1rem", marginBottom: 0,
        }}>
          Session expires after 8 hours of inactivity
        </p>
      </div>
    </div>
  );
}
