import React from "react";
import { ArrowRight, CheckCircle2, Building2, PackageCheck, ShieldCheck } from "lucide-react";
import { useStageNav } from "../components/AppShell";

const BRIEF_ITEMS = [
  {
    icon: Building2,
    label: "Brand owner",
    value: "Ritchy Private Label",
    detail: "EU-facing nicotine pouch and vape retail partners",
  },
  {
    icon: PackageCheck,
    label: "Launch scope",
    value: "4 flavor SKUs",
    detail: "Mango Ice, Arctic Mint, Blueberry, Golden Peach",
  },
  {
    icon: ShieldCheck,
    label: "Compliance track",
    value: "EU warning baseline",
    detail: "Warning panel and review step included before order",
  },
] as const;

export function InfoPage() {
  const { goNext } = useStageNav();

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-8)", background: "var(--color-bg)" }}>
      <div style={{ maxWidth: "980px", margin: "0 auto", display: "grid", gap: "var(--space-5)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "var(--space-6)", alignItems: "stretch" }}>
          <section style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-8)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: 360,
          }}>
            <div>
              <div style={{ fontSize: "11px", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
                Project brief
              </div>
              <h1 style={{ margin: "10px 0 0", fontSize: "34px", lineHeight: 1.08, color: "var(--color-text-primary)" }}>
                Turn a private label request into a production-ready packaging line.
              </h1>
              <p style={{ margin: "14px 0 0", maxWidth: 560, color: "var(--color-text-secondary)", fontSize: "14px", lineHeight: 1.65 }}>
                The client starts with a structured brief, moves into visual packaging design, reviews compliance text, and submits the order draft without losing context in chat threads.
              </p>
            </div>

            <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-8)" }}>
              <button
                type="button"
                onClick={goNext}
                className="ds-btn ds-btn-primary"
                style={{ padding: "10px 22px", fontWeight: 700 }}
              >
                Start designing <ArrowRight size={14} />
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: "7px", color: "var(--color-text-secondary)", fontSize: "13px" }}>
                <CheckCircle2 size={15} style={{ color: "#0f766e" }} />
                Demo brief pre-filled
              </div>
            </div>
          </section>

          <section style={{
            background: "var(--color-surface-raised)",
            border: "1px solid var(--color-border-light)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-6)",
            display: "grid",
            gap: "var(--space-4)",
          }}>
            {BRIEF_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "38px 1fr",
                    gap: "var(--space-3)",
                    paddingBottom: "var(--space-4)",
                    borderBottom: "1px solid var(--color-border-light)",
                  }}
                >
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(201,75,42,0.10)",
                    color: "var(--color-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Icon size={17} />
                  </div>
                  <div>
                    <div style={{ fontSize: "11px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {item.label}
                    </div>
                    <div style={{ marginTop: "4px", fontSize: "15px", fontWeight: 700, color: "var(--color-text-primary)" }}>
                      {item.value}
                    </div>
                    <div style={{ marginTop: "4px", fontSize: "12px", color: "var(--color-text-secondary)", lineHeight: 1.45 }}>
                      {item.detail}
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        </div>

        <section style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-6)",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--space-4)" }}>
            {["Brief", "Design", "Legal", "Order"].map((label, idx) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: "var(--radius-full)",
                  background: idx === 0 ? "var(--color-accent)" : "var(--color-surface-raised)",
                  border: "1px solid var(--color-border)",
                  color: idx === 0 ? "#fff" : "var(--color-text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 700,
                }}>
                  {idx + 1}
                </div>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--color-text-primary)" }}>{label}</div>
                  <div style={{ marginTop: "2px", fontSize: "11px", color: "var(--color-text-muted)" }}>
                    {idx === 0 ? "Ready" : "Next"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
