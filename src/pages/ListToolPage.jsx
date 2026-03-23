import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const S = {
  section: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "1.5rem",
    marginBottom: "1.25rem",
  },
  h2: {
    fontSize: "1.1rem",
    fontWeight: 700,
    marginBottom: "0.75rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  h3: {
    fontSize: "0.95rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
    color: "var(--text)",
  },
  p: {
    color: "var(--muted)",
    fontSize: "0.88rem",
    lineHeight: 1.7,
    marginBottom: "0.6rem",
  },
  link: {
    color: "var(--accent)",
    textDecoration: "none",
    fontWeight: 500,
  },
  pill: (color) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    background: `${color}15`,
    border: `1px solid ${color}40`,
    color,
    fontSize: "0.78rem",
    fontWeight: 600,
    padding: "5px 12px",
    borderRadius: "8px",
    textDecoration: "none",
    marginRight: "0.5rem",
    marginBottom: "0.5rem",
  }),
  tierCard: (selected) => ({
    background: selected ? "rgba(124, 58, 237, 0.1)" : "var(--bg2)",
    border: selected ? "2px solid #7c3aed" : "1px solid var(--border)",
    borderRadius: "12px",
    padding: "1.25rem",
    cursor: "pointer",
    transition: "all 0.2s",
    flex: 1,
    minWidth: "200px",
  }),
};

const CATEGORIES = ["AI", "Data", "Finance", "Dev", "Other"];
const METHODS = ["GET", "POST", "PUT", "DELETE"];

const EMPTY_TOOL = {
  id: "",
  name: "",
  description: "",
  category: "AI",
  icon: "🔧",
  method: "GET",
  path: "",
  price_drops: "10000",
  endpoint_url: "",
  deploy_script: "",
  example_request: "",
  example_response: "",
  github: "",
  docs_url: "",
  provider: "",
  provider_email: "",
};

