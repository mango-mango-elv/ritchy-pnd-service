import React, { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { COLOR_PRESETS, type DesignState, type SKU } from "./design-types";

const FLAVOR_OPTIONS = [
  "Passion Fruit", "Mango", "Watermelon", "Blueberry", "Strawberry",
  "Peach", "Grape", "Raspberry", "Lemon", "Classic Tobacco",
  "Virginia Tobacco", "Menthol", "Spearmint", "Peppermint",
  "Vanilla Custard", "Cheesecake", "Caramel", "Coffee", "Cola",
];

interface Props {
  design: DesignState;
  patch: (p: Partial<DesignState>) => void;
  selectedSku: SKU | undefined;
  patchSku: (p: Partial<SKU>) => void;
}

export function DesignForm({ design, patch, selectedSku, patchSku }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [aiRunning, setAiRunning] = useState(false);

  const handleLogoFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => patch({ logoDataUrl: e.target?.result as string });
    reader.readAsDataURL(file);
  };

  const handleAIGenerate = () => {
    if (!selectedSku) return;
    setAiRunning(true);
    patchSku({ colorTab: "ai" });
    setTimeout(() => {
      const pick = COLOR_PRESETS[Math.floor(Math.random() * COLOR_PRESETS.length)];
      patchSku({ colorPresetId: pick.id, colorTab: "presets", customColor: pick.color });
      setAiRunning(false);
    }, 1500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>

      {/* ── Brand ── */}
      <Card first>
        <CardTitle>Brand</CardTitle>
        <p style={{ margin: "0 0 10px", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
          Will be applied for all flavors in this line
        </p>
        <input
          className="ds-input"
          placeholder="EARTH VAPOR"
          value={design.brandName}
          onChange={e => patch({ brandName: e.target.value })}
          style={{ fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "10px" }}
        />
        <label style={{ display: "block", marginBottom: "5px", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
          Upload logo
        </label>
        <div
          onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) handleLogoFile(f); }}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          style={{
            border: "1.5px dashed var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "10px",
            textAlign: "center",
            cursor: "pointer",
            color: "var(--color-text-muted)",
            fontSize: "12px",
            background: "rgba(0,0,0,0.02)",
            fontFamily: "var(--font-sans)",
          }}
        >
          {design.logoDataUrl
            ? <img src={design.logoDataUrl} alt="logo" style={{ maxHeight: "40px", maxWidth: "100%", objectFit: "contain" }} />
            : <>📤 Drag &amp; Drop or Click to upload</>
          }
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoFile(f); }} />
      </Card>

      {/* ── Color ── */}
      <Card>
        <CardTitle>Color</CardTitle>

        {/* Tab bar */}
        <div style={{
          display: "flex", gap: "2px", marginBottom: "12px",
          background: "rgba(0,0,0,0.05)", borderRadius: "8px", padding: "3px",
        }}>
          {(["presets", "custom", "ai"] as const).map(tab => {
            const isActive = selectedSku ? (selectedSku.colorTab === tab && !(tab === "ai" && !aiRunning)) : false;
            const label = tab === "presets" ? "Presets" : tab === "custom" ? "Custom Colors" : "Ai Generate";
            return (
              <button
                key={tab}
                onClick={() => tab === "ai" ? handleAIGenerate() : patchSku({ colorTab: tab })}
                style={{
                  flex: 1, padding: "6px 4px",
                  border: "none",
                  borderRadius: "6px",
                  background: isActive ? "#111111" : "transparent",
                  color: isActive ? "#ffffff" : "var(--color-text-secondary)",
                  fontSize: "12px", fontFamily: "var(--font-sans)",
                  fontWeight: isActive ? 600 : 400,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {tab === "ai" && aiRunning ? <Loader2 size={12} className="animate-spin" style={{ display: "inline-block" }} /> : label}
              </button>
            );
          })}
        </div>

        {selectedSku && (selectedSku.colorTab === "presets" || selectedSku.colorTab === "ai") && (
          <div style={{ display: "grid", gap: "6px" }}>
            {COLOR_PRESETS.map(preset => {
              const active = selectedSku.colorPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => patchSku({ colorPresetId: preset.id, colorTab: "presets", customColor: preset.color })}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "10px 12px",
                    border: active ? "1.5px solid #111111" : "1.5px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    background: active ? "rgba(0,0,0,0.03)" : "transparent",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
                  <div style={{
                    width: "20px", height: "20px",
                    borderRadius: "50%",
                    background: preset.gradient,
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: "var(--text-md)",
                    fontWeight: active ? 600 : 400,
                    color: "var(--color-text-primary)",
                    flex: 1,
                  }}>
                    {preset.label}
                  </span>
                  {active && (
                    <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {selectedSku && selectedSku.colorTab === "custom" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <label style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>Pick a color</label>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="color"
                value={selectedSku.customColor}
                onChange={e => patchSku({ customColor: e.target.value })}
                style={{ width: "40px", height: "40px", border: "none", borderRadius: "8px", cursor: "pointer", padding: 0, flexShrink: 0 }}
              />
              <input
                className="ds-input"
                value={selectedSku.customColor}
                onChange={e => patchSku({ customColor: e.target.value })}
                placeholder="#6b21a8"
                style={{ flex: 1, fontFamily: "monospace", fontSize: "13px" }}
              />
            </div>
          </div>
        )}
      </Card>

      {/* ── Flavor (per-SKU) ── */}
      {selectedSku && (
        <Card>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "8px", gap: "8px", flexWrap: "wrap" }}>
            <h3 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--color-text-primary)" }}>
              Flavor
            </h3>
            <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>
              {selectedSku.displayName}
            </span>
          </div>
          <div style={{ display: "grid", gap: "10px" }}>

            <Field label="Unique name">
              <input
                className="ds-input"
                placeholder="JUICY GRAPE"
                value={selectedSku.displayName}
                onChange={e => patchSku({ displayName: e.target.value })}
                style={{ fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}
              />
            </Field>

            <Field label="Type">
              <select
                className="ds-input"
                value={selectedSku.type}
                onChange={e => patchSku({ type: e.target.value as "salt" | "freebase" })}
                style={{ appearance: "auto" }}
              >
                <option value="salt">Nicotine Salt</option>
                <option value="freebase">Free Base</option>
              </select>
            </Field>

            <Field label="Choose flavor">
              <select
                className="ds-input"
                value={selectedSku.flavor}
                onChange={e => patchSku({ flavor: e.target.value })}
                style={{ appearance: "auto" }}
              >
                {FLAVOR_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </Field>

            <Field label="Strength">
              <div style={{ display: "flex", gap: "8px" }}>
                {(["10mg", "20mg"] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => patchSku({ strength: s })}
                    style={{
                      padding: "7px 22px",
                      border: selectedSku.strength === s ? "2px solid #111111" : "1.5px solid var(--color-border)",
                      borderRadius: "var(--radius-full)",
                      background: selectedSku.strength === s ? "#111111" : "transparent",
                      color: selectedSku.strength === s ? "#ffffff" : "var(--color-text-secondary)",
                      fontSize: "13px", fontFamily: "var(--font-sans)", fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>

          </div>
        </Card>
      )}

    </div>
  );
}

function Card({ children, first }: { children: React.ReactNode; first?: boolean }) {
  return (
    <section style={{
      padding: "14px 0",
      borderTop: first ? "none" : "1px solid rgba(0,0,0,0.06)",
    }}>
      {children}
    </section>
  );
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ margin: "0 0 8px", fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--color-text-primary)" }}>
      {children}
    </h3>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", marginBottom: "5px", fontSize: "12px", color: "var(--color-text-secondary)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
