import React from "react";
import { useNavigate } from "react-router";
import { Zap, PackageCheck, Globe } from "lucide-react";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "var(--space-8) var(--space-5)",
      background: "var(--color-bg)",
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-8)" }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "var(--radius-full)",
          background: "#111111",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ color: "#fff", fontSize: "16px", fontWeight: 700, fontFamily: "var(--font-sans)" }}>R</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: "18px", color: "#111111", fontFamily: "var(--font-sans)" }}>
          Ritchy <span style={{ color: "#999999", fontWeight: 400 }}>P&amp;D</span>
        </span>
      </div>

      {/* Hero card */}
      <div style={{
        maxWidth: "480px", width: "100%",
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(0,0,0,0.07)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-8)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.90)",
        textAlign: "center",
      }}>
        <div style={{
          display: "inline-block",
          padding: "4px 14px",
          background: "rgba(0,0,0,0.05)",
          borderRadius: "var(--radius-full)",
          fontSize: "11px", letterSpacing: "0.07em", textTransform: "uppercase",
          color: "var(--color-text-muted)", marginBottom: "var(--space-5)",
          fontFamily: "var(--font-sans)",
        }}>
          Private Label E-Liquid
        </div>

        <h1 style={{
          margin: "0 0 var(--space-4)",
          fontSize: "38px", fontWeight: 700, lineHeight: 1.1,
          color: "var(--color-text-primary)", fontFamily: "var(--font-sans)",
        }}>
          Your brand.<br />7 days.
        </h1>

        <p style={{
          margin: "0 0 var(--space-6)",
          fontSize: "16px", color: "var(--color-text-secondary)",
          lineHeight: 1.6, fontFamily: "var(--font-sans)",
        }}>
          Design custom e-liquid packaging from your phone — no design skills needed.
        </p>

        <button
          onClick={() => navigate("/v2/order")}
          style={{
            width: "100%", padding: "14px 24px",
            background: "#111111", color: "#ffffff",
            border: "none", borderRadius: "var(--radius-md)",
            fontSize: "15px", fontWeight: 600, fontFamily: "var(--font-sans)",
            cursor: "pointer", transition: "opacity .15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          Start Your Order →
        </button>
      </div>

      {/* Trust badges */}
      <div style={{
        display: "flex", gap: "var(--space-6)", marginTop: "var(--space-6)",
        flexWrap: "wrap", justifyContent: "center",
      }}>
        {[
          { icon: <Zap size={14} />, text: "7-day turnaround" },
          { icon: <PackageCheck size={14} />, text: "No minimum order" },
          { icon: <Globe size={14} />, text: "EU compliant" },
        ].map(({ icon, text }) => (
          <div key={text} style={{
            display: "flex", alignItems: "center", gap: "6px",
            fontSize: "13px", color: "var(--color-text-secondary)",
            fontFamily: "var(--font-sans)",
          }}>
            {icon} {text}
          </div>
        ))}
      </div>
    </div>
  );
}
