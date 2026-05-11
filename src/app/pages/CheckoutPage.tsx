import React from "react";
import { useStageNav } from "../components/AppShell";

export function CheckoutPage() {
  const { goBack } = useStageNav();

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
          <button className="ds-btn ds-btn-primary">Place order</button>
        </div>
      </div>
    </div>
  );
}
