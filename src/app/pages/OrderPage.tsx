import React from "react";
import { useStageNav } from "../components/AppShell";

export function OrderPage() {
  const { goNext, goBack } = useStageNav();

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-8)", background: "var(--color-bg)" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", display: "grid", gap: "var(--space-5)" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
            Order
          </div>
          <h1 style={{ margin: "8px 0 0", fontSize: "30px", color: "var(--color-text-primary)" }}>Order basics</h1>
          <p style={{ margin: "10px 0 0", color: "var(--color-text-secondary)", fontSize: "14px" }}>
            Minimal ordering setup: SKU, quantity and expected production date.
          </p>
        </div>

        <section style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)" }}>
          <h2 style={{ margin: 0, fontSize: "16px", color: "var(--color-text-primary)" }}>Line item</h2>
          <div style={{ marginTop: "var(--space-4)", display: "grid", gap: "var(--space-4)", gridTemplateColumns: "1fr 1fr" }}>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "var(--color-text-secondary)" }}>SKU</label>
              <input className="ds-input" style={{ width: "100%" }} defaultValue="MANGO-ICE-10ML" />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "var(--color-text-secondary)" }}>Quantity</label>
              <input className="ds-input" style={{ width: "100%" }} type="number" min={0} defaultValue={10000} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "var(--color-text-secondary)" }}>Lead time (weeks)</label>
              <input className="ds-input" style={{ width: "100%" }} type="number" min={1} defaultValue={4} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "var(--color-text-secondary)" }}>Requested ship date</label>
              <input className="ds-input" style={{ width: "100%" }} type="date" />
            </div>
          </div>
        </section>

        <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-3)" }}>
          <button onClick={goBack} className="ds-btn ds-btn-secondary">← Back to Legal</button>
          <button onClick={goNext} className="ds-btn ds-btn-primary">Continue to Checkout →</button>
        </div>
      </div>
    </div>
  );
}
