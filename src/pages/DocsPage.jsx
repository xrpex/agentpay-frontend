import React, { useState } from "react";

const CODE = {
  install_backend: `cd backend
npm install`,

  install_client: `cd agent-client
npm install`,

  env_backend: `XRPL_FACILITATOR_URL=https://xrpl-x402.t54.ai
XRPL_PAY_TO=rYourXRPLWalletAddressHere
XRPL_NETWORK=xrpl:0          # xrpl:0 = Testnet, xrpl:1 = Mainnet
PRICE_SCRAPER_DROPS=10000
PRICE_ORACLE_DROPS=5000
PRICE_SUMMARIZER_DROPS=20000
PRICE_DEFI_DROPS=10000
PRICE_CODEX_DROPS=30000
PORT=8080`,

  run_backend: `node src/server.js
# → 🚀 AgentPay listening on http://localhost:8080
# → Tool registry: http://localhost:8080/tools`,

  agent_ts: `import { x402Fetch } from "x402-xrpl";
import { Wallet } from "xrpl";
import dotenv from "dotenv";
dotenv.config();

const wallet = Wallet.fromSeed(process.env.XRPL_BUYER_SEED!);
const fetchPaid = x402Fetch({ wallet, network: "xrpl:0" });

// ── Discover tools ──────────────────────────────────────────────
const registry = await fetch("http://localhost:8080/tools").then(r => r.json());
console.log("Available tools:", registry.map((t: any) => t.id));

// ── Call Web Scraper ────────────────────────────────────────────
const scrape = await fetchPaid(
  "http://localhost:8080/tools/web-scraper?url=https://example.com"
);
const content = await scrape.json();
console.log("Scraped chars:", content.chars);

// ── Call Price Oracle ───────────────────────────────────────────
const price = await fetchPaid("http://localhost:8080/tools/price-oracle");
const priceData = await price.json();
console.log("XRP/USD:", priceData.XRP.usd);

// ── Call AI Summarizer ──────────────────────────────────────────
const summary = await fetchPaid(
  "http://localhost:8080/tools/ai-summarizer",
  {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: content.content.slice(0, 1000) }),
  }
);
console.log("Summary:", (await summary.json()).summary);`,

  supabase_sql: `-- Run this in your Supabase SQL editor
create table if not exists usage_logs (
  id          bigserial primary key,
  tool_id     text        not null,
  drops_paid  integer     not null,
  agent_wallet text       default 'anonymous',
  called_at   timestamptz default now()
);

-- Index for dashboard queries
create index on usage_logs (tool_id);
create index on usage_logs (called_at desc);

-- Row Level Security (optional — public read for dashboard)
alter table usage_logs enable row level security;
create policy "Allow anon read" on usage_logs for select using (true);`,

  add_tool: `// 1. Add entry to backend/src/tools/registry.js
{
  id: "my-new-tool",
  path: "/tools/my-new-tool",
  name: "My New Tool",
  description: "Does something useful for AI agents.",
  category: "Data",
  priceEnvKey: "PRICE_MY_TOOL_DROPS",
  defaultDrops: "15000",
  asset: "XRP",
  resource: "paid:my-new-tool",
  icon: "🔧",
}

// 2. Add handler in backend/src/tools/handlers.js
export async function myNewTool(req, res) {
  // your logic here
  res.json({ result: "data" });
}

// 3. Register in HANDLERS map in server.js
"my-new-tool": myNewTool,

// That's it — x402 payment middleware auto-wires! ✅`,
};

function CodeBlock({ code, lang = "bash" }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ position: "relative", marginBottom: "1.25rem" }}>
      <pre style={{
        background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: "10px",
        padding: "1rem 1.25rem", fontFamily: "JetBrains Mono, monospace",
        fontSize: "0.78rem", color: "#a5f3fc", overflowX: "auto", lineHeight: 1.7,
        whiteSpace: "pre-wrap",
      }}>{code}</pre>
      <button
        onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        style={{
          position: "absolute", top: "8px", right: "8px",
          background: copied ? "var(--green)" : "var(--border)",
          border: "none", borderRadius: "6px", color: "#fff",
          fontSize: "0.7rem", padding: "3px 8px", cursor: "pointer",
        }}
      >
        {copied ? "✓ Copied" : "Copy"}
      </button>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "2.5rem" }}>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem", color: "var(--accent)" }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

