import React, { useState } from "react";
import { CheckCircle2, FileText, PackageCheck } from "lucide-react";
import { useStageNav } from "../components/AppShell";

export function CheckoutPage() {
  const { goBack } = useStageNav();
  const [isPlaced, setIsPlaced] = useState(false);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-8)", background: "var(--color-bg)" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", display: "grid", gap: "var(--space-5)" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
            Checkout
          </div>
          <h1 style={{ margin: "8px 0 0", fontSize: "30px", color: "var(--color-text-primary)" }}>Final review</h1>
          <p style={{ margin: "10px 0 0", color: "var(--color-text-secondary)", fontSize: "14px" }}>
            Confirm the production request package before it goes to manager review.
          </p>
        </div>

        {isPlaced && (
          <section style={{
            background: "rgba(16,185,129,0.10)",
            border: "1px solid rgba(15,118,110,0.24)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-6)",
            display: "grid",
            gridTemplateColumns: "44px 1fr",
            gap: "var(--space-4)",
            alignItems: "start",
          }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: "var(--radius-full)",
              background: "#0f766e",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "18px", color: "var(--color-text-primary)" }}>Order draft created</h2>
              <p style={{ margin: "8px 0 0", color: "var(--color-text-secondary)", fontSize: "14px", lineHeight: 1.55 }}>
                The packaging line, legal warning baseline, and production quantities are bundled for manager review. The next step would be generating artwork files and a supplier-ready order packet.
              </p>
            </div>
          </section>
        )}

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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Review status</span><strong style={{ color: "#0f766e" }}>{isPlaced ? "Ready for manager review" : "Draft ready"}</strong>
            </div>
          </div>

          <div style={{ marginTop: "var(--space-5)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
            <div style={{
              border: "1px solid var(--color-border-light)",
              borderRadius: "var(--radius-md)",
              background: "var(--color-surface-raised)",
              padding: "var(--space-4)",
              display: "flex",
              gap: "var(--space-3)",
              alignItems: "center",
            }}>
              <FileText size={17} style={{ color: "var(--color-accent)" }} />
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-text-primary)" }}>Legal text included</div>
                <div style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "2px" }}>EU baseline warning</div>
              </div>
            </div>
            <div style={{
              border: "1px solid var(--color-border-light)",
              borderRadius: "var(--radius-md)",
              background: "var(--color-surface-raised)",
              padding: "var(--space-4)",
              display: "flex",
              gap: "var(--space-3)",
              alignItems: "center",
            }}>
              <PackageCheck size={17} style={{ color: "var(--color-accent)" }} />
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-text-primary)" }}>Production packet</div>
                <div style={{ fontSize: "11px", color: "var(--color-text-muted)", marginTop: "2px" }}>Artwork, SKU, quantity</div>
              </div>
            </div>
          </div>
        </section>

        <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-3)" }}>
          <button type="button" onClick={goBack} className="ds-btn ds-btn-secondary">← Back to Order</button>
          <button
            type="button"
            onClick={() => setIsPlaced(true)}
            className="ds-btn ds-btn-primary"
            disabled={isPlaced}
            style={{ opacity: isPlaced ? 0.7 : 1, cursor: isPlaced ? "default" : "pointer" }}
          >
            {isPlaced ? "Order draft created" : "Place order draft"}
          </button>
        </div>
      </div>
    </div>
  );
}
