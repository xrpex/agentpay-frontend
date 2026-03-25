import React, { useState, useEffect } from "react";
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
  step: (active, completed) => ({
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1rem",
    background: completed ? "rgba(34,197,94,0.1)" : active ? "rgba(124,58,237,0.05)" : "var(--bg2)",
    borderRadius: "8px",
    border: `1px solid ${completed ? "rgba(34,197,94,0.3)" : active ? "rgba(124,58,237,0.3)" : "var(--border)"}`,
    marginBottom: "0.75rem",
  }),
};

const CATEGORIES = ["AI", "Data", "Finance", "Dev", "Other"];
const METHODS = ["GET", "POST", "PUT", "DELETE"];

const DONATION_ADDRESS = import.meta.env.VITE_DONATION_ADDRESS || "rAgentPayDonationAddressXXXXXXXXXXXXXXXX";

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
  const [step, setStep] = useState(1); // 1: Select Tier, 2: Payment, 3: Tool Details, 4: Submit
  const [form, setForm] = useState({ ...EMPTY_TOOL });
  const [selectedTier, setSelectedTier] = useState("standard");
  const [paymentTx, setPaymentTx] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

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

  function copyAddress() {
    navigator.clipboard.writeText(DONATION_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function validateTool() {
    const e = {};
    if (!form.id.trim()) e.id = "Required - unique tool identifier";
    if (!form.name.trim()) e.name = "Required - display name";
    if (!form.description.trim()) e.description = "Required - what does your tool do?";
    if (!form.path.trim()) e.path = "Required - e.g. /tools/my-tool";
    if (!form.endpoint_url.trim()) e.endpoint_url = "Required - your server URL";
    if (!form.provider.trim()) e.provider = "Required - your name or org";
    if (!form.provider_email.trim()) e.provider_email = "Required - for verification";
    if (!paymentTx.trim()) e.paymentTx = "Required - enter your payment transaction hash";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validateTool()) return;
    setSubmitting(true);

    // Simulate API call - in production this would hit your backend
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Store submission with payment verification
    const submission = {
      ...form,
      tier: selectedTier,
      listing_fee_xrp: tiers[selectedTier].listingFee,
      transaction_fee_percent: parseInt(tiers[selectedTier].transactionFee),
      payment_tx_hash: paymentTx,
      payment_verified: false, // Admin will verify
      status: "pending_verification",
      submitted_at: new Date().toISOString(),
    };

    console.log("Tool submission:", submission);
    setSubmitted(true);
    setSubmitting(false);
  }

  const Field = ({ label, k, placeholder, textarea, required, type = "text", value, onChange }) => (
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
          value={value || form[k]}
          onChange={(e) => onChange ? onChange(e.target.value) : set(k, e.target.value)}
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
          value={value || form[k]}
          onChange={(e) => onChange ? onChange(e.target.value) : set(k, e.target.value)}
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
            Tool Submitted for Review!
          </h2>
          <p style={S.p}>
            Your tool <strong>{form.name}</strong> has been queued for listing.
          </p>
          <p style={S.p}>
            We will verify your payment of <strong>{tiers[selectedTier].listingFee} XRP</strong> and
            review your tool within 24 hours.
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
              PAYMENT TRANSACTION
            </div>
            <div style={{ color: "var(--accent)", fontWeight: 700, wordBreak: "break-all" }}>
              {paymentTx}
            </div>
            <div style={{ color: "var(--muted)", fontSize: "0.75rem", marginTop: "0.5rem" }}>
              Status: Pending Verification
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
          Support AgentPay's open-source development while listing your tool.
          100% of listing fees go to community-funded development.
        </p>
      </div>

      {/* Progress Steps */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={S.step(step === 1, step > 1)}>
          <div style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: step > 1 ? "#22c55e" : step === 1 ? "#7c3aed" : "var(--bg3)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.85rem",
            fontWeight: 700,
            flexShrink: 0,
          }}>
            {step > 1 ? "✓" : "1"}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Select Tier</div>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Choose your listing package</div>
          </div>
        </div>
        <div style={S.step(step === 2, step > 2)}>
          <div style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: step > 2 ? "#22c55e" : step === 2 ? "#7c3aed" : "var(--bg3)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.85rem",
            fontWeight: 700,
            flexShrink: 0,
          }}>
            {step > 2 ? "✓" : "2"}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Pay Listing Fee</div>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Support the project with XRP</div>
          </div>
        </div>
        <div style={S.step(step === 3, step > 3)}>
          <div style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: step > 3 ? "#22c55e" : step === 3 ? "#7c3aed" : "var(--bg3)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.85rem",
            fontWeight: 700,
            flexShrink: 0,
          }}>
            {step > 3 ? "✓" : "3"}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Tool Details</div>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>Describe your tool</div>
          </div>
        </div>
      </div>

      {/* Step 1: Select Tier */}
      {step === 1 && (
        <div style={S.section}>
          <h2 style={S.h2}>💰 Choose Your Tier</h2>
          <p style={S.p}>
            One-time listing fee supports AgentPay development. All fees go to community-funded improvements.
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
          <button
            onClick={() => setStep(2)}
            style={{
              background: "linear-gradient(135deg,#0ea5e9,#7c3aed)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              width: "100%",
              marginTop: "1.5rem",
            }}
          >
            Continue with {tiers[selectedTier].name} — {tiers[selectedTier].price}
          </button>
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 2 && (
        <div style={S.section}>
          <h2 style={S.h2}>💸 Pay Listing Fee</h2>
          <p style={S.p}>
            Send <strong>{tiers[selectedTier].listingFee} XRP</strong> to the AgentPay donation address.
            This supports open-source development and community infrastructure.
          </p>
          
          <div style={{
            background: "var(--bg2)",
            borderRadius: "12px",
            padding: "1.5rem",
            margin: "1.5rem 0",
            border: "1px solid var(--border)",
          }}>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              AgentPay Donation Address
            </div>
            <div style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}>
              <code style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                fontFamily: "JetBrains Mono,monospace",
                fontSize: "0.85rem",
                color: "var(--accent)",
                wordBreak: "break-all",
                flex: 1,
              }}>
                {DONATION_ADDRESS}
              </code>
              <button
                onClick={copyAddress}
                style={{
                  background: copied ? "#22c55e" : "var(--bg)",
                  border: "1px solid var(--border)",
                  color: copied ? "#fff" : "var(--muted)",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div style={{
            background: "rgba(245, 158, 11, 0.05)",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1.5rem",
            border: "1px solid rgba(245, 158, 11, 0.2)",
          }}>
            <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.5rem", color: "#f59e0b" }}>
              ⚠️ Important
            </div>
            <ul style={{ color: "var(--muted)", fontSize: "0.82rem", lineHeight: 1.6, paddingLeft: "1.1rem", margin: 0 }}>
              <li>Send exactly <strong>{tiers[selectedTier].listingFee} XRP</strong> (no more, no less)</li>
              <li>Use XRPL Mainnet or Testnet (specify in memo if testnet)</li>
              <li>Save your transaction hash — you'll need it in the next step</li>
              <li>Payments are donations to support AgentPay development</li>
            </ul>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={() => setStep(1)}
              style={{
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                color: "var(--muted)",
                borderRadius: "8px",
                padding: "12px 24px",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
              }}
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              style={{
                background: "linear-gradient(135deg,#0ea5e9,#7c3aed)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                flex: 1,
              }}
            >
              I've Sent the Payment →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Tool Details + Payment Verification */}
      {step === 3 && (
        <div>
          <div style={S.section}>
            <h2 style={S.h2}>🛠️ Tool Details</h2>

            <div style={{
              background: "rgba(34,197,94,0.05)",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1.5rem",
              border: "1px solid rgba(34,197,94,0.2)",
            }}>
              <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.5rem", color: "#22c55e" }}>
                ✅ Payment Step Complete
              </div>
              <p style={{ ...S.p, marginBottom: 0 }}>
                Selected: <strong>{tiers[selectedTier].name}</strong> ({tiers[selectedTier].price})
              </p>
            </div>

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
              placeholder={`curl -X POST https://api.example.com/tools/my-tool -H 'Content-Type: application/json' -d '{"input": "test"}'`}
              textarea
            />

            <Field
              label="Example Response"
              k="example_response"
              placeholder={`{
  "result": "processed",
  "output": "..."
}`}
              textarea
            />
          </div>

          {/* Payment Verification Section */}
          <div style={S.section}>
            <h2 style={S.h2}>✅ Verify Payment</h2>
            <p style={S.p}>
              Enter the XRPL transaction hash from your payment to verify listing fee submission.
            </p>

            <Field
              label="Transaction Hash"
              value={paymentTx}
              onChange={setPaymentTx}
              placeholder="0000000000000000000000000000000000000000000000000000000000000000"
              required
            />
            {errors.paymentTx && (
              <div style={{ color: "#ef4444", fontSize: "0.82rem", marginBottom: "1rem" }}>
                ⚠️ {errors.paymentTx}
              </div>
            )}

            <div style={{
              background: "var(--bg2)",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1.5rem",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Listing Fee</span>
                <span style={{ fontWeight: 700, color: "var(--text)" }}>{tiers[selectedTier].listingFee} XRP</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Transaction Fee</span>
                <span style={{ fontWeight: 700, color: "var(--text)" }}>{tiers[selectedTier].transactionFee}</span>
              </div>
              <div style={{ borderTop: "1px solid var(--border)", marginTop: "0.5rem", paddingTop: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>You Earn (per 0.01 XRP call)</span>
                <span style={{ fontWeight: 700, color: "#22c55e" }}>
                  ~{(0.01 * (1 - parseInt(tiers[selectedTier].transactionFee) / 100)).toFixed(4)} XRP
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={() => setStep(2)}
                style={{
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  color: "var(--muted)",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  background: submitting ? "var(--bg3)" : "linear-gradient(135deg,#0ea5e9,#7c3aed)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px 24px",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: submitting ? "not-allowed" : "pointer",
                  flex: 1,
                }}
              >
                {submitting ? "Submitting..." : `Submit Tool for Review`}
              </button>
            </div>

            <p style={{ color: "var(--muted)", fontSize: "0.75rem", textAlign: "center", marginTop: "1rem" }}>
              By submitting, you agree to our{" "}
              <a href="/about" style={S.link}>Terms of Service</a> and{" "}
              <a href="/about" style={S.link}>Developer Agreement</a>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
