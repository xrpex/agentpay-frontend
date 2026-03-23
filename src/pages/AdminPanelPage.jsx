import React, { useState, useEffect, useCallback } from "react";

const ADMIN_PW   = import.meta.env.VITE_ADMIN_PASSWORD ?? "agentpay2026";
const SESSION_KEY = "agentpay_ap_auth";
const SESSION_TTL = 1000 * 60 * 60 * 8;
const BASE        = import.meta.env.VITE_BACKEND_URL ?? "https://agentpay-backend-production.up.railway.app";
const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_SVC  = import.meta.env.VITE_SUPABASE_SERVICE_KEY; // optional for writes

const TOOL_ICONS  = { "web-scraper":"🌐","price-oracle":"📈","ai-summarizer":"🤖","defi-feed":"💹","code-executor":"⚡" };
const TOOL_COLORS = { "web-scraper":"#0ea5e9","price-oracle":"#22c55e","ai-summarizer":"#a855f7","defi-feed":"#f59e0b","code-executor":"#ef4444" };

const MOCK_LOGS = [
  { id:1, tool_id:"web-scraper",   drops_paid:10000, agent_wallet:"rAgent1xKGgaEU", called_at:"2026-03-23T10:14:22Z" },
  { id:2, tool_id:"price-oracle",  drops_paid:5000,  agent_wallet:"rAgent2xYZabCD", called_at:"2026-03-23T10:13:01Z" },
  { id:3, tool_id:"ai-summarizer", drops_paid:20000, agent_wallet:"rAgent1xKGgaEU", called_at:"2026-03-23T10:11:44Z" },
  { id:4, tool_id:"code-executor", drops_paid:30000, agent_wallet:"rAgent3xQRStUV", called_at:"2026-03-23T10:09:15Z" },
  { id:5, tool_id:"defi-feed",     drops_paid:10000, agent_wallet:"rAgent2xYZabCD", called_at:"2026-03-23T10:07:03Z" },
];

const card   = { background:"var(--card)", border:"1px solid var(--border)", borderRadius:"12px", padding:"1.25rem 1.5rem" };
const inp    = (err) => ({ background:"var(--bg3)", border:`1px solid ${err?"var(--red)":"var(--border)"}`, borderRadius:"8px", padding:"8px 12px", color:"var(--text)", fontSize:"0.85rem", width:"100%", boxSizing:"border-box" });
const tabBtn = (active) => ({ padding:"8px 16px", borderRadius:"8px", border:"none", background:active?"var(--accent)":"var(--bg3)", color:active?"#fff":"var(--muted)", fontWeight:600, fontSize:"0.82rem", cursor:"pointer" });
const btn    = (color="#0ea5e9",outline=false) => outline
  ? { background:"transparent", border:`1px solid ${color}`, color, borderRadius:"8px", padding:"7px 14px", fontWeight:600, fontSize:"0.82rem", cursor:"pointer" }
  : { background:`linear-gradient(135deg,${color},${color}bb)`, color:"#fff", border:"none", borderRadius:"8px", padding:"7px 14px", fontWeight:600, fontSize:"0.82rem", cursor:"pointer" };

// ── Login ─────────────────────────────────────────────────────────────────────
function LoginScreen({ onAuth }) {
  const [pw,setPw]=useState(""); const [err,setErr]=useState("");
  const [attempts,setAttempts]=useState(0); const [locked,setLocked]=useState(false); const [timer,setTimer]=useState(0);
  useEffect(()=>{ if(!locked)return; if(timer<=0){setLocked(false);return;} const t=setTimeout(()=>setTimer(n=>n-1),1000); return()=>clearTimeout(t); },[locked,timer]);
  function submit(){
    if(locked)return;
    if(pw===ADMIN_PW){ sessionStorage.setItem(SESSION_KEY,JSON.stringify({ts:Date.now()})); onAuth(true); }
    else { const n=attempts+1; setAttempts(n); setPw(""); if(n>=5){setLocked(true);setTimer(30);setErr("Too many attempts. Locked 30s.");}else setErr(`Wrong — ${5-n} left`); }
  }
  return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"center",minHeight:"70vh" }}>
      <div style={{ ...card,width:"100%",maxWidth:"380px",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",top:0,left:0,right:0,height:"2px",background:"linear-gradient(90deg,#0ea5e9,#7c3aed,#ef4444)" }} />
        <div style={{ textAlign:"center",marginBottom:"2rem" }}>
          <div style={{ fontSize:"2.5rem",marginBottom:"0.5rem" }}>🛡️</div>
          <h2 style={{ fontSize:"1.1rem",fontWeight:800,marginBottom:"0.25rem" }}>Admin Panel</h2>
          <p style={{ color:"var(--muted)",fontSize:"0.8rem" }}>Restricted access only</p>
        </div>
        <input type="password" value={pw} placeholder="Admin password" disabled={locked} autoFocus
          onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}
          style={{ ...inp(err),marginBottom:"0.75rem" }} />
        {err&&<div style={{ color:"#f43f5e",fontSize:"0.75rem",marginBottom:"0.75rem" }}>{locked?`🔒 ${timer}s`:`⚠️ ${err}`}</div>}
        <button onClick={submit} disabled={locked} style={{ ...btn(),width:"100%",padding:"10px" }}>
          {locked?`Locked (${timer}s)`:"Unlock Admin Panel"}
        </button>
      </div>
    </div>
  );
}

