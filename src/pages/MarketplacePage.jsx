import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FREE_TOOLS, fetchPaidTools } from "../lib/api.js";

const CATEGORIES = ["All", "Data", "Finance", "AI", "Dev"];
const CAT_COLORS  = { Data:"#0ea5e9", Finance:"#22c55e", AI:"#a855f7", Dev:"#f59e0b" };

// ── Deploy Modal ──────────────────────────────────────────────────────────────
function DeployModal({ tool, onClose }) {
  const [copied, setCopied] = useState(false);
  if (!tool) return null;

  function copy(text) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div
      onClick={onClose}
      style={{
        position:"fixed",inset:0,background:"rgba(0,0,0,.75)",
        display:"flex",alignItems:"center",justifyContent:"center",
        zIndex:1000,padding:"1rem",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:"var(--bg2)",border:"1px solid var(--border)",
          borderRadius:"16px",width:"100%",maxWidth:"640px",
          maxHeight:"90vh",overflow:"auto",
          position:"relative",
        }}
      >
        {/* Top bar */}
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",padding:"1.25rem 1.5rem",borderBottom:"1px solid var(--border)" }}>
          <div style={{ display:"flex",alignItems:"center",gap:"0.75rem" }}>
            <span style={{ fontSize:"1.5rem" }}>{tool.icon}</span>
            <div>
              <div style={{ fontWeight:700,fontSize:"1rem" }}>{tool.name}</div>
              <div style={{ fontSize:"0.72rem",color:"var(--muted)" }}>One-script deploy</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"none",border:"none",color:"var(--muted)",fontSize:"1.2rem",cursor:"pointer" }}>✕</button>
        </div>

        <div style={{ padding:"1.5rem" }}>
          {/* Description */}
          <p style={{ color:"var(--muted)",fontSize:"0.85rem",lineHeight:1.6,marginBottom:"1.25rem" }}>
            {tool.description}
          </p>

          {/* Deploy script */}
          {tool.deploy_script && (
            <>
              <div style={{ fontSize:"0.72rem",fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:"0.5rem" }}>
                Deploy Script
              </div>
              <div style={{ position:"relative",marginBottom:"1.25rem" }}>
                <pre style={{
                  background:"var(--bg)",border:"1px solid var(--border2,#243552)",
                  borderRadius:"10px",padding:"1rem",fontFamily:"JetBrains Mono,monospace",
                  fontSize:"0.72rem",color:"#93c5fd",overflowX:"auto",
                  lineHeight:1.7,whiteSpace:"pre-wrap",margin:0,
                }}>{tool.deploy_script}</pre>
                <button
                  onClick={() => copy(tool.deploy_script)}
                  style={{
                    position:"absolute",top:"8px",right:"8px",
                    background: copied?"var(--green,#22c55e)":"var(--bg2)",
                    border:"1px solid var(--border)",color:copied?"#fff":"var(--muted)",
                    borderRadius:"6px",fontSize:"0.68rem",padding:"3px 8px",cursor:"pointer",
                  }}
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
            </>
          )}

          {/* Example request */}
          {tool.example_request && (
            <>
              <div style={{ fontSize:"0.72rem",fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:"0.5rem" }}>
                Example Request
              </div>
              <pre style={{
                background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"8px",
                padding:"0.75rem",fontFamily:"JetBrains Mono,monospace",fontSize:"0.72rem",
                color:"#fde68a",overflowX:"auto",whiteSpace:"pre-wrap",marginBottom:"1.25rem",
              }}>{tool.example_request}</pre>
            </>
          )}

          {/* Example response */}
          {tool.example_response && (
            <>
              <div style={{ fontSize:"0.72rem",fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:"0.5rem" }}>
                Example Response
              </div>
              <pre style={{
                background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"8px",
                padding:"0.75rem",fontFamily:"JetBrains Mono,monospace",fontSize:"0.72rem",
                color:"#86efac",overflowX:"auto",whiteSpace:"pre-wrap",marginBottom:"1.25rem",
              }}>{tool.example_response}</pre>
            </>
          )}

          {/* Links */}
          <div style={{ display:"flex",gap:"0.75rem",flexWrap:"wrap" }}>
            {tool.github && (
              <a href={tool.github} target="_blank" rel="noreferrer" style={{
                background:"rgba(139,92,246,.15)",border:"1px solid rgba(139,92,246,.3)",
                color:"#a78bfa",padding:"6px 14px",borderRadius:"8px",
                fontSize:"0.78rem",fontWeight:600,textDecoration:"none",
              }}>
                ⭐ View on GitHub
              </a>
            )}
            {tool.docs_url && (
              <a href={tool.docs_url} target="_blank" rel="noreferrer" style={{
                background:"rgba(6,182,212,.15)",border:"1px solid rgba(6,182,212,.3)",
                color:"#22d3ee",padding:"6px 14px",borderRadius:"8px",
                fontSize:"0.78rem",fontWeight:600,textDecoration:"none",
              }}>
                📄 Documentation
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Tool Card ─────────────────────────────────────────────────────────────────
function ToolCard({ tool, onDeploy }) {
  const color = CAT_COLORS[tool.category] ?? "#64748b";
  const navigate = useNavigate();

  return (
    <div style={{
      background:"var(--card)",border:"1px solid var(--border)",
      borderRadius:"12px",padding:"1.25rem",
      position:"relative",overflow:"hidden",
      display:"flex",flexDirection:"column",gap:"0.75rem",
    }}>
      {/* Accent bar */}
      <div style={{ position:"absolute",top:0,left:0,right:0,height:"2px",background:`linear-gradient(90deg,${color}80,transparent)` }} />

      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
        <span style={{ fontSize:"1.75rem" }}>{tool.icon}</span>
        <div style={{ display:"flex",gap:"0.4rem",alignItems:"center" }}>
          {/* Free / Paid badge */}
          {tool.free ? (
            <span style={{ background:"rgba(34,197,94,.15)",color:"#22c55e",fontSize:"0.62rem",fontWeight:700,padding:"2px 7px",borderRadius:"99px",border:"1px solid rgba(34,197,94,.3)" }}>
              FREE
            </span>
          ) : (
            <span style={{ background:"rgba(245,158,11,.15)",color:"#f59e0b",fontSize:"0.62rem",fontWeight:700,padding:"2px 7px",borderRadius:"99px",border:"1px solid rgba(245,158,11,.3)" }}>
              {tool.price_drops ? `${(parseInt(tool.price_drops)/1_000_000).toFixed(4)} XRP` : "PAID"}
            </span>
          )}
          <span style={{ background:`${color}20`,color,fontSize:"0.62rem",fontWeight:600,padding:"2px 7px",borderRadius:"99px",border:`1px solid ${color}40` }}>
            {tool.category}
          </span>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize:"0.95rem",fontWeight:700,marginBottom:"0.3rem" }}>{tool.name}</h3>
        <p style={{ color:"var(--muted)",fontSize:"0.8rem",lineHeight:1.5 }}>{tool.description}</p>
      </div>

      <div style={{ display:"flex",gap:"0.5rem",marginTop:"auto",flexWrap:"wrap" }}>
        <button
          onClick={() => onDeploy(tool)}
          style={{
            flex:1,background:"linear-gradient(135deg,#0ea5e9,#7c3aed)",
            color:"#fff",border:"none",borderRadius:"8px",
            padding:"7px 12px",fontWeight:600,fontSize:"0.78rem",cursor:"pointer",
          }}
        >
          🚀 Deploy
        </button>
        {!tool.free && (
          <button
            onClick={() => navigate(`/tool/${tool.id}`)}
            style={{
              flex:1,background:"var(--bg2)",border:"1px solid var(--border)",
              color:"var(--muted)",borderRadius:"8px",
              padding:"7px 12px",fontWeight:600,fontSize:"0.78rem",cursor:"pointer",
            }}
          >
            Details
          </button>
        )}
      </div>

      {/* Method badge */}
      <div style={{ fontSize:"0.65rem",color:"var(--muted)",fontFamily:"JetBrains Mono,monospace" }}>
        {tool.method??'GET'} {tool.path}
      </div>
    </div>
  );
}

