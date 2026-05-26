import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";
import { DesignForm } from "./DesignForm";
import { PackagePreview } from "./PackagePreview";
import { TEMPLATES } from "./TemplateGrid";
import { COLOR_PRESETS, type DesignState, type SKU } from "./design-types";

export type { DesignState, SKU };

function readSession<T>(key: string, fallback: T): T {
  try { return JSON.parse(sessionStorage.getItem(key) ?? "null") ?? fallback; }
  catch { return fallback; }
}

let _id = 1;
function mkId() { return `sku-${_id++}`; }

export function DesignPageV2() {
  const navigate = useNavigate();

  const [design, setDesign] = useState<DesignState>(() => {
    const order = readSession<Record<string, unknown>>("ritchy-v2-order", {});
    const flavor = String(order.flavor ?? "Passion Fruit");
    const type   = order.nicType === "freebase" ? "freebase" : "salt" as const;
    const id = mkId();
    return {
      templateId:    "t1-flavor",
      brandName:     "",
      logoDataUrl:   "",
      logoScale:     1.0,
      skus:          [{
        id,
        displayName: flavor,
        type,
        flavor,
        strength: "20mg",
        colorTab: "presets",
        colorPresetId: "sunset",
        customColor: "#ea580c",
      }],
      selectedSkuId: id,
    };
  });

  const patch = (p: Partial<DesignState>) => setDesign(prev => ({ ...prev, ...p }));

  const patchSku = (skuId: string, p: Partial<SKU>) =>
    setDesign(prev => ({
      ...prev,
      skus: prev.skus.map(s => s.id === skuId ? { ...s, ...p } : s),
    }));

  const addSku = () => {
    if (design.skus.length >= 10) return;
    const id = mkId();
    // Cycle default preset color so each flavor gets its own color on creation
    const nextPreset = COLOR_PRESETS[design.skus.length % COLOR_PRESETS.length];
    setDesign(prev => ({
      ...prev,
      skus: [...prev.skus, {
        id,
        displayName: "New Flavor",
        type: "salt",
        flavor: "Passion Fruit",
        strength: "20mg",
        colorTab: "presets",
        colorPresetId: nextPreset.id,
        customColor: nextPreset.color,
      }],
      selectedSkuId: id,
    }));
  };

  const selectedSku    = design.skus.find(s => s.id === design.selectedSkuId) ?? design.skus[0];
  const selectedPreset = selectedSku
    ? (COLOR_PRESETS.find(p => p.id === selectedSku.colorPresetId) ?? COLOR_PRESETS[0])
    : COLOR_PRESETS[0];
  const activeGradient = selectedSku
    ? (selectedSku.colorTab === "custom"
      ? `linear-gradient(135deg, ${selectedSku.customColor} 0%, ${selectedSku.customColor} 100%)`
      : selectedPreset.gradient)
    : COLOR_PRESETS[0].gradient;

  const handleContinue = () => {
    sessionStorage.setItem("ritchy-v2-design", JSON.stringify({
      templateId:  design.templateId,
      brandName:   design.brandName,
      flavorName:  selectedSku?.displayName ?? "",
      tagline:     "",
      logoDataUrl: design.logoDataUrl,
      logoScale:   design.logoScale ?? 1.0,
      accentColor: selectedSku ? (selectedSku.colorTab === "custom" ? selectedSku.customColor : selectedPreset.color) : selectedPreset.color,
      background:  { id: selectedPreset.id, label: selectedPreset.label, style: activeGradient },
    }));
    navigate("/v2/signup");
  };

  return (
    <div className="v2-design-page">

      {/* ── Left sidebar: SKU list ── */}
      <aside className="v2-design-left">
        <div style={{
          padding: "10px 14px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          position: "sticky", top: 0,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(8px)",
          zIndex: 1,
        }}>
          <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
            Choose Flavor
          </span>
          <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
            {design.skus.length}/10
          </span>
        </div>

        <div className="v2-design-left-list">
          {design.skus.map(sku => {
            const active = design.selectedSkuId === sku.id;
            const skuPreset = COLOR_PRESETS.find(p => p.id === sku.colorPresetId) ?? COLOR_PRESETS[0];
            const skuGradient = sku.colorTab === "custom"
              ? `linear-gradient(135deg, ${sku.customColor} 0%, ${sku.customColor} 100%)`
              : skuPreset.gradient;
            return (
              <button
                key={sku.id}
                onClick={() => patch({ selectedSkuId: sku.id })}
                className="v2-sku-pill"
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 12px",
                  background: active ? "#111111" : "rgba(0,0,0,0.03)",
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "var(--font-sans)",
                }}
              >
                <div style={{
                  width: "26px", height: "26px",
                  borderRadius: "5px",
                  flexShrink: 0,
                  background: skuGradient,
                }} />
                <span style={{
                  fontSize: "var(--text-md)",
                  fontWeight: active ? 600 : 400,
                  color: active ? "#ffffff" : "var(--color-text-primary)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {sku.displayName}
                </span>
              </button>
            );
          })}

          {design.skus.length < 10 && (
            <button
              onClick={addSku}
              className="v2-sku-pill v2-sku-add"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                padding: "10px 12px",
                background: "transparent",
                border: "1px dashed var(--color-border)",
                borderRadius: "10px",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-md)",
                color: "var(--color-text-muted)",
              }}
            >
              <Plus size={14} /> Add more
            </button>
          )}
        </div>
      </aside>

      <div className="v2-design-stage">
      {/* ── Center: form ── */}
      <main className="v2-design-center">
        <div className="v2-design-center-inner">
          <div style={{ marginBottom: "12px", paddingTop: "2px" }}>
            <div style={{ fontSize: "var(--text-xs)", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
              Step 2 of 5
            </div>
            <h1 style={{ margin: "4px 0 0", fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--color-text-primary)" }}>
              Brand &amp; Design
            </h1>
          </div>

          <DesignForm
            design={design}
            patch={patch}
            selectedSku={selectedSku}
            patchSku={p => selectedSku && patchSku(selectedSku.id, p)}
          />

          {/* Mobile preview (below form on small screens) */}
          <div className="v2-design-preview-mobile">
            <PackagePreview
              templateId={design.templateId}
              brandName={design.brandName}
              flavorName={selectedSku?.displayName ?? ""}
              strength={selectedSku?.strength ?? "20mg"}
              nicType={selectedSku?.type ?? "salt"}
              gradient={activeGradient}
              logoDataUrl={design.logoDataUrl}
              logoScale={design.logoScale ?? 1.0}
            />
          </div>

          <div className="v2-design-center-footer">
            <button onClick={() => navigate("/v2/order")} className="ds-btn ds-btn-secondary">← Back</button>
            <button onClick={handleContinue} className="ds-btn ds-btn-primary">Continue →</button>
          </div>
        </div>
      </main>

      {/* ── Right: template top, preview bottom ── */}
      <aside className="v2-design-right">
        <div className="v2-design-right-card" style={{ display: "flex", flexDirection: "column" }}>
          {/* Template selector */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ marginBottom: "10px" }}>
              <div style={{ fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--color-text-primary)" }}>Template</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "2px" }}>
                Will be applied for all flavors in this line
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
              {TEMPLATES.map(t => {
                const active = design.templateId === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => patch({ templateId: t.id })}
                    title={t.label}
                    style={{
                      width: "100%",
                      aspectRatio: "1 / 1",
                      border: active ? "2px solid #111111" : "1.5px solid var(--color-border)",
                      borderRadius: "10px",
                      background: "transparent",
                      cursor: "pointer",
                      overflow: "hidden",
                      padding: 0,
                      position: "relative",
                      transition: "border-color .15s",
                    }}
                  >
                    {active ? (
                      <div style={{
                        width: "100%", height: "100%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        gap: "3px",
                        padding: "8px 6px",
                        background: "#fff",
                      }}>
                        <MiniBottle gradient={activeGradient} />
                        <MiniBox templateId={t.id} gradient={activeGradient} brand={design.brandName || "BRAND"} flavor={selectedSku?.displayName || "FLAVOR"} active />
                      </div>
                    ) : (
                      <MiniBox templateId={t.id} gradient="rgba(0,0,0,0.12)" brand="BRAND" flavor="FLAVOR" />
                    )}
                    {active && (
                      <div style={{
                        position: "absolute", bottom: "5px", right: "5px",
                        width: "16px", height: "16px",
                        background: "#111111",
                        borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(0,0,0,0.06)", margin: "16px 0", flexShrink: 0 }} />

          {/* Preview — dynamically sized to fit height and width perfectly */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, minHeight: 0 }}>
            <div style={{
              width: "100%",
              height: "100%",
              maxHeight: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 0,
              padding: "12px 32px",
              boxSizing: "border-box",
            }}>
              <PackagePreview
                templateId={design.templateId}
                brandName={design.brandName}
                flavorName={selectedSku?.displayName ?? ""}
                strength={selectedSku?.strength ?? "20mg"}
                nicType={selectedSku?.type ?? "salt"}
                gradient={activeGradient}
                logoDataUrl={design.logoDataUrl}
                logoScale={design.logoScale ?? 1.0}
              />
            </div>
          </div>
        </div>
      </aside>
      </div>
    </div>
  );
}

function MiniBottle({ gradient }: { gradient: string }) {
  return (
    <div style={{
      width: "30%",
      aspectRatio: "1 / 2.6",
      borderRadius: "2px",
      border: "1px solid rgba(0,0,0,0.10)",
      display: "flex", flexDirection: "column",
      overflow: "hidden",
      background: "rgba(255,255,255,0.55)",
    }}>
      <div style={{ flex: 1 }} />
      <div style={{ height: "44%", background: gradient }} />
    </div>
  );
}

type MiniInnerProps = { gradient: string; brand: string; flavor: string };

/* active=true → fits inside the 54%-wide sub-slot next to MiniBottle */
/* active=false (default) → fills the whole button via position:absolute */
function MiniBox({ templateId, gradient, brand, flavor, active = false }: MiniInnerProps & { templateId: string; active?: boolean }) {
  const Inner = MINI_BOX_MAP[templateId] ?? null;

  if (!Inner) {
    return (
      <div style={{
        ...(active
          ? { width: "54%", aspectRatio: "200 / 290" }
          : { position: "absolute", inset: 0 }),
        background: "rgba(0,0,0,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "7px", color: "rgba(0,0,0,0.3)", fontFamily: "var(--font-sans)",
      }}>
        soon
      </div>
    );
  }

  /* Scale factor: 200px reference width → thumbnail slot width */
  const scale = active ? 0.14 : 0.27;
  return (
    <div style={{
      ...(active
        ? { width: "54%", aspectRatio: "200 / 290" }
        : { position: "absolute", inset: 0 }),
      overflow: "hidden",
      borderRadius: active ? "2px" : 0,
      position: active ? "relative" : "absolute",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: "200px", height: "290px",
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}>
        <Inner gradient={gradient} brand={brand} flavor={flavor} />
      </div>
    </div>
  );
}

const MINI_BOX_MAP: Record<string, React.FC<MiniInnerProps>> = {
  "t1-flavor":   MiniBoxT1,
  "t2-centered": MiniBoxT2,
};

function MiniBoxT1({ gradient, brand, flavor }: { gradient: string; brand: string; flavor: string }) {
  return (
    <div style={{ position: "relative", width: "200px", height: "290px", overflow: "hidden", borderRadius: "4px" }}>
      <div style={{ position: "absolute", inset: 0, background: gradient }} />
      <p style={{ position: "absolute", top: "4.1%", left: "7.3%", margin: 0, fontSize: "14px", fontWeight: 800, color: "#fff", textTransform: "uppercase", lineHeight: 1.1, fontFamily: "var(--font-sans)" }}>{flavor.slice(0, 12)}</p>
      <p style={{ position: "absolute", top: "22.3%", left: "7.3%", margin: 0, fontSize: "8px", fontWeight: 500, color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-sans)" }}>Nic salt · 20mg</p>
      <div style={{ position: "absolute", top: "27.27%", left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.4)" }} />
      <p style={{ position: "absolute", top: "57.58%", left: "6.71%", right: "47.56%", margin: 0, fontSize: "10px", fontWeight: 900, color: "#fff", textTransform: "uppercase", lineHeight: 1.1, fontFamily: "var(--font-sans)" }}>{brand.slice(0, 10)}</p>
      <div style={{ position: "absolute", top: "68%", left: 0, right: 0, bottom: 0, border: "5px solid #000", background: "#fff" }} />
    </div>
  );
}

function MiniBoxT2({ gradient, brand, flavor }: { gradient: string; brand: string; flavor: string }) {
  return (
    <div style={{ position: "relative", width: "200px", height: "290px", overflow: "hidden", borderRadius: "4px" }}>
      <div style={{ position: "absolute", inset: 0, background: gradient }} />
      <div style={{ position: "absolute", inset: "15.43% 0 70.25% 0", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6%" }}>
        <p style={{ margin: 0, fontSize: "24px", fontWeight: 900, color: "#fff", textTransform: "uppercase", textAlign: "center", lineHeight: 0.9, wordBreak: "break-word", fontFamily: "var(--font-sans)" }}>{brand.slice(0, 10)}</p>
      </div>
      <div style={{ position: "absolute", top: "56.47%", left: "6.71%", right: "6.71%", height: "1px", background: "rgba(255,255,255,0.4)" }} />
      <p style={{ position: "absolute", top: "58.5%", left: 0, right: 0, margin: 0, fontSize: "13px", fontWeight: 800, color: "#fff", textTransform: "uppercase", textAlign: "center", fontFamily: "var(--font-sans)" }}>{flavor.slice(0, 12)}</p>
      <div style={{ position: "absolute", top: "68%", left: 0, right: 0, bottom: 0, border: "5px solid #000", background: "#fff" }} />
    </div>
  );
}