// ── Dashboard Tab ─────────────────────────────────────────────────────────────
function DashboardTab({ logs, tools }) {
  const totalDrops = logs.reduce((s,l)=>s+(l.drops_paid??0),0);
  const unique     = new Set(logs.map(l=>l.agent_wallet)).size;
  const today      = new Date().toISOString().slice(0,10);
  const todayCalls = logs.filter(l=>l.called_at?.startsWith(today)).length;
  const toolCounts = logs.reduce((a,l)=>{ a[l.tool_id]=(a[l.tool_id]??0)+1; return a; },{});
  const maxCalls   = Math.max(...Object.values(toolCounts),1);
  const stats = [
    { label:"Total Calls",   value:logs.length,                            icon:"📊", color:"var(--accent)" },
    { label:"XRP Earned",    value:`${(totalDrops/1e6).toFixed(4)} XRP`,   icon:"💰", color:"#22c55e" },
    { label:"Unique Agents", value:unique,                                  icon:"🤖", color:"#a855f7" },
    { label:"Calls Today",   value:todayCalls,                              icon:"📅", color:"#f59e0b" },
  ];
  return (
    <div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:"0.75rem",marginBottom:"1.5rem" }}>
        {stats.map(s=>(
          <div key={s.label} style={{ ...card,position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",top:0,left:0,right:0,height:"2px",background:`linear-gradient(90deg,${s.color},transparent)` }} />
            <div style={{ fontSize:"1.3rem",marginBottom:"0.25rem" }}>{s.icon}</div>
            <div style={{ fontSize:"0.7rem",color:"var(--muted)",marginBottom:"0.2rem" }}>{s.label}</div>
            <div style={{ fontSize:"1.3rem",fontWeight:800,fontFamily:"JetBrains Mono,monospace",color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem" }}>
        <div style={card}>
          <h3 style={{ fontSize:"0.9rem",fontWeight:700,marginBottom:"1rem" }}>Calls per Tool</h3>
          {Object.entries(toolCounts).sort((a,b)=>b[1]-a[1]).map(([tid,count])=>(
            <div key={tid} style={{ marginBottom:"0.7rem" }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"3px" }}>
                <span style={{ fontSize:"0.8rem" }}>{TOOL_ICONS[tid]??'🔧'} {tid}</span>
                <span style={{ fontSize:"0.75rem",fontFamily:"JetBrains Mono,monospace",color:"var(--muted)" }}>{count}</span>
              </div>
              <div style={{ background:"var(--bg3)",borderRadius:"99px",height:"5px" }}>
                <div style={{ width:`${Math.round(count/maxCalls*100)}%`,background:TOOL_COLORS[tid]??"var(--accent)",height:"5px",borderRadius:"99px" }} />
              </div>
            </div>
          ))}
          {Object.keys(toolCounts).length===0&&<p style={{ color:"var(--muted)",fontSize:"0.82rem" }}>No calls yet.</p>}
        </div>
        <div style={card}>
          <h3 style={{ fontSize:"0.9rem",fontWeight:700,marginBottom:"1rem" }}>Recent Calls</h3>
          <div style={{ display:"flex",flexDirection:"column",gap:"0.5rem",maxHeight:"280px",overflowY:"auto" }}>
            {logs.slice(0,12).map((log,i)=>(
              <div key={log.id??i} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.5rem 0.7rem",background:"var(--bg2)",borderRadius:"8px",fontSize:"0.75rem" }}>
                <span>{TOOL_ICONS[log.tool_id]??'🔧'} {log.tool_id}</span>
                <span style={{ color:"#22c55e",fontFamily:"JetBrains Mono,monospace" }}>+{(log.drops_paid/1e6).toFixed(4)}</span>
              </div>
            ))}
            {logs.length===0&&<p style={{ color:"var(--muted)",fontSize:"0.82rem" }}>No calls yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── List Tool Tab ─────────────────────────────────────────────────────────────
const EMPTY_TOOL = { id:"", name:"", description:"", category:"AI", icon:"🔧", method:"GET", path:"", price_drops:"10000", endpoint_url:"", deploy_script:"", example_request:"", example_response:"", github:"", docs_url:"", provider:"" };

function ListToolTab({ paidTools, setPaidTools }) {
  const [form, setForm]     = useState({ ...EMPTY_TOOL });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [deleting, setDeleting] = useState(null);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  function validate() {
    const e = {};
    if (!form.id.trim())           e.id           = "Required";
    if (!form.name.trim())         e.name         = "Required";
    if (!form.description.trim())  e.description  = "Required";
    if (!form.path.trim())         e.path         = "Required (e.g. /tools/my-tool)";
    if (!form.endpoint_url.trim()) e.endpoint_url = "Required (full URL)";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function saveTool() {
    if (!validate()) return;
    setSaving(true);
    const toolData = { ...form, active: true, created_at: new Date().toISOString() };
    if (SUPABASE_URL && SUPABASE_ANON) {
      try {
        const key = SUPABASE_SVC || SUPABASE_ANON;
        const r = await fetch(`${SUPABASE_URL}/rest/v1/paid_tools`, {
          method:"POST",
          headers:{ apikey:key, Authorization:`Bearer ${key}`, "Content-Type":"application/json", Prefer:"return=representation" },
          body: JSON.stringify(toolData),
        });
        if (r.ok) {
          const [inserted] = await r.json();
          setPaidTools(t => [inserted, ...t]);
          setForm({ ...EMPTY_TOOL });
          setSaved(true);
          setTimeout(() => setSaved(false), 3000);
        }
      } catch (e) { console.error(e); }
    } else {
      // No Supabase — just add to local state for preview
      setPaidTools(t => [toolData, ...t]);
      setForm({ ...EMPTY_TOOL });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  async function deleteTool(id) {
    setDeleting(id);
    if (SUPABASE_URL && SUPABASE_ANON) {
      const key = SUPABASE_SVC || SUPABASE_ANON;
      await fetch(`${SUPABASE_URL}/rest/v1/paid_tools?id=eq.${id}`, {
        method:"DELETE",
        headers:{ apikey:key, Authorization:`Bearer ${key}` },
      }).catch(()=>{});
    }
    setPaidTools(t => t.filter(p => p.id !== id));
    setDeleting(null);
  }

  const Field = ({ label, k, placeholder, textarea, required }) => (
    <div style={{ marginBottom:"0.85rem" }}>
      <label style={{ fontSize:"0.72rem",fontWeight:700,color:"var(--muted)",display:"block",marginBottom:"4px",textTransform:"uppercase",letterSpacing:".06em" }}>
        {label}{required&&<span style={{ color:"#ef4444" }}> *</span>}
      </label>
      {textarea ? (
        <textarea value={form[k]} onChange={e=>set(k,e.target.value)} placeholder={placeholder} rows={4}
          style={{ ...inp(errors[k]),resize:"vertical",fontFamily:"JetBrains Mono,monospace",fontSize:"0.75rem" }} />
      ) : (
        <input value={form[k]} onChange={e=>set(k,e.target.value)} placeholder={placeholder}
          style={inp(errors[k])} />
      )}
      {errors[k]&&<div style={{ color:"#ef4444",fontSize:"0.72rem",marginTop:"3px" }}>⚠️ {errors[k]}</div>}
    </div>
  );

  return (
    <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem",alignItems:"start" }}>
      {/* Form */}
      <div style={card}>
        <h3 style={{ fontSize:"0.95rem",fontWeight:700,marginBottom:"1.25rem" }}>➕ List a Paid Tool</h3>

        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1rem" }}>
          <Field label="Tool ID"   k="id"   placeholder="my-tool-id" required />
          <Field label="Icon"      k="icon" placeholder="🔧" />
        </div>
        <Field label="Tool Name"   k="name"         placeholder="My AI Tool"         required />
        <Field label="Description" k="description"  placeholder="What does this do?" required textarea />

        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1rem" }}>
          <div style={{ marginBottom:"0.85rem" }}>
            <label style={{ fontSize:"0.72rem",fontWeight:700,color:"var(--muted)",display:"block",marginBottom:"4px",textTransform:"uppercase",letterSpacing:".06em" }}>Category</label>
            <select value={form.category} onChange={e=>set("category",e.target.value)}
              style={{ ...inp(false),cursor:"pointer" }}>
              {["AI","Data","Finance","Dev","Other"].map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ marginBottom:"0.85rem" }}>
            <label style={{ fontSize:"0.72rem",fontWeight:700,color:"var(--muted)",display:"block",marginBottom:"4px",textTransform:"uppercase",letterSpacing:".06em" }}>Method</label>
            <select value={form.method} onChange={e=>set("method",e.target.value)}
              style={{ ...inp(false),cursor:"pointer" }}>
              {["GET","POST","PUT","DELETE"].map(m=><option key={m}>{m}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 1rem" }}>
          <Field label="Path"         k="path"         placeholder="/tools/my-tool"             required />
          <Field label="Price (drops)" k="price_drops" placeholder="10000" />
        </div>

        <Field label="Endpoint URL" k="endpoint_url" placeholder="https://your-server.com/tools/my-tool" required />
        <Field label="Provider Name" k="provider"    placeholder="Your name or org" />
        <Field label="GitHub URL"    k="github"       placeholder="https://github.com/..." />
        <Field label="Docs URL"      k="docs_url"     placeholder="https://your-docs.com" />
        <Field label="Deploy Script" k="deploy_script" placeholder="# one-script deploy..." textarea />
        <Field label="Example Request"  k="example_request"  placeholder="curl ..." textarea />
        <Field label="Example Response" k="example_response" placeholder='{ "result": "..." }' textarea />

        {saved && (
          <div style={{ background:"rgba(34,197,94,.1)",border:"1px solid rgba(34,197,94,.3)",borderRadius:"8px",padding:"0.6rem 1rem",color:"#22c55e",fontSize:"0.82rem",marginBottom:"0.75rem" }}>
            ✅ Tool listed successfully! Visible on Marketplace.
          </div>
        )}

        <button onClick={saveTool} disabled={saving}
          style={{ ...btn("#7c3aed"),width:"100%",padding:"10px",fontSize:"0.88rem" }}>
          {saving ? "Listing…" : "🚀 List Tool on Marketplace"}
        </button>
      </div>

      {/* Listed paid tools */}
      <div>
        <h3 style={{ fontSize:"0.95rem",fontWeight:700,marginBottom:"1rem" }}>Listed Paid Tools ({paidTools.length})</h3>
        {paidTools.length === 0 ? (
          <div style={{ ...card,textAlign:"center",color:"var(--muted)",fontSize:"0.85rem",padding:"2rem" }}>
            No paid tools listed yet. Use the form to add one.
          </div>
        ) : (
          <div style={{ display:"flex",flexDirection:"column",gap:"0.75rem" }}>
            {paidTools.map(t => (
              <div key={t.id} style={{ ...card,display:"flex",gap:"1rem",alignItems:"flex-start" }}>
                <span style={{ fontSize:"1.5rem",flexShrink:0 }}>{t.icon}</span>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontWeight:600,fontSize:"0.88rem",marginBottom:"3px" }}>{t.name}</div>
                  <div style={{ fontSize:"0.75rem",color:"var(--muted)",marginBottom:"5px",lineHeight:1.4 }}>{t.description?.slice(0,80)}…</div>
                  <div style={{ display:"flex",gap:"0.4rem",flexWrap:"wrap" }}>
                    <span style={{ background:"rgba(245,158,11,.15)",color:"#f59e0b",fontSize:"0.62rem",fontWeight:700,padding:"2px 7px",borderRadius:"99px",border:"1px solid rgba(245,158,11,.3)" }}>
                      {t.price_drops ? `${(parseInt(t.price_drops)/1e6).toFixed(4)} XRP` : "PAID"}
                    </span>
                    <span style={{ fontSize:"0.62rem",fontWeight:600,color:"var(--muted)",padding:"2px 7px",background:"var(--bg2)",borderRadius:"99px",border:"1px solid var(--border)" }}>
                      {t.category}
                    </span>
                    <span style={{ fontSize:"0.62rem",color:"var(--muted)" }}>{t.method} {t.path}</span>
                  </div>
                </div>
                <button
                  onClick={() => deleteTool(t.id)} disabled={deleting===t.id}
                  style={{ ...btn("#ef4444",true),padding:"5px 10px",fontSize:"0.72rem",flexShrink:0 }}
                >
                  {deleting===t.id?"…":"🗑️"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Pricing Tab ───────────────────────────────────────────────────────────────
function PricingTab({ tools }) {
  const [prices,setPrices] = useState(()=>Object.fromEntries(tools.map(t=>[t.id,t.price_drops])));
  const [saved,setSaved]   = useState({});
  useEffect(()=>{ setPrices(Object.fromEntries(tools.map(t=>[t.id,t.price_drops]))); },[tools]);
  function save(id){ setSaved(s=>({...s,[id]:true})); setTimeout(()=>setSaved(s=>({...s,[id]:false})),2000); }
  return (
    <div>
      <div style={{ background:"rgba(245,158,11,.08)",border:"1px solid rgba(245,158,11,.25)",borderRadius:"8px",padding:"0.75rem 1rem",marginBottom:"1.25rem",fontSize:"0.82rem",color:"#fcd34d" }}>
        ⚠️ Edit pricing here, then copy to Railway Variables to apply live.
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:"0.75rem",marginBottom:"1.5rem" }}>
        {tools.map(t=>(
          <div key={t.id} style={{ ...card,display:"grid",gridTemplateColumns:"auto 1fr auto auto",alignItems:"center",gap:"1rem" }}>
            <span style={{ fontSize:"1.4rem" }}>{t.icon}</span>
            <div>
              <div style={{ fontWeight:600,fontSize:"0.88rem",marginBottom:"2px" }}>{t.name}</div>
              <div style={{ fontSize:"0.72rem",color:"var(--muted)" }}>{t.method??'GET'} {t.path}</div>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:"0.5rem" }}>
              <input type="number" value={prices[t.id]??t.price_drops}
                onChange={e=>setPrices(p=>({...p,[t.id]:e.target.value}))}
                style={{ ...inp(false),width:"110px",textAlign:"right",fontFamily:"JetBrains Mono,monospace" }} />
              <span style={{ color:"var(--muted)",fontSize:"0.72rem",whiteSpace:"nowrap" }}>= {((parseInt(prices[t.id]??0))/1e6).toFixed(4)} XRP</span>
            </div>
            <button onClick={()=>save(t.id)} style={{ ...btn(saved[t.id]?"#22c55e":"#0ea5e9"),whiteSpace:"nowrap" }}>
              {saved[t.id]?"✓ Noted":"Save"}
            </button>
          </div>
        ))}
      </div>
      <div style={{ ...card,background:"var(--bg2)" }}>
        <h3 style={{ fontSize:"0.85rem",fontWeight:700,marginBottom:"0.75rem" }}>📋 Copy to Railway Variables</h3>
        <pre style={{ background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"8px",padding:"0.75rem",fontFamily:"JetBrains Mono,monospace",fontSize:"0.72rem",color:"#93c5fd",overflowX:"auto" }}>
{tools.map(t=>`PRICE_${t.id.toUpperCase().replace(/-/g,"_")}_DROPS=${prices[t.id]??t.price_drops}`).join("\n")}
        </pre>
      </div>
    </div>
  );
}

// ── Agents Tab ────────────────────────────────────────────────────────────────
function AgentsTab({ logs }) {
  const [search,setSearch]=useState("");
  const agentMap = logs.reduce((acc,l)=>{
    const k=l.agent_wallet;
    if(!acc[k]) acc[k]={wallet:k,calls:0,drops:0,tools:new Set(),last:""};
    acc[k].calls++; acc[k].drops+=(l.drops_paid??0); acc[k].tools.add(l.tool_id);
    if(!acc[k].last||l.called_at>acc[k].last) acc[k].last=l.called_at;
    return acc;
  },{});
  const agents = Object.values(agentMap).sort((a,b)=>b.drops-a.drops).filter(a=>a.wallet.toLowerCase().includes(search.toLowerCase()));
  return (
    <div>
      <input placeholder="Search wallet…" value={search} onChange={e=>setSearch(e.target.value)} style={{ ...inp(false),maxWidth:"360px",marginBottom:"1rem" }} />
      <div style={{ ...card,padding:0,overflow:"hidden" }}>
        <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 2fr",background:"var(--bg2)",padding:"0.6rem 1rem",borderBottom:"1px solid var(--border)" }}>
          {["Wallet","Calls","XRP Spent","Tools","Last Active"].map(h=>(
            <div key={h} style={{ fontSize:"0.68rem",fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".06em" }}>{h}</div>
          ))}
        </div>
        {agents.length===0&&<div style={{ padding:"2rem",textAlign:"center",color:"var(--muted)",fontSize:"0.85rem" }}>No agents found.</div>}
        {agents.map((a,i)=>(
          <div key={a.wallet} style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 2fr",padding:"0.7rem 1rem",borderBottom:i<agents.length-1?"1px solid var(--border)":"none",alignItems:"center",background:i%2===0?"transparent":"rgba(255,255,255,.01)" }}>
            <div style={{ fontFamily:"JetBrains Mono,monospace",fontSize:"0.73rem",color:"var(--accent)" }}>{a.wallet.slice(0,16)}…</div>
            <div style={{ fontWeight:600,fontSize:"0.85rem" }}>{a.calls}</div>
            <div style={{ fontFamily:"JetBrains Mono,monospace",fontSize:"0.78rem",color:"#22c55e" }}>{(a.drops/1e6).toFixed(4)}</div>
            <div style={{ display:"flex",gap:"3px",flexWrap:"wrap" }}>{[...a.tools].map(t=><span key={t} style={{ fontSize:"1rem" }}>{TOOL_ICONS[t]??'🔧'}</span>)}</div>
            <div style={{ fontSize:"0.72rem",color:"var(--muted)" }}>{a.last?new Date(a.last).toLocaleString():"—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Calls Tab ─────────────────────────────────────────────────────────────────
function CallsTab({ logs }) {
  const [filter,setFilter]=useState("all");
  const tools=["all",...new Set(logs.map(l=>l.tool_id))];
  const filtered=filter==="all"?logs:logs.filter(l=>l.tool_id===filter);
  return (
    <div>
      <div style={{ display:"flex",gap:"0.4rem",flexWrap:"wrap",marginBottom:"1rem" }}>
        {tools.map(t=><button key={t} onClick={()=>setFilter(t)} style={tabBtn(filter===t)}>{t==="all"?"All":`${TOOL_ICONS[t]??'🔧'} ${t}`}</button>)}
      </div>
      <div style={{ ...card,padding:0,overflow:"hidden" }}>
        <div style={{ display:"grid",gridTemplateColumns:"auto 1fr 1fr 1fr",background:"var(--bg2)",padding:"0.6rem 1rem",borderBottom:"1px solid var(--border)" }}>
          {["Tool","Agent Wallet","Amount","Timestamp"].map(h=>(
            <div key={h} style={{ fontSize:"0.68rem",fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".06em" }}>{h}</div>
          ))}
        </div>
        {filtered.length===0&&<div style={{ padding:"2rem",textAlign:"center",color:"var(--muted)",fontSize:"0.85rem" }}>No calls yet.</div>}
        {filtered.slice(0,50).map((log,i)=>(
          <div key={log.id??i} style={{ display:"grid",gridTemplateColumns:"auto 1fr 1fr 1fr",padding:"0.65rem 1rem",borderBottom:i<Math.min(filtered.length,50)-1?"1px solid var(--border)":"none",alignItems:"center",background:i%2===0?"transparent":"rgba(255,255,255,.01)" }}>
            <span style={{ fontSize:"1.1rem",marginRight:"0.5rem" }}>{TOOL_ICONS[log.tool_id]??'🔧'}</span>
            <div style={{ fontFamily:"JetBrains Mono,monospace",fontSize:"0.73rem",color:"var(--accent)" }}>{log.agent_wallet?.slice(0,14)}…</div>
            <div style={{ fontFamily:"JetBrains Mono,monospace",fontSize:"0.78rem",color:"#22c55e" }}>+{(log.drops_paid/1e6).toFixed(4)} XRP</div>
            <div style={{ fontSize:"0.72rem",color:"var(--muted)" }}>{log.called_at?new Date(log.called_at).toLocaleString():"—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── System Tab ────────────────────────────────────────────────────────────────
function SystemTab() {
  const [health,setHealth]=useState(null); const [checking,setChecking]=useState(false);
  const check=useCallback(async()=>{
    setChecking(true);
    try{ const s=Date.now(); const r=await fetch(`${BASE}/health`); const d=await r.json(); setHealth({ok:r.ok,latency:Date.now()-s,...d}); }
    catch(e){setHealth({ok:false,error:e.message});}
    setChecking(false);
  },[]);
  useEffect(()=>{check();},[]);
  const rows=[["Backend URL",BASE],["Supabase",SUPABASE_URL?"✅ Configured":"⚠️ Not configured"],["x402 Facilitator","https://xrpl-x402.t54.ai"],["Admin Panel",`${window.location.origin}/_ap`]];
  return (
    <div>
      <div style={{ ...card,marginBottom:"1rem" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem" }}>
          <h3 style={{ fontSize:"0.9rem",fontWeight:700 }}>Backend Health</h3>
          <button onClick={check} disabled={checking} style={{ ...btn("#0ea5e9"),fontSize:"0.75rem",padding:"5px 12px" }}>{checking?"Checking…":"🔄 Recheck"}</button>
        </div>
        {health?(
          <div style={{ display:"flex",gap:"1rem",alignItems:"center" }}>
            <div style={{ width:"12px",height:"12px",borderRadius:"50%",flexShrink:0,background:health.ok?"#22c55e":"#ef4444",boxShadow:health.ok?"0 0 8px #22c55e":"0 0 8px #ef4444" }} />
            <div>
              <div style={{ fontWeight:600,fontSize:"0.9rem" }}>{health.ok?"✅ Backend Online":"❌ Backend Offline"}</div>
              {health.latency&&<div style={{ fontSize:"0.75rem",color:"var(--muted)" }}>Latency: {health.latency}ms</div>}
              {health.error&&<div style={{ fontSize:"0.75rem",color:"#f43f5e" }}>{health.error}</div>}
            </div>
          </div>
        ):<div style={{ color:"var(--muted)",fontSize:"0.85rem" }}>Checking…</div>}
      </div>
      <div style={card}>
        <h3 style={{ fontSize:"0.9rem",fontWeight:700,marginBottom:"0.75rem" }}>Configuration</h3>
        {rows.map(([k,v],i)=>(
          <div key={k} style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.65rem 0",borderBottom:i<rows.length-1?"1px solid var(--border)":"none" }}>
            <span style={{ fontSize:"0.82rem",color:"var(--muted)",fontWeight:500 }}>{k}</span>
            <span style={{ fontSize:"0.75rem",fontFamily:"JetBrains Mono,monospace",color:"var(--accent)",maxWidth:"55%",textAlign:"right",wordBreak:"break-all" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Settings Tab ──────────────────────────────────────────────────────────────
function SettingsTab() {
  const [donationAddress, setDonationAddress] = useState(() => {
    return localStorage.getItem("agentpay_donation_address") || "rAgentPayDonationAddressXXXXXXXXXXXXXXXX";
  });
  const [saved, setSaved] = useState(false);

  function saveSettings() {
    localStorage.setItem("agentpay_donation_address", donationAddress);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <div style={card}>
        <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "1.25rem" }}>⚙️ Project Settings</h3>
        
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--muted)", display: "block", marginBottom: "4px", textTransform: "uppercase", letterSpacing: ".06em" }}>
            Donation / Listing Fee Address
          </label>
          <input
            type="text"
            value={donationAddress}
            onChange={(e) => setDonationAddress(e.target.value)}
            placeholder="rXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
            style={{
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "8px 12px",
              color: "var(--text)",
              fontSize: "0.85rem",
              width: "100%",
              boxSizing: "border-box",
              fontFamily: "JetBrains Mono,monospace",
            }}
          />
          <p style={{ color: "var(--muted)", fontSize: "0.75rem", marginTop: "0.5rem" }}>
            This address receives listing fee payments from developers. Displayed on the "List Your Tool" page.
          </p>
        </div>

        {saved && (
          <div style={{ background: "rgba(34,197,94,.1)", border: "1px solid rgba(34,197,94,.3)", borderRadius: "8px", padding: "0.6rem 1rem", color: "#22c55e", fontSize: "0.82rem", marginBottom: "0.75rem" }}>
            ✅ Settings saved successfully
          </div>
        )}

        <button onClick={saveSettings} style={{ ...btn("#0ea5e9") }}>
          Save Settings
        </button>
      </div>

      <div style={{ ...card, marginTop: "1rem" }}>
        <h3 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "1rem" }}>📋 Pending Verifications</h3>
        <p style={{ color: "var(--muted)", fontSize: "0.82rem" }}>
          Tools awaiting payment verification will appear here. Check the transaction hash on XRPL explorer before approving.
        </p>
        <div style={{ marginTop: "1rem" }}>
          <a 
            href={`https://livenet.xrpl.org/accounts/${donationAddress}`} 
            target="_blank" 
            rel="noreferrer"
            style={{ ...btn("#0ea5e9", true) }}
          >
            🔍 View Address on XRPL Explorer ↗
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminPanelPage() {
  const [authed,setAuthed] = useState(()=>{
    try{ const raw=sessionStorage.getItem(SESSION_KEY); if(raw){const{ts}=JSON.parse(raw);return Date.now()-ts<SESSION_TTL;} }catch{} return false;
  });
  const [tab,setTab]       = useState("dashboard");
  const [logs,setLogs]     = useState([]);
  const [tools,setTools]   = useState([]);
  const [paidTools,setPaidTools] = useState([]);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    if(!authed) return;
    fetch(`${BASE}/tools`).then(r=>r.json()).then(setTools).catch(()=>{});
    // Load usage logs
    if(SUPABASE_URL&&SUPABASE_ANON){
      fetch(`${SUPABASE_URL}/rest/v1/usage_logs?order=called_at.desc&limit=200`,{
        headers:{apikey:SUPABASE_ANON,Authorization:`Bearer ${SUPABASE_ANON}`}
      }).then(r=>r.json()).then(d=>setLogs(Array.isArray(d)?d:MOCK_LOGS)).catch(()=>setLogs(MOCK_LOGS)).finally(()=>setLoading(false));
      // Load paid tools
      fetch(`${SUPABASE_URL}/rest/v1/paid_tools?order=created_at.desc`,{
        headers:{apikey:SUPABASE_ANON,Authorization:`Bearer ${SUPABASE_ANON}`}
      }).then(r=>r.json()).then(d=>setPaidTools(Array.isArray(d)?d:[])).catch(()=>{});
    } else { setLogs(MOCK_LOGS); setLoading(false); }
  },[authed]);

  if(!authed) return <LoginScreen onAuth={setAuthed} />;

  const tabs=[
    {id:"dashboard", label:"📊 Dashboard"},
    {id:"list-tool", label:"➕ List Tool"},
    {id:"pricing",   label:"💰 Pricing"},
    {id:"agents",    label:"🤖 Agents"},
    {id:"calls",     label:"📋 Call Logs"},
    {id:"system",    label:"⚙️ System"},
    {id:"settings",  label:"🔧 Settings"},
  ];

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.5rem",flexWrap:"wrap",gap:"1rem" }}>
        <div>
          <div style={{ display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.25rem" }}>
            <h1 style={{ fontSize:"1.5rem",fontWeight:800 }}>Admin Panel</h1>
            <span style={{ background:"rgba(239,68,68,.15)",color:"#ef4444",fontSize:"0.65rem",fontWeight:700,padding:"2px 8px",borderRadius:"99px",border:"1px solid rgba(239,68,68,.3)" }}>RESTRICTED</span>
          </div>
          <p style={{ color:"var(--muted)",fontSize:"0.82rem" }}>
            {loading?"Loading…":`${logs.length} calls · ${tools.length} free tools · ${paidTools.length} paid tools · hidden from nav`}
          </p>
        </div>
        <button onClick={()=>{sessionStorage.removeItem(SESSION_KEY);setAuthed(false);}}
          style={{ background:"var(--bg2)",border:"1px solid var(--border)",color:"var(--muted)",fontSize:"0.78rem",padding:"6px 14px",borderRadius:"8px",cursor:"pointer" }}>
          🔒 Lock Panel
        </button>
      </div>

      <div style={{ display:"flex",gap:"0.4rem",flexWrap:"wrap",marginBottom:"1.5rem" }}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={tabBtn(tab===t.id)}>{t.label}</button>)}
      </div>

      {tab==="dashboard" && <DashboardTab logs={logs} tools={tools} />}
      {tab==="list-tool" && <ListToolTab paidTools={paidTools} setPaidTools={setPaidTools} />}
      {tab==="pricing"   && <PricingTab tools={tools} />}
      {tab==="agents"    && <AgentsTab logs={logs} />}
      {tab==="calls"     && <CallsTab logs={logs} />}
      {tab==="system"    && <SystemTab />}
      {tab==="settings"  && <SettingsTab />}
    </div>
  );
}
