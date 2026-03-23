import React, { useState, useEffect, useCallback } from "react";

// ── Auth ─────────────────────────────────────────────────────────────────────
const ADMIN_PW = import.meta.env.VITE_ADMIN_PASSWORD ?? "agentpay2026";
const SESSION_KEY = "agentpay_ap_auth";
const SESSION_TTL = 1000 * 60 * 60 * 8;

// ── Constants ─────────────────────────────────────────────────────────────────
const BASE = import.meta.env.VITE_BACKEND_URL ?? "https://agentpay-backend-production.up.railway.app";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;

const TOOL_ICONS = { "web-scraper":"🌐","price-oracle":"📈","ai-summarizer":"🤖","defi-feed":"💹","code-executor":"⚡" };
const TOOL_COLORS = { "web-scraper":"#0ea5e9","price-oracle":"#22c55e","ai-summarizer":"#a855f7","defi-feed":"#f59e0b","code-executor":"#ef4444" };

const MOCK_LOGS = [
  { id:1, tool_id:"web-scraper", drops_paid:10000, agent_wallet:"rAgent1xKGga", called_at:"2026-03-23T10:14:22Z" },
  { id:2, tool_id:"price-oracle", drops_paid:5000, agent_wallet:"rAgent2xYZab", called_at:"2026-03-23T10:13:01Z" },
  { id:3, tool_id:"ai-summarizer", drops_paid:20000, agent_wallet:"rAgent1xKGga", called_at:"2026-03-23T10:11:44Z" },
  { id:4, tool_id:"code-executor", drops_paid:30000, agent_wallet:"rAgent3xQRSt", called_at:"2026-03-23T10:09:15Z" },
  { id:5, tool_id:"defi-feed", drops_paid:10000, agent_wallet:"rAgent2xYZab", called_at:"2026-03-23T10:07:03Z" },
  { id:6, tool_id:"web-scraper", drops_paid:10000, agent_wallet:"rAgent4xLMNo", called_at:"2026-03-23T09:55:10Z" },
  { id:7, tool_id:"price-oracle", drops_paid:5000, agent_wallet:"rAgent1xKGga", called_at:"2026-03-23T09:50:33Z" },
  { id:8, tool_id:"ai-summarizer", drops_paid:20000, agent_wallet:"rAgent5xPQRs", called_at:"2026-03-23T09:45:12Z" },
  { id:9, tool_id:"web-scraper", drops_paid:10000, agent_wallet:"rAgent3xQRSt", called_at:"2026-03-23T09:30:05Z" },
  { id:10, tool_id:"code-executor", drops_paid:30000, agent_wallet:"rAgent2xYZab", called_at:"2026-03-23T09:20:44Z" },
];

// ── Styles ─────────────────────────────────────────────────────────────────
const card = {
  background:"var(--card)",border:"1px solid var(--border)",
  borderRadius:"12px",padding:"1.25rem 1.5rem",
};
const tabBtn = (active) => ({
  padding:"8px 16px",borderRadius:"8px",border:"none",
  background: active ? "var(--accent)" : "var(--bg3)",
  color: active ? "#fff" : "var(--muted)",
  fontWeight:600,fontSize:"0.82rem",cursor:"pointer",transition:"all .15s",
});
const input = {
  background:"var(--bg3)",border:"1px solid var(--border)",
  borderRadius:"8px",padding:"8px 12px",color:"var(--text)",
  fontSize:"0.85rem",width:"100%",boxSizing:"border-box",
};
const btn = (color="#0ea5e9") => ({
  background:`linear-gradient(135deg,${color},${color}cc)`,
  color:"#fff",border:"none",borderRadius:"8px",
  padding:"8px 16px",fontWeight:600,fontSize:"0.82rem",cursor:"pointer",
});

