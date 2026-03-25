
import React, { useState, useEffect } from "react";
import { Outlet, NavLink } from "react-router-dom";

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuOpen && !e.target.closest('.mobile-nav')) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
    
    return () => document.body.classList.remove('menu-open');
  }, [mobileMenuOpen]);

  const navContainer = {
    background: "var(--bg2)",
    borderRight: "1px solid var(--border)",
    padding: "1.5rem 1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    width: "260px",
    height: "100vh",
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 100,
    overflowY: "auto",
    overflowX: "hidden",
  };

  const mobileNavContainer = {
    background: "var(--bg2)",
    borderBottom: "1px solid var(--border)",
    padding: "1rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    width: "100%",
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 100,
  };

  const logo = {
    fontWeight: 800,
    fontSize: "1.2rem",
    background: "linear-gradient(135deg, #0ea5e9, #7c3aed)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    marginBottom: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    flexShrink: 0,
  };

  const mobileLogo = {
    fontWeight: 800,
    fontSize: "1.2rem",
    background: "linear-gradient(135deg, #0ea5e9, #7c3aed)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    flexShrink: 0,
  };

  const link = ({ isActive }) => ({
    color: isActive ? "var(--accent)" : "var(--muted)",
    fontWeight: 500,
    fontSize: "0.9rem",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    textDecoration: "none",
    transition: "all 0.2s",
    background: isActive ? "var(--accent)20" : "transparent",
    borderLeft: isActive ? "3px solid var(--accent)" : "3px solid transparent",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    cursor: "pointer",
    whiteSpace: "nowrap",
  });

  const mobileLink = ({ isActive }) => ({
    color: isActive ? "var(--accent)" : "var(--muted)",
    fontWeight: 500,
    fontSize: "0.9rem",
    padding: "0.75rem 1rem",
    borderRadius: "8px",
    textDecoration: "none",
    transition: "all 0.2s",
    background: isActive ? "var(--accent)20" : "transparent",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    cursor: "pointer",
  });

  const badge = {
    background: "linear-gradient(135deg, #0ea5e9, #7c3aed)",
    color: "#fff",
    fontSize: "0.7rem",
    fontWeight: 700,
    padding: "6px 12px",
    borderRadius: "99px",
    marginTop: "auto",
    textAlign: "center",
    flexShrink: 0,
  };

  const mobileBadge = {
    background: "linear-gradient(135deg, #0ea5e9, #7c3aed)",
    color: "#fff",
    fontSize: "0.65rem",
    fontWeight: 700,
    padding: "4px 12px",
    borderRadius: "99px",
    display: "inline-block",
  };

  const protocolSection = {
    marginTop: "auto",
    padding: "1rem 0.5rem",
    borderTop: "1px solid var(--border)",
    marginBottom: "1rem",
  };

  const mobileProtocolSection = {
    padding: "1rem 0 0.5rem 0",
    marginTop: "0.5rem",
    borderTop: "1px solid var(--border)",
  };

  const protocolText = {
    fontSize: "0.7rem",
    color: "var(--muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "0.5rem",
  };

  const protocolDesc = {
    fontSize: "0.75rem",
    color: "var(--text)",
    lineHeight: 1.4,
  };

  const mainContent = {
    marginLeft: "260px",
    padding: "2rem",
    minHeight: "100vh",
    width: "calc(100% - 260px)",
  };

  const mobileMainContent = {
    marginTop: "60px",
    padding: "1.5rem",
    width: "100%",
    minHeight: "calc(100vh - 60px)",
  };

  const mobileNavLinks = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginTop: "1rem",
  };

  const menuButton = {
    background: "none",
    border: "none",
    color: "var(--text)",
    fontSize: "1.5rem",
    cursor: "pointer",
    padding: "0.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav style={navContainer} className="desktop-nav">
        <div style={logo}>
          <span>⚡</span>
          <span>AgentPay</span>
        </div>
        
        <NavLink to="/" style={link} end>
          <span>🏪</span> Marketplace
        </NavLink>
        <NavLink to="/about" style={link}>
          <span>ℹ️</span> About
        </NavLink>
        <NavLink to="/list-tool" style={link}>
          <span>🛠️</span> List Your Tool
        </NavLink>
        
        <div style={protocolSection}>
          <div style={protocolText}>Protocol</div>
          <div style={protocolDesc}>
            Pay-per-call AI tools on XRPL via x402
          </div>
        </div>

        <div style={badge}>x402 · XRPL</div>
      </nav>

      {/* Mobile Navigation */}
      <nav style={mobileNavContainer} className="mobile-nav">
        <div style={mobileLogo}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span>⚡</span>
            <span>AgentPay</span>
          </span>
          <button 
            style={menuButton} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
        
        {mobileMenuOpen && (
          <div style={mobileNavLinks}>
            <NavLink to="/" style={mobileLink} onClick={() => setMobileMenuOpen(false)} end>
              <span>🏪</span> Marketplace
            </NavLink>
            <NavLink to="/about" style={mobileLink} onClick={() => setMobileMenuOpen(false)}>
              <span>ℹ️</span> About
            </NavLink>
            <NavLink to="/list-tool" style={mobileLink} onClick={() => setMobileMenuOpen(false)}>
              <span>🛠️</span> List Your Tool
            </NavLink>
            
            <div style={mobileProtocolSection}>
              <div style={protocolText}>Protocol</div>
              <div style={protocolDesc}>Pay-per-call AI tools on XRPL via x402</div>
            </div>
            
            <div style={{ padding: "0.5rem 0" }}>
              <span style={mobileBadge}>x402 · XRPL</span>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main style={isMobile ? mobileMainContent : mainContent}>
        <Outlet />
      </main>

      {/* Global styles for responsive behavior */}
      <style>{`
        @media (max-width: 767px) {
          .desktop-nav {
            display: none !important;
          }
        }
        
        @media (min-width: 768px) {
          .mobile-nav {
            display: none !important;
          }
        }
        
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        
        /* Prevent body scroll when mobile menu is open */
        body.menu-open {
          overflow: hidden;
          position: fixed;
          width: 100%;
          height: 100%;
        }
        
        /* Ensure proper scrolling on mobile */
        .mobile-nav {
          overflow-y: visible;
          z-index: 1000;
        }
        
        /* Smooth transition for mobile menu */
        .mobile-nav > div:last-child {
          animation: slideDown 0.3s ease;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Touch-friendly tap highlights */
        .mobile-nav button,
        .mobile-nav a {
          -webkit-tap-highlight-color: transparent;
        }
        
        /* Focus styles for accessibility */
        .mobile-nav button:focus-visible,
        .mobile-nav a:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
          border-radius: 4px;
        }
        
        /* Backdrop overlay when menu is open (optional) */
        body.menu-open::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 99;
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
