import React from "react";
import { useNavigate } from "react-router";
import { ShieldCheck, Sparkles, Package, Mail, FileCheck, ArrowRight } from "lucide-react";
import ritchyLogo from "../../../assets/ritchy_logo.svg";

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      background: "var(--color-bg)",
    }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "var(--space-4) var(--space-5)",
        maxWidth: "1120px", width: "100%", margin: "0 auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <img src={ritchyLogo} alt="Ritchy" style={{ height: "30px", width: "auto", display: "block" }} />
          <span style={{ fontWeight: 400, fontSize: "15px", color: "#999" }}>
            Brand Factory
          </span>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="ds-btn ds-btn-secondary"
          style={{ fontSize: "12px" }}
        >
          Sign in
        </button>
      </div>

      {/* Hero */}
      <section style={{
        flex: "0 0 auto",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "clamp(64px, 12vh, 110px) var(--space-5) var(--space-12)",
        textAlign: "center",
        maxWidth: "1120px", width: "100%", margin: "0 auto",
      }}>
        <div style={{
          display: "inline-block",
          padding: "5px 14px",
          background: "rgba(0,0,0,0.05)",
          borderRadius: "var(--radius-full)",
          fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase",
          color: "var(--color-text-muted)", marginBottom: "var(--space-5)",
        }}>
          Private Label E-Liquid
        </div>

        <h1 style={{
          margin: "0 0 var(--space-4)",
          fontSize: "clamp(36px, 7vw, 64px)", fontWeight: 700, lineHeight: 1.05,
          color: "var(--color-text-primary)", maxWidth: "780px",
          letterSpacing: "-0.02em",
        }}>
          Your brand in <span style={{ color: "#2563eb" }}>7 days</span>.
        </h1>

        <p style={{
          margin: "0 0 var(--space-6)",
          fontSize: "17px", color: "var(--color-text-secondary)",
          lineHeight: 1.6, maxWidth: "560px",
        }}>
          Design, compliance, and manufacturing — all from your phone.
        </p>

        <button
          onClick={() => navigate("/order")}
          style={{
            padding: "14px 28px",
            background: "#111111", color: "#ffffff",
            border: "none", borderRadius: "var(--radius-md)",
            fontSize: "15px", fontWeight: 600, fontFamily: "var(--font-sans)",
            cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: "8px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          }}
        >
          Start Configuring <ArrowRight size={16} />
        </button>
        <p style={{
          margin: "var(--space-3) 0 0",
          fontSize: "12px", color: "var(--color-text-muted)",
        }}>
          No credit card · no sign-up required to start
        </p>
      </section>

      {/* How it works */}
      <section style={{
        padding: "var(--space-12) var(--space-5)",
        maxWidth: "1120px", width: "100%", margin: "0 auto",
      }}>
        <div style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
          <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
            How it works
          </div>
          <h2 style={{ margin: "8px 0 0", fontSize: "28px", color: "var(--color-text-primary)" }}>
            Five steps to your branded product
          </h2>
        </div>

        <div style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center",
          gap: "var(--space-3)",
        }}>
          {[
            { n: "01", icon: <Package size={18} />,     title: "Order Contents", body: "Pick flavor, strength, bottle size, and quantity." },
            { n: "02", icon: <Sparkles size={18} />,    title: "Brand & Design", body: "Choose a template, colors, background — or AI-generate one." },
            { n: "03", icon: <Mail size={18} />,        title: "Save & Sign Up", body: "Save your design with email — come back anytime." },
            { n: "04", icon: <ShieldCheck size={18} />, title: "Compliance",     body: "We check your label against TPD, REACH, CLP, PCN." },
            { n: "05", icon: <FileCheck size={18} />,   title: "Confirm & Submit", body: "Review, get a pro-forma invoice, production starts on payment." },
          ].map(step => (
            <div key={step.n} style={{
              flex: "1 1 190px", minWidth: "180px", maxWidth: "215px",
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(0,0,0,0.07)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-5)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.90)",
            }}>
              <div style={{
                fontSize: "11px", color: "#2563eb", fontWeight: 600,
                letterSpacing: "0.08em", marginBottom: "var(--space-3)",
              }}>{step.n}</div>
              <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                marginBottom: "var(--space-2)",
              }}>
                <span style={{ color: "var(--color-text-primary)" }}>{step.icon}</span>
                <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "var(--color-text-primary)" }}>
                  {step.title}
                </h3>
              </div>
              <p style={{
                margin: 0, fontSize: "13px", color: "var(--color-text-secondary)",
                lineHeight: 1.5,
              }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance note */}
      <section style={{
        padding: "var(--space-10) var(--space-5) var(--space-12)",
        maxWidth: "1120px", width: "100%", margin: "0 auto",
        textAlign: "center",
      }}>
        <p style={{
          margin: "0 auto", fontSize: "13px", color: "var(--color-text-muted)",
          maxWidth: "620px", lineHeight: 1.6,
        }}>
          Manufactured to TPD Article 20 standards. We handle REACH, CLP and PCN notifications for every EU market.
        </p>
      </section>
    </div>
  );
}