// ── Login Screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onAuth }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!locked) return;
    if (timer <= 0) { setLocked(false); return; }
    const t = setTimeout(() => setTimer(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [locked, timer]);

  function submit() {
    if (locked) return;
    if (pw === ADMIN_PW) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ts: Date.now() }));
      onAuth(true);
    } else {
      const n = attempts + 1;
      setAttempts(n); setPw("");
      if (n >= 5) { setLocked(true); setTimer(30); setErr("Too many attempts. Locked 30s."); }
      else setErr(`Wrong password — ${5 - n} attempt${5-n!==1?"s":""} left`);
    }
  }

  return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"center",minHeight:"70vh" }}>
      <div style={{ ...card, width:"100%",maxWidth:"380px",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:0,left:0,right:0,height:"2px",background:"linear-gradient(90deg,#0ea5e9,#7c3aed,#ef4444)" }} />
        <div style={{ textAlign:"center",marginBottom:"2rem" }}>
          <div style={{ fontSize:"2.5rem",marginBottom:"0.5rem" }}>🛡️</div>
          <h2 style={{ fontSize:"1.1rem",fontWeight:800,marginBottom:"0.25rem" }}>Admin Panel</h2>
          <p style={{ color:"var(--muted)",fontSize:"0.8rem" }}>Restricted access — authorised personnel only</p>
        </div>
        <input
          type="password" value={pw} placeholder="Admin password"
          disabled={locked} autoFocus
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === "Enter" && submit()}
          style={{ ...input, marginBottom:"0.75rem", borderColor: err ? "var(--red)" : "var(--border)" }}
        />
        {err && <div style={{ color:"#f43f5e",fontSize:"0.75rem",marginBottom:"0.75rem" }}>
          {locked ? `🔒 Locked — ${timer}s` : `⚠️ ${err}`}
        </div>}
        <button onClick={submit} disabled={locked} style={{ ...btn(), width:"100%",padding:"10px",fontSize:"0.88rem" }}>
          {locked ? `Locked (${timer}s)` : "Unlock Admin Panel"}
        </button>
        <p style={{ color:"var(--muted)",fontSize:"0.7rem",textAlign:"center",marginTop:"1rem",marginBottom:0 }}>
          Direct URL: <code style={{ fontSize:"0.68rem" }}>/agentpay-frontend/_ap</code>
        </p>
      </div>
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────────────────
function OverviewTab({ logs, tools }) {
  const totalDrops = logs.reduce((s,l) => s + (l.drops_paid??0), 0);
  const totalXRP = (totalDrops/1_000_000).toFixed(4);
  const uniqueAgents = new Set(logs.map(l=>l.agent_wallet)).size;
  const toolCounts = logs.reduce((a,l) => { a[l.tool_id]=(a[l.tool_id]??0)+1; return a; }, {});
  const topTool = Object.entries(toolCounts).sort((a,b)=>b[1]-a[1])[0]?.[0] ?? "—";
  const today = new Date().toISOString().slice(0,10);
  const todayCalls = logs.filter(l => l.called_at?.startsWith(today)).length;

  const stats = [
    { label:"Total Calls", value:logs.length, icon:"📊", color:"var(--accent)" },
    { label:"XRP Earned", value:`${totalXRP} XRP`, icon:"💰", color:"#22c55e" },
    { label:"Unique Agents", value:uniqueAgents, icon:"🤖", color:"#a855f7" },
    { label:"Calls Today", value:todayCalls, icon:"📅", color:"#f59e0b" },
    { label:"Top Tool", value:TOOL_ICONS[topTool]+" "+topTool, icon:"🏆", color:"#0ea5e9" },
    { label:"Avg per Call", value:`${logs.length ? (totalDrops/logs.length/1_000_000).toFixed(4) : "0"} XRP`, icon:"⚖️", color:"#06b6d4" },
  ];

  const maxCalls = Math.max(...Object.values(toolCounts), 1);

  return (
    <div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:"0.75rem",marginBottom:"1.5rem" }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...card, position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",top:0,left:0,right:0,height:"2px",background:`linear-gradient(90deg,${s.color},transparent)` }} />
            <div style={{ fontSize:"1.2rem",marginBottom:"0.3rem" }}>{s.icon}</div>
            <div style={{ fontSize:"0.7rem",color:"var(--muted)",marginBottom:"0.2rem" }}>{s.label}</div>
            <div style={{ fontSize:"1.1rem",fontWeight:800,fontFamily:"JetBrains Mono,monospace",color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tool breakdown */}
      <div style={{ ...card, marginBottom:"1rem" }}>
        <h3 style={{ fontSize:"0.9rem",fontWeight:700,marginBottom:"1rem" }}>Tool Performance</h3>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"0.75rem" }}>
          {tools.map(t => {
            const calls = toolCounts[t.id] ?? 0;
            const earned = ((calls * parseInt(t.price_drops)) / 1_000_000).toFixed(4);
            const pct = Math.round((calls / maxCalls) * 100);
            return (
              <div key={t.id} style={{ background:"var(--bg2)",borderRadius:"10px",padding:"1rem",border:"1px solid var(--border)" }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"0.5rem" }}>
                  <span style={{ fontSize:"1.1rem" }}>{t.icon}</span>
                  <span style={{ fontSize:"0.7rem",fontFamily:"JetBrains Mono,monospace",color:"#22c55e" }}>{earned} XRP</span>
                </div>
                <div style={{ fontSize:"0.8rem",fontWeight:600,marginBottom:"0.3rem" }}>{t.name}</div>
                <div style={{ fontSize:"0.72rem",color:"var(--muted)",marginBottom:"0.5rem" }}>{calls} calls · {t.price_drops} drops</div>
                <div style={{ background:"var(--bg3)",borderRadius:"99px",height:"4px" }}>
                  <div style={{ width:`${pct}%`,background:TOOL_COLORS[t.id]??"var(--accent)",height:"4px",borderRadius:"99px" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Pricing Tab ───────────────────────────────────────────────────────────────
function PricingTab({ tools }) {
  const [prices, setPrices] = useState(() =>
    Object.fromEntries(tools.map(t => [t.id, t.price_drops]))
  );
  const [saved, setSaved] = useState({});

  function save(toolId) {
    setSaved(s => ({ ...s, [toolId]: true }));
    setTimeout(() => setSaved(s => ({ ...s, [toolId]: false })), 2000);
  }

  const xrp = (drops) => (parseInt(drops||0)/1_000_000).toFixed(4);

  return (
    <div>
      <div style={{ background:"rgba(245,158,11,.08)",border:"1px solid rgba(245,158,11,.25)",borderRadius:"8px",padding:"0.75rem 1rem",marginBottom:"1.5rem",fontSize:"0.82rem",color:"#fcd34d" }}>
        ⚠️ Pricing changes here update the <strong>frontend display only</strong>. To change live payment amounts, update Railway Variables and redeploy the backend.
      </div>

      <div style={{ display:"flex",flexDirection:"column",gap:"0.75rem" }}>
        {tools.map(t => (
          <div key={t.id} style={{ ...card, display:"grid",gridTemplateColumns:"auto 1fr auto auto",alignItems:"center",gap:"1rem" }}>
            <span style={{ fontSize:"1.5rem" }}>{t.icon}</span>
            <div>
              <div style={{ fontWeight:600,fontSize:"0.9rem",marginBottom:"2px" }}>{t.name}</div>
              <div style={{ fontSize:"0.75rem",color:"var(--muted)" }}>{t.method??'GET'} {t.path}</div>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:"0.5rem" }}>
              <input
                type="number"
                value={prices[t.id]}
                onChange={e => setPrices(p => ({ ...p, [t.id]: e.target.value }))}
                style={{ ...input, width:"120px",textAlign:"right",fontFamily:"JetBrains Mono,monospace" }}
              />
              <span style={{ color:"var(--muted)",fontSize:"0.75rem",whiteSpace:"nowrap" }}>drops = {xrp(prices[t.id])} XRP</span>
            </div>
            <button onClick={() => save(t.id)} style={{ ...btn(saved[t.id]?"#22c55e":"#0ea5e9"), whiteSpace:"nowrap" }}>
              {saved[t.id] ? "✓ Noted" : "Save"}
            </button>
          </div>
        ))}
      </div>

      <div style={{ ...card, marginTop:"1.5rem", background:"var(--bg2)" }}>
        <h3 style={{ fontSize:"0.85rem",fontWeight:700,marginBottom:"0.75rem" }}>🔧 Apply Pricing to Backend</h3>
        <p style={{ color:"var(--muted)",fontSize:"0.82rem",lineHeight:1.6,marginBottom:"0.75rem" }}>
          Copy these values into Railway → Variables tab to apply live:
        </p>
        <pre style={{ background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"8px",padding:"0.75rem",fontFamily:"JetBrains Mono,monospace",fontSize:"0.72rem",color:"#93c5fd",overflowX:"auto" }}>
{tools.map(t => `${t.priceEnvKey ?? `PRICE_${t.id.toUpperCase().replace(/-/g,"_")}_DROPS`}=${prices[t.id]}`).join("\n")}
        </pre>
      </div>
    </div>
  );
}

// ── Agents Tab ────────────────────────────────────────────────────────────────
function AgentsTab({ logs }) {
  const [search, setSearch] = useState("");

  const agentMap = logs.reduce((acc, l) => {
    const k = l.agent_wallet;
    if (!acc[k]) acc[k] = { wallet:k, calls:0, drops:0, tools:new Set(), last:"" };
    acc[k].calls++;
    acc[k].drops += l.drops_paid ?? 0;
    acc[k].tools.add(l.tool_id);
    if (!acc[k].last || l.called_at > acc[k].last) acc[k].last = l.called_at;
    return acc;
  }, {});

  const agents = Object.values(agentMap)
    .sort((a,b) => b.drops - a.drops)
    .filter(a => a.wallet.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ marginBottom:"1rem" }}>
        <input
          placeholder="Search wallet address…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...input, maxWidth:"360px" }}
        />
      </div>

      <div style={{ ...card, padding:0, overflow:"hidden" }}>
        <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 2fr",gap:"0",background:"var(--bg2)",padding:"0.6rem 1rem",borderBottom:"1px solid var(--border)" }}>
          {["Wallet","Calls","XRP Spent","Tools Used","Last Active"].map(h => (
            <div key={h} style={{ fontSize:"0.7rem",fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".06em" }}>{h}</div>
          ))}
        </div>
        {agents.length === 0 && (
          <div style={{ padding:"2rem",textAlign:"center",color:"var(--muted)",fontSize:"0.85rem" }}>No agents found.</div>
        )}
        {agents.map((a, i) => (
          <div key={a.wallet} style={{
            display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 2fr",gap:"0",
            padding:"0.75rem 1rem",borderBottom: i < agents.length-1 ? "1px solid var(--border)" : "none",
            background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,.01)",
            alignItems:"center",
          }}>
            <div style={{ fontFamily:"JetBrains Mono,monospace",fontSize:"0.75rem",color:"var(--accent)" }}>
              {a.wallet.slice(0,16)}…
            </div>
            <div style={{ fontWeight:600,fontSize:"0.85rem" }}>{a.calls}</div>
            <div style={{ fontFamily:"JetBrains Mono,monospace",fontSize:"0.8rem",color:"#22c55e" }}>
              {(a.drops/1_000_000).toFixed(4)}
            </div>
            <div style={{ display:"flex",gap:"3px",flexWrap:"wrap" }}>
              {[...a.tools].map(tid => (
                <span key={tid} style={{ fontSize:"1rem" }}>{TOOL_ICONS[tid]??'🔧'}</span>
              ))}
            </div>
            <div style={{ fontSize:"0.75rem",color:"var(--muted)" }}>
              {a.last ? new Date(a.last).toLocaleString() : "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Calls Tab ─────────────────────────────────────────────────────────────────
function CallsTab({ logs }) {
  const [filter, setFilter] = useState("all");
  const tools = ["all", ...new Set(logs.map(l => l.tool_id))];
  const filtered = filter === "all" ? logs : logs.filter(l => l.tool_id === filter);

  return (
    <div>
      <div style={{ display:"flex",gap:"0.4rem",flexWrap:"wrap",marginBottom:"1rem" }}>
        {tools.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={tabBtn(filter===t)}>
            {t === "all" ? "All" : `${TOOL_ICONS[t]??'🔧'} ${t}`}
          </button>
        ))}
      </div>

      <div style={{ ...card, padding:0, overflow:"hidden" }}>
        <div style={{ display:"grid",gridTemplateColumns:"auto 1fr 1fr 1fr",background:"var(--bg2)",padding:"0.6rem 1rem",borderBottom:"1px solid var(--border)" }}>
          {["Tool","Agent Wallet","Amount","Timestamp"].map(h => (
            <div key={h} style={{ fontSize:"0.7rem",fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".06em" }}>{h}</div>
          ))}
        </div>
        {filtered.slice(0,50).map((log, i) => (
          <div key={log.id??i} style={{
            display:"grid",gridTemplateColumns:"auto 1fr 1fr 1fr",gap:"0",
            padding:"0.65rem 1rem",borderBottom: i < filtered.length-1 ? "1px solid var(--border)" : "none",
            alignItems:"center",background: i%2===0?"transparent":"rgba(255,255,255,.01)",
          }}>
            <span style={{ fontSize:"1.1rem",marginRight:"0.5rem" }}>{TOOL_ICONS[log.tool_id]??'🔧'}</span>
            <div style={{ fontFamily:"JetBrains Mono,monospace",fontSize:"0.75rem",color:"var(--accent)" }}>
              {log.agent_wallet?.slice(0,14)}…
            </div>
            <div style={{ fontFamily:"JetBrains Mono,monospace",fontSize:"0.8rem",color:"#22c55e" }}>
              +{(log.drops_paid/1_000_000).toFixed(4)} XRP
            </div>
            <div style={{ fontSize:"0.75rem",color:"var(--muted)" }}>
              {log.called_at ? new Date(log.called_at).toLocaleString() : "—"}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding:"2rem",textAlign:"center",color:"var(--muted)",fontSize:"0.85rem" }}>No calls yet.</div>
        )}
      </div>
      {filtered.length > 50 && (
        <p style={{ color:"var(--muted)",fontSize:"0.78rem",marginTop:"0.5rem",textAlign:"right" }}>
          Showing 50 of {filtered.length} calls
        </p>
      )}
    </div>
  );
}

// ── System Tab ────────────────────────────────────────────────────────────────
function SystemTab() {
  const [health, setHealth] = useState(null);
  const [checking, setChecking] = useState(false);

  const check = useCallback(async () => {
    setChecking(true);
    try {
      const start = Date.now();
      const r = await fetch(`${BASE}/health`);
      const data = await r.json();
      setHealth({ ok: r.ok, latency: Date.now()-start, ...data });
    } catch (e) {
      setHealth({ ok: false, error: e.message });
    }
    setChecking(false);
  }, []);

  useEffect(() => { check(); }, []);

  const rows = [
    ["Backend URL", BASE],
    ["Supabase", SUPABASE_URL ? "✅ Configured" : "⚠️ Not configured"],
    ["x402 Facilitator", "https://xrpl-x402.t54.ai"],
    ["Admin Panel URL", `${window.location.origin}/_ap`],
  ];

  return (
    <div>
      <div style={{ ...card, marginBottom:"1rem" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem" }}>
          <h3 style={{ fontSize:"0.9rem",fontWeight:700 }}>Backend Status</h3>
          <button onClick={check} disabled={checking} style={{ ...btn("#0ea5e9"), fontSize:"0.75rem",padding:"5px 12px" }}>
            {checking ? "Checking…" : "🔄 Recheck"}
          </button>
        </div>
        {health ? (
          <div style={{ display:"flex",gap:"1rem",alignItems:"center" }}>
            <div style={{
              width:"12px",height:"12px",borderRadius:"50%",flexShrink:0,
              background: health.ok ? "#22c55e" : "#ef4444",
              boxShadow: health.ok ? "0 0 8px #22c55e" : "0 0 8px #ef4444",
            }} />
            <div>
              <div style={{ fontWeight:600,fontSize:"0.9rem" }}>
                {health.ok ? "✅ Backend Online" : "❌ Backend Offline"}
              </div>
              {health.latency && (
                <div style={{ fontSize:"0.75rem",color:"var(--muted)" }}>
                  Latency: {health.latency}ms · {health.time ? new Date(health.time).toLocaleTimeString() : ""}
                </div>
              )}
              {health.error && <div style={{ fontSize:"0.75rem",color:"#f43f5e" }}>{health.error}</div>}
            </div>
          </div>
        ) : (
          <div style={{ color:"var(--muted)",fontSize:"0.85rem" }}>Checking…</div>
        )}
      </div>

      <div style={card}>
        <h3 style={{ fontSize:"0.9rem",fontWeight:700,marginBottom:"0.75rem" }}>Configuration</h3>
        <div style={{ display:"flex",flexDirection:"column",gap:"0" }}>
          {rows.map(([k,v], i) => (
            <div key={k} style={{
              display:"flex",justifyContent:"space-between",alignItems:"center",
              padding:"0.65rem 0",
              borderBottom: i < rows.length-1 ? "1px solid var(--border)" : "none",
            }}>
              <span style={{ fontSize:"0.82rem",color:"var(--muted)",fontWeight:500 }}>{k}</span>
              <span style={{ fontSize:"0.78rem",fontFamily:"JetBrains Mono,monospace",color:"var(--accent)",maxWidth:"55%",textAlign:"right",wordBreak:"break-all" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Panel ──────────────────────────────────────────────────────────
export default function AdminPanelPage() {
  const [authed, setAuthed] = useState(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) { const { ts } = JSON.parse(raw); return Date.now()-ts < SESSION_TTL; }
    } catch {}
    return false;
  });
  const [tab, setTab] = useState("overview");
  const [logs, setLogs] = useState([]);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authed) return;
    // Load tools
    fetch(`${BASE}/tools`).then(r=>r.json()).then(setTools).catch(()=>{});
    // Load usage logs
    if (SUPABASE_URL && SUPABASE_ANON) {
      fetch(`${SUPABASE_URL}/rest/v1/usage_logs?order=called_at.desc&limit=200`, {
        headers:{ apikey:SUPABASE_ANON, Authorization:`Bearer ${SUPABASE_ANON}` }
      }).then(r=>r.json()).then(d => setLogs(Array.isArray(d)?d:MOCK_LOGS))
        .catch(()=>setLogs(MOCK_LOGS))
        .finally(()=>setLoading(false));
    } else {
      setLogs(MOCK_LOGS); setLoading(false);
    }
  }, [authed]);

  if (!authed) return <LoginScreen onAuth={setAuthed} />;

  const tabs = [
    { id:"overview", label:"📊 Overview" },
    { id:"pricing", label:"💰 Pricing" },
    { id:"agents", label:"🤖 Agents" },
    { id:"calls", label:"📋 Call Logs" },
    { id:"system", label:"⚙️ System" },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.5rem",flexWrap:"wrap",gap:"1rem" }}>
        <div>
          <div style={{ display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.25rem" }}>
            <h1 style={{ fontSize:"1.5rem",fontWeight:800 }}>Admin Panel</h1>
            <span style={{ background:"rgba(239,68,68,.15)",color:"#ef4444",fontSize:"0.65rem",fontWeight:700,padding:"2px 8px",borderRadius:"99px",border:"1px solid rgba(239,68,68,.3)" }}>
              RESTRICTED
            </span>
          </div>
          <p style={{ color:"var(--muted)",fontSize:"0.82rem" }}>
            Full control · URL not linked in nav · {loading ? "Loading data…" : `${logs.length} calls loaded`}
          </p>
        </div>
        <button
          onClick={() => { sessionStorage.removeItem(SESSION_KEY); setAuthed(false); }}
          style={{ background:"var(--bg2)",border:"1px solid var(--border)",color:"var(--muted)",fontSize:"0.78rem",padding:"6px 14px",borderRadius:"8px",cursor:"pointer" }}
        >
          🔒 Lock Panel
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex",gap:"0.4rem",flexWrap:"wrap",marginBottom:"1.5rem" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={tabBtn(tab===t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview" && <OverviewTab logs={logs} tools={tools} />}
      {tab === "pricing"  && <PricingTab tools={tools} />}
      {tab === "agents"   && <AgentsTab logs={logs} />}
      {tab === "calls"    && <CallsTab logs={logs} />}
      {tab === "system"   && <SystemTab />}
    </div>
  );
}
