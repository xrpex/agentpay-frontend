import React, { useState } from "react";

const S = {
  section: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "1.5rem",
    marginBottom: "1.25rem",
  },
  h2: {
    fontSize: "1rem",
    fontWeight: 700,
    marginBottom: "0.75rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
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
  badge: {
    display: "inline-block",
    background: "rgba(6,182,212,0.1)",
    border: "1px solid rgba(6,182,212,0.3)",
    color: "#06b6d4",
    fontSize: "0.7rem",
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: "99px",
    marginLeft: "0.5rem",
    verticalAlign: "middle",
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
};

function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderBottom: "1px solid var(--border)",
      padding: "0.75rem 0",
    }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <span style={{ fontSize: "0.88rem", fontWeight: 500 }}>{q}</span>
        <span style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <p style={{ ...S.p, marginTop: "0.5rem", marginBottom: 0 }}>{a}</p>
      )}
    </div>
  );
}

export default function AboutPage() {
  return (
    <div style={{ maxWidth: "720px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.4rem" }}>About AgentPay</h1>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
          Transparency about who we are, what we offer, how payments work, and how to get help.
        </p>
      </div>

      {/* ── Project Identity ── */}
      <div style={S.section}>
        <h2 style={S.h2}>⚡ What is AgentPay?</h2>
        <p style={S.p}>
          AgentPay is an <strong style={{ color: "var(--text)" }}>independent open-source marketplace</strong> that
          offers a pay-per-call AI tools and skills on the XRP Ledger using the x402 payment protocol.
        </p>
        <p style={S.p}>
          We offer both <strong style={{ color: "var(--text)" }}>free open-source tools</strong> you can self-host
          and <strong style={{ color: "var(--text)" }}>premium paid tools</strong> that operate on a pay-per-call
          basis with no subscriptions or API keys required.
        </p>
        <p style={S.p}>
          It is <strong style={{ color: "var(--text)" }}>not affiliated with, endorsed by, or operated by
          Ripple Labs, the XRP Ledger Foundation, or any other organization.</strong>
        </p>
      </div>

      {/* ── What We Offer ── */}
      <div style={S.section}>
        <h2 style={S.h2}>🛠️ What We Offer</h2>
        
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
            FREE & OPEN SOURCE TOOLS
          </div>
          <p style={S.p}>
            Community-maintained tools you can deploy to your own AI agent with one script.
            No payment required — call hosted endpoints directly or self-host.
          </p>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "0.75rem" }}>
            PREMIUM PAID TOOLS — PAY PER CALL
          </div>
          <p style={S.p}>
            Verified provider tools with instant XRP settlement on the XRPL via x402 protocol.
            No API keys needed — cryptographic payment proofs are your credentials.
          </p>
          
          <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.75rem" }}>
            {[
              { name: "Web Scraper", price: "0.01", desc: "Extract content from any URL", drops: "10,000" },
              { name: "Price Oracle", price: "0.005", desc: "Real-time XRP/USD price feed", drops: "5,000" },
              { name: "AI Summarizer", price: "0.02", desc: "Summarize long-form content", drops: "20,000" },
              { name: "DeFi Data", price: "0.01", desc: "DeFi protocol analytics & data", drops: "10,000" },
              { name: "Codex Search", price: "0.03", desc: "Code & documentation search", drops: "30,000" },
            ].map((tool) => (
              <div key={tool.name} style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "var(--bg2)",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                border: "1px solid var(--border)",
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text)" }}>{tool.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{tool.desc}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#f59e0b" }}>{tool.price} XRP</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{tool.drops} drops</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(34,197,94,0.05)", borderRadius: "8px", border: "1px solid rgba(34,197,94,0.2)" }}>
          <p style={{ ...S.p, marginBottom: 0, fontSize: "0.82rem" }}>
            <strong style={{ color: "#22c55e" }}>💡 Developer?</strong> You can list your own paid tools via our{" "}
            <a href="/list-tool" style={S.link}>List Your Tool</a> page and earn XRP per call.
            Listing fees start at 5 XRP with 3-8% transaction fees.
          </p>
        </div>
      </div>

      {/* ── t54 Relationship ── */}
      <div style={S.section}>
        <h2 style={S.h2}>
          🔗 Relationship to t54 Labs
          <span style={S.badge}>Third-party integration</span>
        </h2>
        <p style={S.p}>
          AgentPay uses the <strong style={{ color: "var(--text)" }}>XRPL x402 facilitator</strong> operated
          by <a href="https://xrpl-x402.t54.ai" target="_blank" rel="noreferrer" style={S.link}>t54 Labs</a> to
          verify and settle on-chain payments. This is an <strong style={{ color: "var(--text)" }}>official
          public product</strong> by t54 Labs — AgentPay integrates it as a third-party service, the same way
          an app might use Stripe for payments.
        </p>
        <p style={S.p}>
          t54 Labs operates the facilitator at <code style={{ background: "var(--bg3)", padding: "1px 5px", borderRadius: "4px", fontSize: "0.82em" }}>xrpl-x402.t54.ai</code>.
          AgentPay does not control, modify, or own that infrastructure.
        </p>
        <div style={{ marginTop: "0.75rem" }}>
          <a href="https://xrpl-x402.t54.ai/docs" target="_blank" rel="noreferrer" style={S.pill("#0ea5e9")}>
            📄 t54 x402 Docs ↗
          </a>
          <a href="https://xrpl-x402.t54.ai" target="_blank" rel="noreferrer" style={S.pill("#06b6d4")}>
            🌐 t54 Labs ↗
          </a>
        </div>
      </div>

      {/* ── Support ── */}
      <div style={S.section}>
        <h2 style={S.h2}>💬 Support</h2>
        <p style={S.p}>
          Need help? We respond to all support requests within 24 hours.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
          <a href="mailto:officialagentpay@gmail.com" style={S.pill("#22c55e")}>
            ✉️ officialagentpay@gmail.com
          </a>
          <a href="https://github.com/xrpex/agentpay-backend/issues" target="_blank" rel="noreferrer" style={S.pill("#8b5cf6")}>
            🐛 GitHub Issues ↗
          </a>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: "1rem" }}>
          <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 700, letterSpacing: "0.08em", marginBottom: "0.5rem" }}>
            FREQUENTLY ASKED QUESTIONS
          </div>
          <AccordionItem
            q="Which wallets can I use to pay for tools?"
            a="Any XRPL-compatible wallet that can sign and submit Payment transactions. Tools currently accept XRP on XRPL Testnet (xrpl:0) and Mainnet (xrpl:1)."
          />
          <AccordionItem
            q="Why did my payment go through but the tool returned an error?"
            a="Tool errors after payment are logged. Email officialagentpay@gmail.com with the transaction hash and timestamp — we will investigate and issue a refund if the error was on our side."
          />
          <AccordionItem
            q="Is my wallet address stored?"
            a="Agent wallet addresses are logged in our Supabase database for usage tracking and dispute resolution. No private keys or seeds are ever transmitted or stored."
          />
          <AccordionItem
            q="Can I run AgentPay Tools on any AI?"
            a="Yes , A one script deploy is provided with instruction on how you can self-host and set-up."
          />
          <AccordionItem
            q="How do I list my own tool?"
            a="Visit our List Your Tool page to submit your tool for review. You'll pay a one-time listing fee (5-50 XRP) and we take 3-8% per transaction depending on your tier."
          />
        </div>
      </div>

      {/* ── Dispute Resolution ── */}
      <div style={S.section}>
        <h2 style={S.h2}>⚖️ Dispute Resolution & Refund Policy</h2>
        <p style={S.p}>
          XRP transactions on the XRPL are <strong style={{ color: "var(--text)" }}>irreversible by design</strong> —
          we cannot reverse on-chain payments. However, we can issue equivalent refunds under the following conditions:
        </p>

        <div style={{ display: "grid", gap: "0.75rem", marginBottom: "1rem" }}>
          {[
            { icon: "✅", title: "Eligible for refund", color: "#22c55e", items: [
              "Tool returned a server error (5xx) after payment was accepted",
              "Payment was charged twice for the same request",
              "Tool was unavailable for more than 10 minutes after payment",
            ]},
            { icon: "❌", title: "Not eligible for refund", color: "#ef4444", items: [
              "Tool executed successfully but result was not what you expected",
              "Third-party API the tool depends on returned bad data",
              "Payment sent to wrong address due to user error",
            ]},
          ].map((block) => (
            <div key={block.title} style={{
              background: "var(--bg2)", borderRadius: "8px", padding: "0.75rem 1rem",
              border: `1px solid ${block.color}30`,
            }}>
              <div style={{ fontWeight: 600, fontSize: "0.82rem", color: block.color, marginBottom: "0.5rem" }}>
                {block.icon} {block.title}
              </div>
              <ul style={{ paddingLeft: "1.1rem", margin: 0 }}>
                {block.items.map((item, i) => (
                  <li key={i} style={{ color: "var(--muted)", fontSize: "0.82rem", lineHeight: 1.6 }}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p style={S.p}>
          To open a dispute, email <a href="mailto:officialagentpay@gmail.com" style={S.link}>officialagentpay@gmail.com</a> with
          your <strong style={{ color: "var(--text)" }}>XRPL transaction hash</strong>, the tool called, and
          the timestamp. We aim to resolve all disputes within 48 hours.
        </p>
      </div>

      {/* ── Legal ── */}
      <div style={{ ...S.section, background: "var(--bg2)" }}>
        <h2 style={S.h2}>📋 Legal</h2>
        <p style={S.p}>
          AgentPay is provided <strong style={{ color: "var(--text)" }}>"as is"</strong> without warranty.
          By using the service you accept that XRP payments are irreversible and that tool availability
          is not guaranteed. This service does not constitute financial advice.
        </p>
        <p style={{ ...S.p, marginBottom: 0 }}>
          © 2026 AgentPay · Independent project ·{" "}
          <a href="mailto:officialagentpay@gmail.com" style={S.link}>officialagentpay@gmail.com</a>
        </p>
      </div>
    </div>
  );
}
