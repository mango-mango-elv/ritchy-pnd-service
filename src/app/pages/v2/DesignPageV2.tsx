import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";
import { Toaster, toast } from "sonner";
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
  const [aiRunning, setAiRunning] = useState(false);

  const [design, setDesign] = useState<DesignState>(() => {
    const order = readSession<Record<string, unknown>>("ritchy-v2-order", {});
    const savedDesign = readSession<Record<string, any>>("ritchy-v2-design", {});
    const flavor = String(order.flavor ?? "Passion Fruit");
    const type   = order.nicType === "freebase" ? "freebase" : "salt" as const;
    const id = mkId();
    return {
      templateId:    savedDesign.templateId ?? "t1-flavor",
      brandName:     savedDesign.brandName ?? "",
      logoDataUrl:   savedDesign.logoDataUrl ?? "",
      logoScale:     savedDesign.logoScale ?? 1.0,
      healthWarningText: savedDesign.healthWarningText ?? "This product contains nicotine which is a highly addictive substance.",
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

  const getGraphicsDefaultColor = (sku: SKU) => {
    if (sku.colorPresetId === "alabaster" || sku.colorPresetId === "gold") {
      return "black";
    }
    return "white";
  };
  const activeGraphicsTab = selectedSku
    ? (selectedSku.graphicsColorTab ?? getGraphicsDefaultColor(selectedSku))
    : "white";
  const activeGraphicsColor = activeGraphicsTab === "custom"
    ? (selectedSku?.graphicsCustomColor ?? "#ffffff")
    : (activeGraphicsTab === "black" ? "#252525" : "#ffffff");

  const isBrandCompleted = !!(design.brandName.trim() || design.logoDataUrl);
  const isColorCompleted = selectedSku
    ? (selectedSku.colorTab !== "image" || !!selectedSku.bgImageDataUrl)
    : false;
  const isFlavorCompleted = selectedSku ? selectedSku.displayName.trim() !== "" : false;
  const canProceed = isBrandCompleted && isColorCompleted && isFlavorCompleted;

  const handleContinue = () => {
    if (!isBrandCompleted) {
      toast.error("Please specify Brand Name or upload a Logo");
      return;
    }
    if (!isColorCompleted) {
      toast.error("Please upload a Background Image");
      return;
    }
    if (!isFlavorCompleted) {
      toast.error("Please specify Flavor Name");
      return;
    }
    sessionStorage.setItem("ritchy-v2-design", JSON.stringify({
      templateId:  design.templateId,
      brandName:   design.brandName,
      flavorName:  selectedSku?.displayName ?? "",
      tagline:     "",
      logoDataUrl: design.logoDataUrl,
      logoScale:   design.logoScale ?? 1.0,
      accentColor: selectedSku ? (selectedSku.colorTab === "custom" ? selectedSku.customColor : selectedPreset.color) : selectedPreset.color,
      graphicsColor: activeGraphicsColor,
      background:  { id: selectedPreset.id, label: selectedPreset.label, style: activeGradient },
      healthWarningText: design.healthWarningText,
    }));
    navigate("/signup");
  };

  return (
    <div className="v2-design-page">
      <Toaster richColors position="top-center" />

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
        <div className="v2-design-center-scroll">
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
            aiRunning={aiRunning}
            setAiRunning={setAiRunning}
          />


        </div>

        <div className="v2-design-center-footer">
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", gap: "12px" }}>
            <button onClick={() => navigate("/order")} className="v2-footer-btn v2-footer-btn-secondary">← Back</button>
            <button onClick={handleContinue} disabled={!canProceed} className="v2-footer-btn v2-footer-btn-primary" style={{ opacity: canProceed ? 1 : 0.5, cursor: canProceed ? 'pointer' : 'not-allowed' }}>Continue →</button>
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
            <div className="v2-template-selector-list">
              {TEMPLATES.map(t => {
                const active = design.templateId === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => patch({ templateId: t.id })}
                    title={t.label}
                    className="v2-template-selector-btn"
                    style={{
                      aspectRatio: "1 / 1",
                      border: active ? "2px solid #111111" : "1.5px solid var(--color-border)",
                      borderRadius: "10px",
                      background: "#ffffff",
                      cursor: "pointer",
                      overflow: "hidden",
                      padding: 0,
                      position: "relative",
                      transition: "border-color .15s",
                    }}
                  >
                    <div style={{
                      width: "100%", height: "100%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      overflow: "hidden",
                      background: "#ffffff",
                      pointerEvents: "none",
                    }}>
                      <div style={{
                        width: "300px",
                        height: "347px",
                        flexShrink: 0,
                        transform: "scale(0.16)",
                        transformOrigin: "center center",
                      }}>
                        <PackagePreview
                          templateId={t.id}
                          brandName={active ? design.brandName : "BRAND"}
                          flavorName={active ? (selectedSku?.displayName || "FLAVOR") : "FLAVOR"}
                          strength={active ? (selectedSku?.strength || "20mg") : "20mg"}
                          nicType={active ? (selectedSku?.type || "salt") : "salt"}
                          gradient={active ? activeGradient : "linear-gradient(135deg, #e4e4e7 0%, #a1a1aa 100%)"}
                          logoDataUrl={active ? design.logoDataUrl : ""}
                          logoScale={active ? (design.logoScale ?? 1.0) : 1.0}
                          bgImageDataUrl={active ? selectedSku?.bgImageDataUrl : ""}
                          bgImagePositionBox={active ? selectedSku?.bgImagePositionBox : undefined}
                          bgImageScaleBox={active ? (selectedSku?.bgImageScaleBox ?? 1.0) : 1.0}
                          bgImagePositionBottle={active ? selectedSku?.bgImagePositionBottle : undefined}
                          bgImageScaleBottle={active ? (selectedSku?.bgImageScaleBottle ?? 1.0) : 1.0}
                          colorTab={active ? selectedSku?.colorTab : "presets"}
                          graphicsColor={active ? activeGraphicsColor : "#ffffff"}
                          healthWarningText={active ? design.healthWarningText : undefined}
                        />
                      </div>
                    </div>
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
            <div 
              className={aiRunning ? "v2-ai-shimmer v2-ai-shimmer-pulse" : ""}
              style={{
                width: "100%",
                height: "100%",
                maxHeight: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 0,
                padding: "12px 32px",
                boxSizing: "border-box",
                transition: "all 0.3s ease",
              }}
            >
              <PackagePreview
                templateId={design.templateId}
                brandName={design.brandName}
                flavorName={selectedSku?.displayName ?? ""}
                strength={selectedSku?.strength ?? "20mg"}
                nicType={selectedSku?.type ?? "salt"}
                gradient={activeGradient}
                logoDataUrl={design.logoDataUrl}
                logoScale={design.logoScale ?? 1.0}
                bgImageDataUrl={selectedSku?.bgImageDataUrl}
                bgImagePositionBox={selectedSku?.bgImagePositionBox}
                bgImageScaleBox={selectedSku?.bgImageScaleBox ?? 1.0}
                bgImagePositionBottle={selectedSku?.bgImagePositionBottle}
                bgImageScaleBottle={selectedSku?.bgImageScaleBottle ?? 1.0}
                onBgPositionBoxChange={pos => selectedSku && patchSku(selectedSku.id, { bgImagePositionBox: pos })}
                onBgPositionBottleChange={pos => selectedSku && patchSku(selectedSku.id, { bgImagePositionBottle: pos })}
                colorTab={selectedSku?.colorTab}
                graphicsColor={activeGraphicsColor}
                healthWarningText={design.healthWarningText}
              />
            </div>
          </div>
        </div>
      </aside>
      </div>
    </div>
  );
}


