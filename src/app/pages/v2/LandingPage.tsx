import React from "react";
import { useNavigate } from "react-router";
import { Zap, ShieldCheck, Sparkles, Package, Mail, FileCheck, ArrowRight } from "lucide-react";

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
          <div style={{
            width: "30px", height: "30px", borderRadius: "var(--radius-full)",
            background: "#111111", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}>R</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: "15px", color: "#111111" }}>
            Ritchy <span style={{ color: "#999", fontWeight: 400 }}>P&amp;D</span>
          </span>
        </div>
        <button
          onClick={() => navigate("/login")}
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
        padding: "var(--space-10) var(--space-5)",
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
          Design, compliance, and manufacturing — all from your phone. No design skills, no minimum order, no commitment.
        </p>

        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => navigate("/v2/order")}
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
          <button
            onClick={() => navigate("/login")}
            className="ds-btn ds-btn-secondary"
            style={{ fontSize: "14px", padding: "13px 22px" }}
          >
            Talk to an Expert
          </button>
        </div>

        {/* Trust row */}
        <div style={{
          display: "flex", gap: "var(--space-6)", marginTop: "var(--space-6)",
          flexWrap: "wrap", justifyContent: "center",
        }}>
          {[
            { icon: <Zap size={14} />,         text: "7-day turnaround"     },
            { icon: <ShieldCheck size={14} />, text: "TPD Article 20"        },
            { icon: <Package size={14} />,     text: "No minimum order"      },
          ].map(({ icon, text }) => (
            <div key={text} style={{
              display: "flex", alignItems: "center", gap: "6px",
              fontSize: "13px", color: "var(--color-text-secondary)",
            }}>
              {icon} {text}
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{
        padding: "var(--space-8) var(--space-5)",
        maxWidth: "1120px", width: "100%", margin: "0 auto",
      }}>
        <div style={{ textAlign: "center", marginBottom: "var(--space-6)" }}>
          <div style={{ fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
            How it works
          </div>
          <h2 style={{ margin: "8px 0 0", fontSize: "28px", color: "var(--color-text-primary)" }}>
            Five steps to your branded product
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
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
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(0,0,0,0.07)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-4)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.90)",
            }}>
              <div style={{
                fontSize: "11px", color: "#2563eb", fontWeight: 600,
                letterSpacing: "0.08em", marginBottom: "var(--space-2)",
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

      {/* Compliance/regulation strip */}
      <section style={{
        padding: "var(--space-6) var(--space-5)",
        maxWidth: "1120px", width: "100%", margin: "0 auto",
      }}>
        <div style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(0,0,0,0.07)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-5) var(--space-6)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.90)",
          display: "flex", flexDirection: "column", gap: "var(--space-3)",
          alignItems: "center", textAlign: "center",
        }}>
          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", justifyContent: "center" }}>
            {["TPD Article 20", "REACH", "CLP", "PCN", "Child-proof packaging"].map(b => (
              <span key={b} style={{
                fontSize: "11px", fontWeight: 600,
                padding: "4px 10px",
                background: "rgba(37,99,235,0.08)",
                color: "#2563eb",
                borderRadius: "var(--radius-full)",
                letterSpacing: "0.04em",
              }}>
                {b}
              </span>
            ))}
          </div>
          <p style={{
            margin: 0, fontSize: "13px", color: "var(--color-text-secondary)",
            maxWidth: "600px", lineHeight: 1.6,
          }}>
            All products are manufactured to TPD Article 20 standards. We handle regulatory notifications for every EU market.
          </p>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{
        padding: "var(--space-8) var(--space-5) var(--space-10)",
        textAlign: "center",
      }}>
        <button
          onClick={() => navigate("/v2/order")}
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
          No credit card. No commitment. No sign-up required to start.
        </p>
      </section>
    </div>
  );
}
