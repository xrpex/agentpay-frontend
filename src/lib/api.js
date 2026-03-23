// src/lib/api.js
const BASE = import.meta.env.VITE_BACKEND_URL ?? "https://agentpay-backend-production.up.railway.app";
const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ── Free tools — open source, no payment required ─────────────────────────────
export const FREE_TOOLS = [
  {
    id: "web-scraper",
    name: "Web Scraper",
    description: "Returns clean Markdown text from any public URL. Pass ?url= in query string.",
    category: "Data",
    icon: "🌐",
    method: "GET",
    path: "/tools/web-scraper",
    free: true,
    github: "https://github.com/xrpex/agentpay-backend",
    deploy_script: `# Web Scraper — One-script deploy
# Requires: Node.js 18+, Express

npm install express node-fetch dotenv cors

# Create scraper.js:
cat > scraper.js << 'EOF'
import express from "express";
import fetch from "node-fetch";
const app = express();
app.get("/scrape", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "?url= required" });
  const r = await fetch(decodeURIComponent(url));
  const html = await r.text();
  const text = html.replace(/<[^>]+>/g," ").replace(/\\s{2,}/g,"\\n").trim().slice(0,8000);
  res.json({ url, chars: text.length, content: text });
});
app.listen(3000, () => console.log("Scraper running on :3000"));
EOF

node scraper.js`,
    example_request: `curl "https://agentpay-backend-production.up.railway.app/tools/web-scraper?url=https://example.com"`,
    example_response: `{ "url": "https://example.com", "chars": 1256, "content": "Example Domain..." }`,
  },
  {
    id: "price-oracle",
    name: "XRP Price Oracle",
    description: "Returns live XRP/USD, XRP/BTC, XRP/EUR prices from CoinGecko.",
    category: "Finance",
    icon: "📈",
    method: "GET",
    path: "/tools/price-oracle",
    free: true,
    github: "https://github.com/xrpex/agentpay-backend",
    deploy_script: `# XRP Price Oracle — One-script deploy
# Requires: Node.js 18+

npm install express node-fetch

cat > price-oracle.js << 'EOF'
import express from "express";
import fetch from "node-fetch";
const app = express();
app.get("/price", async (_req, res) => {
  const r = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd,btc,eur"
  );
  const data = await r.json();
  res.json({ XRP: data.ripple, timestamp: new Date().toISOString() });
});
app.listen(3001, () => console.log("Price oracle on :3001"));
EOF

node price-oracle.js`,
    example_request: `curl "https://agentpay-backend-production.up.railway.app/tools/price-oracle"`,
    example_response: `{ "XRP": { "usd": 2.14, "btc": 0.000023, "eur": 1.97 }, "timestamp": "2026-03-23T..." }`,
  },
  {
    id: "ai-summarizer",
    name: "AI Summarizer",
    description: "Summarizes any text in 3 sentences. POST body { text }. Powered by Claude API.",
    category: "AI",
    icon: "🤖",
    method: "POST",
    path: "/tools/ai-summarizer",
    free: true,
    github: "https://github.com/xrpex/agentpay-backend",
    deploy_script: `# AI Summarizer — One-script deploy
# Requires: Node.js 18+, Anthropic API key

npm install express

cat > summarizer.js << 'EOF'
import express from "express";
const app = express();
app.use(express.json());
app.post("/summarize", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "POST { text } required" });
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [{ role: "user", content: "Summarize in 3 sentences:\\n\\n" + text.slice(0,4000) }],
    }),
  });
  const data = await r.json();
  res.json({ summary: data.content?.[0]?.text });
});
app.listen(3002, () => console.log("Summarizer on :3002"));
EOF

ANTHROPIC_API_KEY=your-key node summarizer.js`,
    example_request: `curl -X POST "https://agentpay-backend-production.up.railway.app/tools/ai-summarizer" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Your long text here..."}'`,
    example_response: `{ "summary": "Three sentence summary of your text.", "method": "claude" }`,
  },
  {
    id: "defi-feed",
    name: "XRPL DeFi Feed",
    description: "Returns top XRPL AMM pool snapshot with trading pairs and fees.",
    category: "Finance",
    icon: "💹",
    method: "GET",
    path: "/tools/defi-feed",
    free: true,
    github: "https://github.com/xrpex/agentpay-backend",
    deploy_script: `# XRPL DeFi Feed — One-script deploy
# Requires: Node.js 18+

npm install express node-fetch

cat > defi-feed.js << 'EOF'
import express from "express";
import fetch from "node-fetch";
const app = express();
app.get("/defi", async (_req, res) => {
  const r = await fetch("https://api.xrpscan.com/api/v1/amm/pools?limit=10");
  const data = await r.json();
  const pools = (Array.isArray(data) ? data : []).slice(0,10).map(p => ({
    asset1: p.Asset?.currency ?? "XRP",
    asset2: p.Asset2?.currency ?? "XRP",
    trading_fee: p.TradingFee,
  }));
  res.json({ pools, timestamp: new Date().toISOString() });
});
app.listen(3003, () => console.log("DeFi feed on :3003"));
EOF

node defi-feed.js`,
    example_request: `curl "https://agentpay-backend-production.up.railway.app/tools/defi-feed"`,
    example_response: `{ "pools": [{ "asset1": "XRP", "asset2": "USDT", "trading_fee": 500 }], "timestamp": "..." }`,
  },
  {
    id: "code-executor",
    name: "Code Executor",
    description: "Safely runs a Python snippet. POST body { code }. Returns stdout/stderr.",
    category: "Dev",
    icon: "⚡",
    method: "POST",
    path: "/tools/code-executor",
    free: true,
    github: "https://github.com/xrpex/agentpay-backend",
    deploy_script: `# Code Executor — One-script deploy
# Uses Piston public sandbox API (no API key needed)

npm install express node-fetch

cat > executor.js << 'EOF'
import express from "express";
import fetch from "node-fetch";
const app = express();
app.use(express.json());
app.post("/execute", async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "POST { code } required" });
  const r = await fetch("https://emkc.org/api/v2/piston/execute", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      language: "python", version: "3.10",
      files: [{ content: code }], stdin: "",
    }),
  });
  const data = await r.json();
  res.json({ stdout: data.run?.stdout, stderr: data.run?.stderr });
});
app.listen(3004, () => console.log("Executor on :3004"));
EOF

node executor.js`,
    example_request: `curl -X POST "https://agentpay-backend-production.up.railway.app/tools/code-executor" \\
  -H "Content-Type: application/json" \\
  -d '{"code": "print(42)"}'`,
    example_response: `{ "stdout": "42\\n", "stderr": "" }`,
  },
];

// ── Paid tools — fetched from Supabase (admin-managed) ────────────────────────
export async function fetchPaidTools() {
  if (SUPABASE_URL && SUPABASE_ANON) {
    try {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/paid_tools?order=created_at.desc&active=eq.true`,
        { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` } }
      );
      if (r.ok) return r.json();
    } catch {}
  }
  return []; // no paid tools if Supabase not configured
}

// ── Legacy — kept for backend registry fetch ──────────────────────────────────
export async function fetchTools() {
  try {
    const r = await fetch(`${BASE}/tools`);
    if (r.ok) return r.json();
  } catch {}
  return FREE_TOOLS;
}

export async function fetchStats() {
  return { total_calls: 0, total_xrp_earned: 0, unique_agents: 0, top_tool: "—" };
}
