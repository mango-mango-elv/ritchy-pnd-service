import React, { useState } from "react";
import { useNavigate } from "react-router";

const FLAVORS = [
  "Passion Fruit", "Mango Ice", "Blue Raspberry", "Watermelon",
  "Spearmint", "Menthol", "Strawberry", "Tobacco", "Lemon", "Custom",
];
const STRENGTHS = ["0 mg", "3 mg", "6 mg", "12 mg", "20 mg"];
const SIZES     = ["10 ml", "30 ml", "60 ml", "100 ml"];
const QUANTITIES = [500, 1000, 5000, 10000, 20000];

export function OrderContentsPage() {
  const navigate = useNavigate();
  const [flavor, setFlavor]           = useState("Passion Fruit");
  const [customFlavor, setCustomFlavor] = useState("");
  const [strength, setStrength]       = useState("20 mg");
  const [size, setSize]               = useState("10 ml");
  const [qty, setQty]                 = useState(1000);

  const handleContinue = () => {
    sessionStorage.setItem("ritchy-v2-order", JSON.stringify({
      flavor: flavor === "Custom" ? customFlavor : flavor,
      strength, size, qty,
    }));
    navigate("/v2/design");
  };

  return (
    <div style={{ overflowY: "auto", padding: "var(--space-8) var(--space-5)" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", display: "grid", gap: "var(--space-5)" }}>

        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
            Step 1 of 5
          </div>
          <h1 style={{ margin: "8px 0 0", fontSize: "26px", color: "var(--color-text-primary)" }}>Order Contents</h1>
          <p style={{ margin: "8px 0 0", color: "var(--color-text-secondary)", fontSize: "14px" }}>
            Configure your e-liquid order before moving to design.
          </p>
        </div>

        <Card title="Choose Flavor">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
            {FLAVORS.map(f => (
              <PillBtn key={f} label={f} active={flavor === f} onClick={() => setFlavor(f)} />
            ))}
          </div>
          {flavor === "Custom" && (
            <input
              className="ds-input"
              style={{ marginTop: "var(--space-3)", width: "100%" }}
              placeholder="Enter your flavor name…"
              value={customFlavor}
              onChange={e => setCustomFlavor(e.target.value)}
            />
          )}
        </Card>

        <Card title="Nicotine Strength">
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {STRENGTHS.map(s => <OptionBtn key={s} label={s} active={strength === s} onClick={() => setStrength(s)} />)}
          </div>
        </Card>

        <Card title="Bottle Size">
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {SIZES.map(s => <OptionBtn key={s} label={s} active={size === s} onClick={() => setSize(s)} />)}
          </div>
        </Card>

        <Card title="Quantity">
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {QUANTITIES.map(q => (
              <OptionBtn key={q} label={q.toLocaleString()} active={qty === q} onClick={() => setQty(q)} />
            ))}
          </div>
        </Card>

        <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "var(--space-8)" }}>
          <button onClick={() => navigate("/v2")} className="ds-btn ds-btn-secondary">← Back</button>
          <button onClick={handleContinue} className="ds-btn ds-btn-primary">Continue to Design →</button>
        </div>

      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{
      background: "rgba(255,255,255,0.82)",
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      border: "1px solid rgba(0,0,0,0.07)",
      borderRadius: "var(--radius-lg)",
      padding: "var(--space-5)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.90)",
    }}>
      <h2 style={{ margin: "0 0 var(--space-4)", fontSize: "14px", fontWeight: 600, color: "var(--color-text-primary)" }}>{title}</h2>
      {children}
    </section>
  );
}

function PillBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 14px",
      border: active ? "2px solid #2563eb" : "1px solid var(--color-border)",
      borderRadius: "var(--radius-full)",
      background: active ? "rgba(37,99,235,0.08)" : "transparent",
      color: active ? "#2563eb" : "var(--color-text-secondary)",
      fontSize: "13px", fontFamily: "var(--font-sans)", cursor: "pointer",
      fontWeight: active ? 600 : 400,
    }}>
      {label}
    </button>
  );
}

function OptionBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 16px",
      border: active ? "2px solid #2563eb" : "1px solid var(--color-border)",
      borderRadius: "var(--radius-md)",
      background: active ? "rgba(37,99,235,0.08)" : "transparent",
      color: active ? "#2563eb" : "var(--color-text-secondary)",
      fontSize: "13px", fontFamily: "var(--font-sans)", cursor: "pointer",
      fontWeight: active ? 600 : 400,
    }}>
      {label}
    </button>
  );
}