// ── Marketplace Page ──────────────────────────────────────────────────────────
export default function MarketplacePage() {
  const [filter, setFilter]     = useState("All");
  const [paidTools, setPaidTools] = useState([]);
  const [deployTool, setDeployTool] = useState(null);

  useEffect(() => {
    fetchPaidTools().then(setPaidTools).catch(() => {});
  }, []);

  const filteredFree = filter === "All"
    ? FREE_TOOLS
    : FREE_TOOLS.filter(t => t.category === filter);

  const filteredPaid = filter === "All"
    ? paidTools
    : paidTools.filter(t => t.category === filter);

  return (
    <div>
      {/* Hero */}
      <div style={{ marginBottom:"2.5rem" }}>
        <h1 style={{
          fontSize:"clamp(1.8rem,4vw,2.8rem)",fontWeight:800,lineHeight:1.2,marginBottom:"0.75rem",
          background:"linear-gradient(135deg,#e2e8f0 30%,#0ea5e9)",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
        }}>
          AI Tool Marketplace
        </h1>
        <p style={{ color:"var(--muted)",fontSize:"0.95rem",maxWidth:"620px",lineHeight:1.6 }}>
          Open-source AI skills and tools. Free tools are community-maintained — deploy them to your own AI agent with one script.
          Paid tools operate on the{" "}
          <span style={{ color:"var(--accent)",fontWeight:600 }}>XRP Ledger via x402</span>{" "}
          — pay per call, no subscriptions.
        </p>
      </div>

      {/* Category filter */}
      <div style={{ display:"flex",gap:"0.5rem",marginBottom:"2rem",flexWrap:"wrap" }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              padding:"6px 14px",borderRadius:"99px",cursor:"pointer",fontWeight:500,fontSize:"0.82rem",
              border: filter===cat ? "1px solid var(--accent)" : "1px solid var(--border)",
              background: filter===cat ? "var(--accent)20" : "var(--bg2)",
              color: filter===cat ? "var(--accent)" : "var(--muted)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Free Tools Section ── */}
      <div style={{ marginBottom:"3rem" }}>
        <div style={{ display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1rem" }}>
          <h2 style={{ fontSize:"1.1rem",fontWeight:700 }}>🆓 Free & Open Source Tools</h2>
          <span style={{ background:"rgba(34,197,94,.1)",color:"#22c55e",fontSize:"0.7rem",fontWeight:700,padding:"3px 10px",borderRadius:"99px",border:"1px solid rgba(34,197,94,.25)" }}>
            {filteredFree.length} tools
          </span>
        </div>
        <p style={{ color:"var(--muted)",fontSize:"0.82rem",marginBottom:"1.25rem" }}>
          No payment required. Deploy any tool to your own server with one script, or call the hosted AgentPay endpoints directly.
        </p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"1rem" }}>
          {filteredFree.map(tool => (
            <ToolCard key={tool.id} tool={tool} onDeploy={setDeployTool} />
          ))}
        </div>
      </div>

      {/* ── Paid Tools Section ── */}
      <div style={{ marginBottom:"3rem" }}>
        <div style={{ display:"flex",alignItems:"center",gap:"1rem",marginBottom:"1rem" }}>
          <h2 style={{ fontSize:"1.1rem",fontWeight:700 }}>⚡ Paid Tools — x402 XRPL</h2>
          <span style={{ background:"rgba(245,158,11,.1)",color:"#f59e0b",fontSize:"0.7rem",fontWeight:700,padding:"3px 10px",borderRadius:"99px",border:"1px solid rgba(245,158,11,.25)" }}>
            {filteredPaid.length} tools
          </span>
        </div>
        <p style={{ color:"var(--muted)",fontSize:"0.82rem",marginBottom:"1.25rem" }}>
          Premium tools listed by verified providers. AI agents pay per call using XRP on the XRPL via the x402 protocol — no API keys needed.
        </p>

        {filteredPaid.length === 0 ? (
          <div style={{
            background:"var(--bg2)",border:"1px dashed var(--border)",borderRadius:"12px",
            padding:"3rem",textAlign:"center",
          }}>
            <div style={{ fontSize:"2rem",marginBottom:"0.75rem" }}>🔧</div>
            <div style={{ fontWeight:600,marginBottom:"0.4rem" }}>No paid tools listed yet</div>
            <div style={{ color:"var(--muted)",fontSize:"0.82rem" }}>
              Admins can list paid tools via the{" "}
              <a href="/_ap" style={{ color:"var(--accent)" }}>Admin Panel</a>.
            </div>
          </div>
        ) : (
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:"1rem" }}>
            {filteredPaid.map(tool => (
              <ToolCard key={tool.id} tool={{ ...tool, free:false }} onDeploy={setDeployTool} />
            ))}
          </div>
        )}
      </div>

      {/* How it works */}
      <div style={{
        background:"var(--bg2)",border:"1px solid var(--border)",borderRadius:"12px",
        padding:"1.5rem",display:"grid",
        gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"1.5rem",
      }}>
        {[
          { icon:"🔍", title:"Discover",    desc:"Browse free and paid AI tools" },
          { icon:"🚀", title:"Deploy",      desc:"One-script deploy to your own AI agent" },
          { icon:"⚡", title:"Pay per call", desc:"Paid tools settle instantly on XRPL" },
          { icon:"🔑", title:"No API keys", desc:"x402 payment IS the credential" },
        ].map(i => (
          <div key={i.title}>
            <div style={{ fontSize:"1.4rem",marginBottom:"0.4rem" }}>{i.icon}</div>
            <div style={{ fontWeight:600,marginBottom:"0.2rem",fontSize:"0.88rem" }}>{i.title}</div>
            <div style={{ color:"var(--muted)",fontSize:"0.8rem",lineHeight:1.5 }}>{i.desc}</div>
          </div>
        ))}
      </div>

      {/* Deploy Modal */}
      {deployTool && <DeployModal tool={deployTool} onClose={() => setDeployTool(null)} />}
    </div>
  );
}
