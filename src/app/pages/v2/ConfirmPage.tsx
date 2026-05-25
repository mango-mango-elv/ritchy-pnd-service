import React, { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, Mail, FileText } from "lucide-react";

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

  const total = typeof order.estTotal === "number" ? order.estTotal : 0;

  const orderRows: [string, string][] = [
    ["Nicotine type", String(order.nicType ?? "—") === "salt" ? "Nicotine Salt" : "Free Base"],
    ["Flavor",        String(order.flavor   ?? "—")],
    ["Strength",      String(order.strength ?? "—")],
    ["Bottle size",   String(order.size     ?? "—")],
    ["Quantity",      order.qty ? Number(order.qty).toLocaleString() + " units" : "—"],
  ];

  const designRows: [string, string][] = [
    ["Template",  String(design.templateId ?? "—").replace(/-/g, " ")],
    ["Brand",     String(design.brandName ?? "—") || "—"],
    ["Flavor label", String(design.flavorName ?? "—") || "—"],
  ];

  const meta: [string, string][] = [
    ["Market",  String(compliance.market ?? "—").toUpperCase()],
    ["Account", String(user.email ?? "—")],
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
          Order submitted
        </h1>
        <p style={{
          margin: "0 0 var(--space-5)", fontSize: "15px",
          color: "var(--color-text-secondary)", maxWidth: "440px", lineHeight: 1.6,
        }}>
          Check your inbox for the pro-forma invoice and wire instructions. Production starts as soon as your payment is confirmed.
        </p>
        <div style={{
          display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center",
          marginBottom: "var(--space-6)",
        }}>
          {[
            { icon: <Mail size={13} />, label: "Pro-forma invoice sent" },
            { icon: <FileText size={13} />, label: "Wire instructions sent" },
          ].map(b => (
            <div key={b.label} style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "6px 12px",
              background: "rgba(22,163,74,0.08)",
              border: "1px solid rgba(22,163,74,0.2)",
              color: "#16a34a",
              borderRadius: "var(--radius-full)",
              fontSize: "12px", fontWeight: 500,
            }}>
              {b.icon} {b.label}
            </div>
          ))}
        </div>
        <button onClick={() => navigate("/v2")} className="ds-btn ds-btn-secondary">
          ← Back to start
        </button>
      </div>
    );
  }

  return (
    <div style={{ overflowY: "auto", padding: "var(--space-6) var(--space-5) var(--space-8)" }}>
      <div style={{ maxWidth: "640px", margin: "0 auto", display: "grid", gap: "var(--space-4)" }}>

        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
            Step 5 of 5
          </div>
          <h1 style={{ margin: "6px 0 0", fontSize: "26px", color: "var(--color-text-primary)" }}>Confirm &amp; Submit</h1>
          <p style={{ margin: "6px 0 0", color: "var(--color-text-secondary)", fontSize: "14px" }}>
            Review your order. After submission, we'll email a pro-forma invoice and wire instructions.
          </p>
        </div>

        <SummaryCard title="Product" rows={orderRows} />
        <SummaryCard title="Design"  rows={designRows} />
        <SummaryCard title="Account &amp; Market" rows={meta} />

        {/* Total + payment block */}
        <div style={{
          background: "rgba(17,17,17,0.04)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid rgba(0,0,0,0.06)",
          padding: "var(--space-5)",
          display: "flex", flexDirection: "column", gap: "var(--space-3)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>Estimated total</span>
            <span style={{ fontSize: "22px", fontWeight: 700, color: "var(--color-text-primary)" }}>
              €{total.toLocaleString()}
            </span>
          </div>
          <p style={{
            margin: 0, fontSize: "12px", color: "var(--color-text-muted)", lineHeight: 1.5,
          }}>
            We'll email your pro-forma invoice. Wire payment within 7 days to lock in your production slot. Production starts when payment is confirmed.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--space-2)" }}>
          <button onClick={() => navigate("/v2/compliance")} className="ds-btn ds-btn-secondary">← Back</button>
          <button
            onClick={() => setSubmitted(true)}
            className="ds-btn ds-btn-primary"
            style={{ minWidth: "180px" }}
          >
            Generate Invoice &amp; Submit
          </button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <section style={{
      background: "rgba(255,255,255,0.82)",
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      border: "1px solid rgba(0,0,0,0.07)",
      borderRadius: "var(--radius-lg)",
      padding: "var(--space-4) var(--space-5)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.90)",
    }}>
      <h2 style={{ margin: "0 0 var(--space-3)", fontSize: "12px", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {title}
      </h2>
      <div style={{ display: "grid" }}>
        {rows.map(([label, value]) => (
          <div key={label} style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            padding: "6px 0",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            fontSize: "13px",
          }}>
            <span style={{ color: "var(--color-text-muted)" }}>{label}</span>
            <span style={{ color: "var(--color-text-primary)", fontWeight: 500, textTransform: "capitalize", textAlign: "right" }}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
