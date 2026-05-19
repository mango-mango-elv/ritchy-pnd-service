import React from "react";
import { useStageNav } from "../components/AppShell";

export function LegalPage() {
  const { goNext, goBack } = useStageNav();

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-8)" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", display: "grid", gap: "var(--space-5)" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
            Legal
          </div>
          <h1 style={{ margin: "8px 0 0", fontSize: "30px", color: "var(--color-text-primary)" }}>Compliance basics</h1>
          <p style={{ margin: "10px 0 0", color: "var(--color-text-secondary)", fontSize: "14px" }}>
            Quick draft of regulatory and warning information before sending order to production.
          </p>
        </div>

        <section style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(0,0,0,0.07)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-6)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.90)",
        }}>
          <h2 style={{ margin: 0, fontSize: "16px", color: "var(--color-text-primary)" }}>Market and warning text</h2>
          <div style={{ marginTop: "var(--space-4)", display: "grid", gap: "var(--space-4)" }}>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "var(--color-text-secondary)" }}>Target market</label>
              <select className="ds-input" style={{ width: "100%" }} defaultValue="eu">
                <option value="eu">EU</option>
                <option value="uk">UK</option>
                <option value="us">US</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "var(--color-text-secondary)" }}>Warning text</label>
              <textarea
                className="ds-input"
                style={{ width: "100%", minHeight: "110px", resize: "vertical" }}
                defaultValue="This product contains nicotine which is a highly addictive substance."
              />
            </div>
            <label style={{ display: "flex", gap: "8px", alignItems: "center", color: "var(--color-text-secondary)", fontSize: "13px" }}>
              <input type="checkbox" defaultChecked />
              Confirm label and warning were reviewed
            </label>
          </div>
        </section>

        <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-3)" }}>
          <button onClick={goBack} className="ds-btn ds-btn-secondary">← Back to Design</button>
          <button onClick={goNext} className="ds-btn ds-btn-primary">Continue to Order →</button>
        </div>
      </div>
    </div>
  );
}