export default function ListToolPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...EMPTY_TOOL });
  const [selectedTier, setSelectedTier] = useState("standard");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const tiers = {
    basic: {
      name: "Basic",
      price: "5 XRP",
      listingFee: 5,
      transactionFee: "8%",
      features: ["Standard listing", "Basic analytics", "Community support"],
      color: "#64748b",
    },
    standard: {
      name: "Standard",
      price: "10 XRP",
      listingFee: 10,
      transactionFee: "5%",
      features: ["Priority placement", "Advanced analytics", "Email support", "Verified badge"],
      color: "#7c3aed",
      recommended: true,
    },
    featured: {
      name: "Featured",
      price: "50 XRP",
      listingFee: 50,
      transactionFee: "3%",
      features: ["Homepage featured", "Priority placement", "Advanced analytics", "Priority support", "Verified badge"],
      color: "#f59e0b",
    },
  };

  function validate() {
    const e = {};
    if (!form.id.trim()) e.id = "Required - unique tool identifier";
    if (!form.name.trim()) e.name = "Required - display name";
    if (!form.description.trim()) e.description = "Required - what does your tool do?";
    if (!form.path.trim()) e.path = "Required - e.g. /tools/my-tool";
    if (!form.endpoint_url.trim()) e.endpoint_url = "Required - your server URL";
    if (!form.provider.trim()) e.provider = "Required - your name or org";
    if (!form.provider_email.trim()) e.provider_email = "Required - for verification";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);

    // Simulate API call - in production this would hit your backend
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Store submission (in production, save to Supabase with pending_payment status)
    const submission = {
      ...form,
      tier: selectedTier,
      listing_fee_xrp: tiers[selectedTier].listingFee,
      transaction_fee_percent: parseInt(tiers[selectedTier].transactionFee),
      status: "pending_payment",
      submitted_at: new Date().toISOString(),
    };

    console.log("Tool submission:", submission);
    setSubmitted(true);
    setSubmitting(false);
  }

  const Field = ({ label, k, placeholder, textarea, required, type = "text" }) => (
    <div style={{ marginBottom: "0.85rem" }}>
      <label
        style={{
          fontSize: "0.72rem",
          fontWeight: 700,
          color: "var(--muted)",
          display: "block",
          marginBottom: "4px",
          textTransform: "uppercase",
          letterSpacing: ".06em",
        }}
      >
        {label}
        {required && <span style={{ color: "#ef4444" }}> *</span>}
      </label>
      {textarea ? (
        <textarea
          value={form[k]}
          onChange={(e) => set(k, e.target.value)}
          placeholder={placeholder}
          rows={4}
          style={{
            background: "var(--bg3)",
            border: `1px solid ${errors[k] ? "var(--red)" : "var(--border)"}`,
            borderRadius: "8px",
            padding: "8px 12px",
            color: "var(--text)",
            fontSize: "0.85rem",
            width: "100%",
            boxSizing: "border-box",
            resize: "vertical",
            fontFamily: k.includes("script") || k.includes("request") || k.includes("response") ? "JetBrains Mono,monospace" : "inherit",
          }}
        />
      ) : (
        <input
          type={type}
          value={form[k]}
          onChange={(e) => set(k, e.target.value)}
          placeholder={placeholder}
          style={{
            background: "var(--bg3)",
            border: `1px solid ${errors[k] ? "var(--red)" : "var(--border)"}`,
            borderRadius: "8px",
            padding: "8px 12px",
            color: "var(--text)",
            fontSize: "0.85rem",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
      )}
      {errors[k] && (
        <div style={{ color: "#ef4444", fontSize: "0.72rem", marginTop: "3px" }}>
          ⚠️ {errors[k]}
        </div>
      )}
    </div>
  );

  if (submitted) {
    return (
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <div
          style={{
            ...S.section,
            textAlign: "center",
            padding: "3rem 2rem",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
          <h2 style={{ ...S.h2, justifyContent: "center", fontSize: "1.5rem" }}>
            Tool Submitted!
          </h2>
          <p style={S.p}>
            Your tool <strong>{form.name}</strong> has been submitted for review.
          </p>
          <p style={S.p}>
            To complete listing, send <strong>{tiers[selectedTier].listingFee} XRP</strong> to the
            address provided in your confirmation email.
          </p>
          <div
            style={{
              background: "var(--bg2)",
              borderRadius: "8px",
              padding: "1rem",
              margin: "1.5rem 0",
              fontFamily: "JetBrains Mono,monospace",
              fontSize: "0.85rem",
            }}
          >
            <div style={{ color: "var(--muted)", fontSize: "0.75rem", marginBottom: "0.5rem" }}>
              LISTING FEE
            </div>
            <div style={{ color: "#22c55e", fontWeight: 700, fontSize: "1.2rem" }}>
              {tiers[selectedTier].listingFee} XRP
            </div>
            <div style={{ color: "var(--muted)", fontSize: "0.75rem", marginTop: "0.5rem" }}>
              + {tiers[selectedTier].transactionFee} transaction fee on all sales
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "linear-gradient(135deg,#0ea5e9,#7c3aed)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
            }}
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
            fontWeight: 800,
            marginBottom: "0.75rem",
            background: "linear-gradient(135deg,#e2e8f0 30%,#0ea5e9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          List Your Tool
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.95rem", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
          Monetize your AI tools on the AgentPay marketplace. Set your price per call,
          keep 92-97% of revenue, and get paid instantly in XRP.
        </p>
      </div>

      {/* Pricing Tiers */}
      <div style={S.section}>
        <h2 style={S.h2}>💰 Choose Your Tier</h2>
        <p style={S.p}>
          One-time listing fee + small transaction fee on each paid call. No monthly charges.
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
          {Object.entries(tiers).map(([key, tier]) => (
            <div
              key={key}
              onClick={() => setSelectedTier(key)}
              style={S.tierCard(selectedTier === key)}
            >
              {tier.recommended && (
                <div
                  style={{
                    background: "linear-gradient(135deg,#0ea5e9,#7c3aed)",
                    color: "#fff",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "99px",
                    display: "inline-block",
                    marginBottom: "0.5rem",
                  }}
                >
                  RECOMMENDED
                </div>
              )}
              <div
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: tier.color,
                  marginBottom: "0.25rem",
                }}
              >
                {tier.name}
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 800,
                  color: "var(--text)",
                  marginBottom: "0.5rem",
                }}
              >
                {tier.price}
              </div>
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--muted)",
                  marginBottom: "1rem",
                }}
              >
                + {tier.transactionFee} per transaction
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  fontSize: "0.82rem",
                  color: "var(--muted)",
                }}
              >
                {tier.features.map((f, i) => (
                  <li key={i} style={{ marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <span style={{ color: "#22c55e" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Tool Form */}
      <div style={S.section}>
        <h2 style={S.h2}>🛠️ Tool Details</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
          <Field label="Tool ID" k="id" placeholder="my-ai-tool" required />
          <Field label="Display Icon" k="icon" placeholder="🔧" />
        </div>

        <Field label="Tool Name" k="name" placeholder="My AI Tool" required />
        <Field
          label="Description"
          k="description"
          placeholder="What does your tool do? Be specific about capabilities and use cases."
          required
          textarea
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
          <div style={{ marginBottom: "0.85rem" }}>
            <label
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "var(--muted)",
                display: "block",
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: ".06em",
              }}
            >
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              style={{
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "8px 12px",
                color: "var(--text)",
                fontSize: "0.85rem",
                width: "100%",
                cursor: "pointer",
              }}
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "0.85rem" }}>
            <label
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: "var(--muted)",
                display: "block",
                marginBottom: "4px",
                textTransform: "uppercase",
                letterSpacing: ".06em",
              }}
            >
              HTTP Method
            </label>
            <select
              value={form.method}
              onChange={(e) => set("method", e.target.value)}
              style={{
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "8px 12px",
                color: "var(--text)",
                fontSize: "0.85rem",
                width: "100%",
                cursor: "pointer",
              }}
            >
              {METHODS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
          <Field label="API Path" k="path" placeholder="/tools/my-tool" required />
          <Field
            label="Price per Call (drops)"
            k="price_drops"
            placeholder="10000"
            type="number"
          />
        </div>
        <div
          style={{
            background: "rgba(245, 158, 11, 0.05)",
            borderRadius: "6px",
            padding: "0.5rem 0.75rem",
            marginBottom: "1rem",
            fontSize: "0.75rem",
            color: "var(--muted)",
          }}
        >
          💡 10,000 drops = 0.01 XRP (~$0.006). You keep 92-97% after platform fees.
        </div>

        <Field
          label="Endpoint URL"
          k="endpoint_url"
          placeholder="https://your-server.com/tools/my-tool"
          required
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
          <Field label="Your Name / Org" k="provider" placeholder="Acme AI" required />
          <Field
            label="Contact Email"
            k="provider_email"
            placeholder="you@example.com"
            required
            type="email"
          />
        </div>

        <Field label="GitHub Repository" k="github" placeholder="https://github.com/..." />
        <Field label="Documentation URL" k="docs_url" placeholder="https://docs.example.com" />

        <Field
          label="Deploy Script (optional)"
          k="deploy_script"
          placeholder="# One-command deploy for self-hosters
docker run -p 8080:8080 your-image"
          textarea
        />

        <Field
          label="Example Request"
          k="example_request"
          placeholder="curl -X POST https://api.example.com/tools/my-tool \\
  -H 'Content-Type: application/json' \\
  -d '{\"input\": \"test\"}'"
          textarea
        />

        <Field
          label="Example Response"
          k="example_response"
          placeholder='{
  "result": "processed",
  "output": "..."
}'
          textarea
        />
      </div>

      {/* Submit Section */}
      <div style={S.section}>
        <h2 style={S.h2}>🚀 Submit for Review</h2>
        <p style={S.p}>
          Your tool will be reviewed within 24 hours. Upon approval, you'll receive
          payment instructions for the {tiers[selectedTier].listingFee} XRP listing fee.
        </p>

        <div
          style={{
            background: "var(--bg2)",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Listing Fee</span>
            <span style={{ fontWeight: 700, color: "var(--text)" }}>
              {tiers[selectedTier].listingFee} XRP
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
              Transaction Fee
            </span>
            <span style={{ fontWeight: 700, color: "var(--text)" }}>
              {tiers[selectedTier].transactionFee}
            </span>
          </div>
          <div
            style={{
              borderTop: "1px solid var(--border)",
              marginTop: "0.5rem",
              paddingTop: "0.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
              You Earn (per 0.01 XRP call)
            </span>
            <span style={{ fontWeight: 700, color: "#22c55e" }}>
              ~{(0.01 * (1 - parseInt(tiers[selectedTier].transactionFee) / 100)).toFixed(4)} XRP
            </span>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            background: submitting
              ? "var(--bg3)"
              : "linear-gradient(135deg,#0ea5e9,#7c3aed)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "12px 24px",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: submitting ? "not-allowed" : "pointer",
            width: "100%",
          }}
        >
          {submitting ? "Submitting..." : `Submit Tool — ${tiers[selectedTier].price}`}
        </button>

        <p
          style={{
            color: "var(--muted)",
            fontSize: "0.75rem",
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          By submitting, you agree to our{" "}
          <a href="/about" style={S.link}>
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/about" style={S.link}>
            Developer Agreement
          </a>
          .
        </p>
      </div>
    </div>
  );
}
