import React, { useState, useRef } from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { useStageNav } from "../components/AppShell";

export function CheckoutPage() {
  const { goBack } = useStageNav();
  const navigate = useNavigate();
  const [ordered, setOrdered] = useState(false);
  const orderIdRef = useRef(
    `ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`
  );

  if (ordered) {
    return (
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--color-bg)", padding: "var(--space-8)",
      }}>
        <div style={{ maxWidth: "480px", width: "100%", textAlign: "center", display: "grid", gap: "var(--space-5)" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{
              width: "80px", height: "80px", borderRadius: "50%",
              background: "rgba(26, 122, 94, 0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <CheckCircle size={44} style={{ color: "#1A7A5E" }} />
            </div>
          </div>

          <div>
            <h1 style={{ margin: "0 0 8px", fontSize: "28px", color: "var(--color-text-primary)" }}>Order submitted</h1>
            <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-muted)", fontFamily: "var(--font-mono, monospace)" }}>
              {orderIdRef.current}
            </p>
          </div>

          <div style={{
            background: "var(--color-surface)", border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)", padding: "var(--space-5)", textAlign: "left",
          }}>
            <div style={{
              fontSize: "11px", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase",
              color: "var(--color-text-muted)", marginBottom: "var(--space-4)",
            }}>
              What happens next
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              {[
                { label: "Design review", detail: "Our team reviews your artwork — 1–2 business days" },
                { label: "Sample approval", detail: "You receive a physical sample for sign-off" },
                { label: "Production start", detail: "Full run begins after your written approval" },
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", gap: "var(--space-3)", alignItems: "flex-start" }}>
                  <div style={{
                    width: "24px", height: "24px", borderRadius: "50%",
                    background: "var(--color-accent)", color: "#fff",
                    fontSize: "11px", fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: "1px",
                  }}>
                    {i + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-text-primary)" }}>{step.label}</div>
                    <div style={{ fontSize: "13px", color: "var(--color-text-muted)", marginTop: "2px" }}>{step.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="ds-btn ds-btn-secondary"
            style={{ width: "100%", justifyContent: "center" }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-8)", background: "var(--color-bg)" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", display: "grid", gap: "var(--space-5)" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
            Checkout
          </div>
          <h1 style={{ margin: "8px 0 0", fontSize: "30px", color: "var(--color-text-primary)" }}>Final review</h1>
          <p style={{ margin: "10px 0 0", color: "var(--color-text-secondary)", fontSize: "14px" }}>
            Simple summary before placing an order.
          </p>
        </div>

        <section style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)" }}>
          <h2 style={{ margin: 0, fontSize: "16px", color: "var(--color-text-primary)" }}>Order summary</h2>
          <div style={{ marginTop: "var(--space-4)", display: "grid", gap: "10px", color: "var(--color-text-secondary)", fontSize: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>SKU</span><strong style={{ color: "var(--color-text-primary)" }}>MANGO-ICE-10ML</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Quantity</span><strong style={{ color: "var(--color-text-primary)" }}>10,000 pcs</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Estimated total</span><strong style={{ color: "var(--color-text-primary)" }}>$4,800</strong>
            </div>
          </div>

          <div style={{ marginTop: "var(--space-5)" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "var(--color-text-secondary)" }}>Promo code (optional)</label>
            <input className="ds-input" style={{ width: "100%" }} placeholder="Enter code" />
          </div>
        </section>

        <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-3)" }}>
          <button onClick={goBack} className="ds-btn ds-btn-secondary">← Back to Order</button>
          <button onClick={() => setOrdered(true)} className="ds-btn ds-btn-primary">Place order</button>
        </div>
      </div>
    </div>
  );
}
