import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllTools } from "../lib/api.js";

export default function ToolDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    async function loadTool() {
      try {
        setLoading(true);
        const tools = await getAllTools();
        if (!isMounted) return;
        
        const t = tools.find((t) => t.id === id);
        if (!t) {
          navigate("/");
          return;
        }
        
        setTool(t);
        
        // Set default inputs based on tool type
        if (t.id === "web-scraper") setInput("https://example.com");
        if (t.id === "ai-summarizer") setInput("Artificial intelligence is transforming the world at an unprecedented pace...");
        if (t.id === "code-executor") setInput("print('Hello from AgentPay!')\nfor i in range(5):\n    print(f'  {i*i}')");
      } catch (error) {
        console.error("Failed to load tools:", error);
        if (isMounted) navigate("/");
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    
    loadTool();
    
    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  async function testTool() {
    if (!tool) return;
    
    setTesting(true);
    setResult(null);
    
    try {
      const BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8080";
      const isPost = tool.method === "POST";
      let url = `${BASE}${tool.path}`;
      let opts = { 
        method: tool.method ?? "GET", 
        headers: { "Content-Type": "application/json" } 
      };

      // Build request based on tool type
      if (tool.id === "web-scraper") {
        url += `?url=${encodeURIComponent(input)}`;
      } else if (isPost) {
        let body = {};
        if (tool.id === "ai-summarizer") body = { text: input };
        else if (tool.id === "code-executor") body = { code: input };
        opts.body = JSON.stringify(body);
      }

      const response = await fetch(url, opts);
      const text = await response.text();
      
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
      
      setResult({ status: response.status, data });
    } catch (e) {
      setResult({ status: "error", data: { error: e.message } });
    } finally {
      setTesting(false);
    }
  }

  const agentSnippet = tool ? `import { x402Fetch } from "x402-xrpl";
import { Wallet } from "xrpl";

const wallet = Wallet.fromSeed(process.env.XRPL_BUYER_SEED);
const fetchPaid = x402Fetch({ wallet, network: "xrpl:0" });

const res = await fetchPaid(
  "https://your-agentpay-server.com${tool.path}${tool.id === "web-scraper" ? "?url=https://example.com" : ""}",
  { 
    method: "${tool.method ?? "GET"}",
    headers: { "Content-Type": "application/json" }${tool.method === "POST" ? `,
    body: JSON.stringify({ ${tool.id === "ai-summarizer" ? 'text: "your text"' : 'code: "print(42)"'} })` : ""}
  }
);
const data = await res.json();
console.log(data);` : "";

  if (loading) return <p style={{ color: "var(--muted)" }}>Loading…</p>;
  if (!tool) return <p style={{ color: "var(--muted)" }}>Tool not found</p>;

  const xrp = tool.price_drops ? (parseInt(tool.price_drops, 10) / 1_000_000).toFixed(4) : "0.0000";

  return (
    <div>
      <button 
        onClick={() => navigate("/")} 
        style={{
          background: "none", 
          border: "1px solid var(--border)", 
          color: "var(--muted)",
          padding: "6px 12px", 
          borderRadius: "6px", 
          cursor: "pointer", 
          marginBottom: "1.5rem", 
          fontSize: "0.85rem"
        }}
      >
        ← Back
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Left */}
        <div>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>{tool.icon}</div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "0.5rem" }}>{tool.name}</h1>
          <p style={{ color: "var(--muted)", lineHeight: 1.6, marginBottom: "1.5rem" }}>{tool.description}</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {[
              ["Price", `${xrp} XRP`],
              ["Drops", tool.price_drops || "0"],
              ["Method", tool.method ?? "GET"],
              ["Asset", tool.asset || "XRP"],
              ["Category", tool.category || "General"],
              ["Endpoint", tool.path],
            ].map(([k, v]) => (
              <div key={k} style={{ background: "var(--bg2)", borderRadius: "8px", padding: "0.75rem", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginBottom: "2px" }}>{k}</div>
                <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "0.85rem", fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Agent code snippet */}
          <div style={{ background: "var(--bg3)", borderRadius: "10px", padding: "1rem", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: "0.5rem", fontWeight: 600 }}>
              AGENT CLIENT SNIPPET (TypeScript)
            </div>
            <pre style={{
              fontFamily: "JetBrains Mono, monospace", fontSize: "0.72rem",
              color: "#a5f3fc", whiteSpace: "pre-wrap", lineHeight: 1.6
            }}>{agentSnippet}</pre>
          </div>
        </div>

        {/* Right — Test Panel */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem" }}>
          <h2 style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "1rem" }}>🧪 Live Test Panel</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.8rem", marginBottom: "1rem" }}>
            Note: Direct browser calls will get a <strong style={{ color: "var(--amber)" }}>402 Payment Required</strong> without a funded XRPL wallet. Use the agent client for real paid calls.
          </p>

          {(tool.id === "web-scraper" || tool.id === "ai-summarizer" || tool.id === "code-executor") && (
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontSize: "0.8rem", color: "var(--muted)", display: "block", marginBottom: "4px" }}>
                {tool.id === "web-scraper" ? "URL to scrape" : tool.id === "ai-summarizer" ? "Text to summarize" : "Python code"}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={tool.id === "code-executor" ? 5 : 3}
                style={{
                  width: "100%", 
                  background: "var(--bg3)", 
                  border: "1px solid var(--border)",
                  borderRadius: "8px", 
                  padding: "0.75rem", 
                  color: "var(--text)",
                  fontFamily: tool.id === "code-executor" ? "JetBrains Mono, monospace" : "inherit",
                  fontSize: "0.82rem", 
                  resize: "vertical",
                }}
              />
            </div>
          )}

          <button
            onClick={testTool}
            disabled={testing}
            style={{
              background: testing ? "var(--border)" : "linear-gradient(135deg, #0ea5e9, #7c3aed)",
              color: "#fff", 
              border: "none", 
              padding: "10px 20px", 
              borderRadius: "8px",
              cursor: testing ? "not-allowed" : "pointer", 
              fontWeight: 600, 
              fontSize: "0.88rem",
              width: "100%", 
              marginBottom: "1rem",
            }}
          >
            {testing ? "Calling…" : `Call ${tool.path}`}
          </button>

          {result && (
            <div style={{
              background: "var(--bg3)", 
              borderRadius: "8px", 
              padding: "1rem",
              border: `1px solid ${result.status === 200 ? "var(--green)" : result.status === 402 ? "var(--amber)" : "var(--red)"}`,
            }}>
              <div style={{
                fontSize: "0.75rem", 
                fontWeight: 700, 
                marginBottom: "0.5rem",
                color: result.status === 200 ? "var(--green)" : result.status === 402 ? "var(--amber)" : "var(--red)",
              }}>
                HTTP {result.status}
              </div>
              <pre style={{
                fontFamily: "JetBrains Mono, monospace", 
                fontSize: "0.72rem",
                whiteSpace: "pre-wrap", 
                color: "var(--text)", 
                maxHeight: "300px", 
                overflow: "auto"
              }}>
                {typeof result.data === "object" ? JSON.stringify(result.data, null, 2) : result.data}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
