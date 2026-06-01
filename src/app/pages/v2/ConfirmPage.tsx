import React, { useState } from "react";
import { useNavigate } from "react-router";
import { CheckCircle, Mail, FileText } from "lucide-react";

function readSession<T>(key: string): T | null {
  try { return JSON.parse(sessionStorage.getItem(key) ?? "null"); }
  catch { return null; }
}

// Spot unit price by total volume — mirrors the tiers in OrderContentsPage so the
// Confirm total stays correct even when qty/estTotal weren't persisted (deep-link,
// partial save, legacy data).
function getSpotUnitPrice(qty: number): number {
  if (qty >= 1000000) return 0.48;
  if (qty >= 500000) return 0.52;
  if (qty >= 250000) return 0.58;
  if (qty >= 100000) return 0.68;
  if (qty >= 50000) return 0.80;
  if (qty >= 25000) return 0.95;
  if (qty >= 10000) return 1.15;
  if (qty >= 5000) return 1.30;
  if (qty >= 2500) return 1.45;
  if (qty >= 1000) return 1.80;
  return 2.45;
}

export function ConfirmPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const order      = readSession<Record<string, unknown>>("ritchy-v2-order") ?? {};
  const design     = readSession<Record<string, unknown>>("ritchy-v2-design") ?? {};
  const user       = readSession<Record<string, string>>("ritchy-v2-user") ?? {};
  const compliance = readSession<Record<string, string>>("ritchy-v2-compliance") ?? {};

  // Derive totals from the SKU list so the figures are correct even when the
  // persisted qty/estTotal scalars are missing or stale.
  const skuList = Array.isArray(order.skus) ? (order.skus as any[]) : [];
  const derivedQty = skuList.reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);
  const qty = typeof order.qty === "number" && order.qty > 0 ? order.qty : derivedQty;

  let total: number;
  if (typeof order.estTotal === "number" && order.estTotal > 0) {
    total = order.estTotal;
  } else if (order.pricingMode === "subscribe" && order.subscriptionPlan) {
    const plan = order.subscriptionPlan as any;
    total = qty * (Number(plan.pricePerUnit) || 0);
  } else {
    total = qty * getSpotUnitPrice(qty);
  }

  const orderRows: [string, string][] = [];
  
  if (order.pricingMode === "subscribe" && order.subscriptionPlan) {
    const plan = order.subscriptionPlan as any;
    orderRows.push(["Pricing Mode", `Subscription (${plan.name})`]);
    orderRows.push(["Annual Commit", `${Number(plan.annualUnits).toLocaleString()} bottles/year`]);
  } else {
    orderRows.push(["Pricing Mode", "Spot (one-time)"]);
  }

  if (order.skus && Array.isArray(order.skus) && order.skus.length > 0) {
    order.skus.forEach((sku: any, idx: number) => {
      const typeLabel = sku.nicotineType === "salt" ? "Salt" : "Freebase";
      orderRows.push([
        `SKU #${idx + 1}: ${sku.flavorName}`,
        `${sku.strength}mg ${typeLabel} × ${Number(sku.quantity).toLocaleString()} units`
      ]);
    });
    orderRows.push(["Total Quantity", `${qty.toLocaleString()} units`]);
  } else {
    orderRows.push(["Nicotine type", String(order.nicType ?? "—") === "salt" ? "Nicotine Salt" : "Free Base"]);
    orderRows.push(["Flavor",        String(order.flavor   ?? "—")]);
    orderRows.push(["Strength",      String(order.strength ?? "—")]);
    orderRows.push(["Quantity",      order.qty ? Number(order.qty).toLocaleString() + " units" : "—"]);
  }


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
        <button onClick={() => navigate("/")} className="ds-btn ds-btn-secondary">
          ← Back to start
        </button>
      </div>
    );
  }

  return (
    <div className="v2-page-container">
      <div style={{ maxWidth: "640px", margin: "0 auto", display: "grid", gap: "var(--space-4)" }}>

        <div>
          <h1 className="v2-step-title">Confirm &amp; Submit</h1>
          <p className="v2-step-subtitle">
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
              €{total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <p style={{
            margin: 0, fontSize: "12px", color: "var(--color-text-muted)", lineHeight: 1.5,
          }}>
            We'll email your pro-forma invoice. Wire payment within 7 days to lock in your production slot. Production starts when payment is confirmed.
          </p>
        </div>

        <div className="v2-nav-footer">
          <button onClick={() => navigate("/compliance")} className="v2-footer-btn v2-footer-btn-secondary">← Back</button>
          <button
            onClick={() => setSubmitted(true)}
            className="v2-footer-btn v2-footer-btn-primary"
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