export default function DocsPage() {
  return (
    <div style={{ maxWidth: "800px" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.5rem" }}>Integration Guide</h1>
      <p style={{ color: "var(--muted)", marginBottom: "2.5rem", lineHeight: 1.6 }}>
        Everything you need to deploy AgentPay and connect AI agents to pay-per-call tools on XRPL.
      </p>

      <Section title="1 · Start the Backend">
        <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: "0.75rem" }}>Install dependencies and create your <code style={{ background: "var(--bg3)", padding: "1px 5px", borderRadius: "4px" }}>.env</code> from the example:</p>
        <CodeBlock code={CODE.install_backend} />
        <CodeBlock code={CODE.env_backend} />
        <CodeBlock code={CODE.run_backend} />
        <div style={{ background: "#f59e0b10", border: "1px solid #f59e0b40", borderRadius: "8px", padding: "0.75rem 1rem", fontSize: "0.82rem", color: "#f59e0b" }}>
          💡 Use <strong>xrpl:0</strong> (Testnet) during development — fund your buyer wallet free via the XRPL faucet at <a href="https://faucet.altnet.rippletest.net" target="_blank" rel="noreferrer">faucet.altnet.rippletest.net</a>
        </div>
      </Section>

      <Section title="2 · Set Up Supabase (Usage Logging)">
        <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: "0.75rem" }}>
          Create a free project at <a href="https://supabase.com" target="_blank" rel="noreferrer">supabase.com</a>, open the SQL editor, and run:
        </p>
        <CodeBlock code={CODE.supabase_sql} lang="sql" />
        <p style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
          Then add <code style={{ background: "var(--bg3)", padding: "1px 5px", borderRadius: "4px" }}>SUPABASE_URL</code> and <code style={{ background: "var(--bg3)", padding: "1px 5px", borderRadius: "4px" }}>SUPABASE_SERVICE_KEY</code> to your backend <code style={{ background: "var(--bg3)", padding: "1px 5px", borderRadius: "4px" }}>.env</code>.
        </p>
      </Section>

      <Section title="3 · Build an AI Agent Client">
        <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: "0.75rem" }}>
          The agent client uses <code style={{ background: "var(--bg3)", padding: "1px 5px", borderRadius: "4px" }}>x402Fetch</code> — a drop-in replacement for <code style={{ background: "var(--bg3)", padding: "1px 5px", borderRadius: "4px" }}>fetch</code> that handles the 402 payment flow automatically:
        </p>
        <CodeBlock code={CODE.install_client} />
        <CodeBlock code={CODE.agent_ts} lang="typescript" />
        <p style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
          The agent discovers available tools from <code style={{ background: "var(--bg3)", padding: "1px 5px", borderRadius: "4px" }}>/tools</code>, then calls and pays for each in a single round-trip. No API keys, no OAuth.
        </p>
      </Section>

      <Section title="4 · Add Your Own Tools">
        <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: "0.75rem" }}>
          Adding a new paid tool takes 3 steps — the x402 middleware auto-wires from the registry:
        </p>
        <CodeBlock code={CODE.add_tool} lang="javascript" />
      </Section>

      <Section title="5 · Payment Flow Diagram">
        <div style={{
          background: "var(--card)", border: "1px solid var(--border)", borderRadius: "10px",
          padding: "1.5rem", fontFamily: "JetBrains Mono, monospace", fontSize: "0.8rem", lineHeight: 2,
        }}>
          {[
            ["→", "Agent", "GET /tools/web-scraper", "var(--accent)"],
            ["←", "Server", "402 Payment Required + XRPL payment instructions", "var(--amber)"],
            ["→", "Agent", "signs XRPL Payment tx, retries with PAYMENT-SIGNATURE header", "var(--accent)"],
            ["↔", "Facilitator", "t54.ai verifies + settles tx on XRPL ledger", "#a855f7"],
            ["←", "Server", "200 OK + tool response payload", "#22c55e"],
          ].map(([arrow, from, msg, color], i) => (
            <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
              <span style={{ color, width: "16px", flexShrink: 0 }}>{arrow}</span>
              <span style={{ color: "var(--muted)", width: "90px", flexShrink: 0 }}>{from}</span>
              <span style={{ color }}>{msg}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="6 · Deploy to Production">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {[
            { platform: "Railway", cmd: "railway up", note: "Auto-detects Node.js, free tier available" },
            { platform: "Render", cmd: "git push", note: "Connect GitHub repo, free web service" },
            { platform: "Fly.io", cmd: "fly deploy", note: "Dockerfile included, global edge network" },
            { platform: "VPS", cmd: "pm2 start src/server.js", note: "PM2 for process management + nginx proxy" },
          ].map((p) => (
            <div key={p.platform} style={{
              background: "var(--bg2)", borderRadius: "8px", padding: "1rem",
              border: "1px solid var(--border)"
            }}>
              <div style={{ fontWeight: 700, marginBottom: "4px" }}>{p.platform}</div>
              <code style={{ fontSize: "0.78rem", color: "var(--accent)", background: "var(--bg3)", padding: "2px 6px", borderRadius: "4px", display: "block", marginBottom: "6px" }}>{p.cmd}</code>
              <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>{p.note}</div>
            </div>
          ))}
        </div>
      </Section>

      <div style={{
        background: "linear-gradient(135deg, #0ea5e920, #7c3aed20)",
        border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📚</div>
        <div style={{ fontWeight: 700, marginBottom: "0.4rem" }}>XRPL x402 Protocol Reference</div>
        <div style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>
          Full scheme spec, HTTP headers, payload format, and error codes.
        </div>
        <a href="https://xrpl-x402.t54.ai/docs" target="_blank" rel="noreferrer" style={{
          background: "linear-gradient(135deg, #0ea5e9, #7c3aed)", color: "#fff",
          padding: "8px 20px", borderRadius: "8px", fontWeight: 600, fontSize: "0.88rem",
          textDecoration: "none", display: "inline-block",
        }}>
          Open x402 Docs ↗
        </a>
      </div>
    </div>
  );
}
