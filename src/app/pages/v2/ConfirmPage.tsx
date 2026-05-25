import React, { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle } from "lucide-react";

function readSession<T>(key: string): T | null {
  try { return JSON.parse(sessionStorage.getItem(key) ?? "null"); }
  catch { return null; }
}

export function ConfirmPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const order      = readSession<Record<string, unknown>>("ritchy-v2-order") ?? {};
  const design     = readSession<Record<string, unknown>>("ritchy-v2-design") ?? {};
  const user       = readSession<Record<string, string>>("ritchy-v2-user") ?? {};
  const compliance = readSession<Record<string, string>>("ritchy-v2-compliance") ?? {};

  const rows: [string, string][] = [
    ["Flavor",    String(order.flavor   ?? "—")],
    ["Strength",  String(order.strength ?? "—")],
    ["Size",      String(order.size     ?? "—")],
    ["Quantity",  order.qty ? Number(order.qty).toLocaleString() : "—"],
    ["Template",  String(design.templateId ?? "—").replace(/-/g, " ")],
    ["Brand",     String(design.brandName ?? "—")],
    ["Market",    String(compliance.market ?? "—").toUpperCase()],
    ["Account",   String(user.email ?? "—")],
  ];

  if (submitted) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "var(--space-8) var(--space-5)",
        textAlign: "center",
      }}>
        <CheckCircle size={56} color="#16a34a" strokeWidth={1.5} style={{ marginBottom: "var(--space-5)" }} />
        <h1 style={{ margin: "0 0 var(--space-3)", fontSize: "28px", color: "var(--color-text-primary)" }}>
          Order submitted!
        </h1>
        <p style={{ margin: "0 0 var(--space-6)", fontSize: "15px", color: "var(--color-text-secondary)", maxWidth: "360px", lineHeight: 1.6 }}>
          We'll review your design and reach out within 24 hours to confirm production.
        </p>
        <button onClick={() => navigate("/v2")} className="ds-btn ds-btn-secondary">
          ← Back to start
        </button>
      </div>
    );
  }

  return (
    <div style={{ overflowY: "auto", padding: "var(--space-8) var(--space-5)" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", display: "grid", gap: "var(--space-5)" }}>

        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
            Step 5 of 5
          </div>
          <h1 style={{ margin: "8px 0 0", fontSize: "26px", color: "var(--color-text-primary)" }}>Confirm &amp; Submit</h1>
          <p style={{ margin: "8px 0 0", color: "var(--color-text-secondary)", fontSize: "14px" }}>
            Review your order details before submitting.
          </p>
        </div>

        <section style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(0,0,0,0.07)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-5)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.90)",
        }}>
          <h2 style={{ margin: "0 0 var(--space-4)", fontSize: "14px", fontWeight: 600, color: "var(--color-text-primary)" }}>
            Order Summary
          </h2>
          <div style={{ display: "grid", gap: "0" }}>
            {rows.map(([label, value]) => (
              <div key={label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "baseline",
                padding: "var(--space-2) 0",
                borderBottom: "1px solid rgba(0,0,0,0.05)",
                fontSize: "13px",
              }}>
                <span style={{ color: "var(--color-text-muted)" }}>{label}</span>
                <span style={{ color: "var(--color-text-primary)", fontWeight: 500, textTransform: "capitalize" }}>{value}</span>
              </div>
            ))}
          </div>
        </section>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={() => navigate("/v2/compliance")} className="ds-btn ds-btn-secondary">← Back</button>
          <button
            onClick={() => setSubmitted(true)}
            className="ds-btn ds-btn-primary"
            style={{ minWidth: "140px" }}
          >
            Submit Order
          </button>
        </div>
      </div>
    </div>
  );
}
