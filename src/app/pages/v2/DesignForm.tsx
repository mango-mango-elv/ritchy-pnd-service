import React, { useRef, useState } from "react";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
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
  aiRunning: boolean;
  setAiRunning: (run: boolean) => void;
}

export function DesignForm({ design, patch, selectedSku, patchSku, aiRunning, setAiRunning }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOverLogo, setDragOverLogo] = useState(false);
  const [dragOverBg, setDragOverBg] = useState(false);
  const [brandExpanded, setBrandExpanded] = useState(() => {
    return !(design.brandName.trim() || design.logoDataUrl);
  });
  const [colorExpanded, setColorExpanded] = useState(() => {
    const brandCompleted = !!(design.brandName.trim() || design.logoDataUrl);
    return brandCompleted;
  });
  const [flavorExpanded, setFlavorExpanded] = useState(false);
  const [colorTouched, setColorTouched] = useState(false);
  const [flavorTouched, setFlavorTouched] = useState(false);

  const isBrandCompleted = !!(design.brandName.trim() || design.logoDataUrl);
  const isColorCompleted = selectedSku
    ? (selectedSku.colorTab !== "image" || !!selectedSku.bgImageDataUrl)
    : false;
  const isFlavorCompleted = selectedSku ? selectedSku.displayName.trim() !== "" : false;

  const handleLogoFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      patch({ logoDataUrl: e.target?.result as string });
      setBrandExpanded(false); // auto-collapse accordion on logo upload
      setColorExpanded(true); // auto-expand color
    };
    reader.readAsDataURL(file);
  };

  const bgFileRef = useRef<HTMLInputElement>(null);
  const handleBgFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      if (selectedSku) {
        patchSku({
          bgImageDataUrl: e.target?.result as string,
          bgImagePositionBox: { x: 0, y: 0 },
          bgImageScaleBox: 1.0,
          bgImagePositionBottle: { x: 0, y: 0 },
          bgImageScaleBottle: 1.0,
        });
        setColorExpanded(false); // auto-collapse color
        setColorTouched(true);
        setFlavorExpanded(true); // auto-expand flavor
      }
    };
    reader.readAsDataURL(file);
  };

  const scale = design.logoScale ?? 1.0;
  const adjustScale = (amount: number) => {
    const next = Math.min(2.0, Math.max(0.5, parseFloat((scale + amount).toFixed(2))));
    patch({ logoScale: next });
  };

  const handleAIGenerate = () => {
    if (!selectedSku) return;
    setAiRunning(true);
    patchSku({ colorTab: "ai" });
    setTimeout(() => {
      const pick = COLOR_PRESETS[Math.floor(Math.random() * COLOR_PRESETS.length)];
      patchSku({ colorPresetId: pick.id, colorTab: "presets", customColor: pick.color });
      setAiRunning(false);
      setColorTouched(true);
      setColorExpanded(false); // auto-collapse color
      setFlavorExpanded(true); // auto-expand flavor
    }, 1500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>

      {/* ── Brand ── */}
      <Card first>
        <div
          onClick={() => setBrandExpanded(!brandExpanded)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            userSelect: "none",
            padding: "4px 0",
            marginBottom: brandExpanded ? "8px" : 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
            <h3 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--color-text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
              {isBrandCompleted && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              Brand
            </h3>
            {!brandExpanded && (design.brandName.trim() || design.logoDataUrl) && (
              <span style={{
                fontSize: "11px",
                color: "var(--color-text-muted)",
                background: "rgba(0,0,0,0.04)",
                padding: "2px 8px",
                borderRadius: "100px",
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "200px",
              }}>
                {design.brandName.trim() && <span>Name: {design.brandName}</span>}
                {design.brandName.trim() && design.logoDataUrl && <span style={{ opacity: 0.5 }}>•</span>}
                {design.logoDataUrl && <span>Logo loaded</span>}
              </span>
            )}
          </div>
          <div style={{ color: "var(--color-text-muted)", display: "flex", alignItems: "center" }}>
            {brandExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>

        <div className={`v2-accordion-wrapper ${brandExpanded ? "expanded" : ""}`}>
          <div className="v2-accordion-content" style={{ display: "flex", flexDirection: "column" }}>
            <p style={{ margin: "0 0 10px", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
              Will be applied for all flavors in this line
            </p>
            {!design.logoDataUrl && (
              <>
                <input
                  className="ds-input"
                  placeholder="EARTH VAPOR"
                  value={design.brandName}
                  onChange={e => patch({ brandName: e.target.value })}
                  onBlur={() => {
                    if (design.brandName.trim()) {
                      setBrandExpanded(false); // auto-collapse on brand input blur
                      setColorExpanded(true); // auto-expand color
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                  style={{ fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "10px" }}
                />
              </>
            )}
            
            {!design.logoDataUrl && (
              <>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
                  Upload logo
                </label>
                <div
                  onDrop={e => { e.preventDefault(); setDragOverLogo(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) handleLogoFile(f); }}
                  onDragOver={e => { e.preventDefault(); setDragOverLogo(true); }}
                  onDragEnter={e => { e.preventDefault(); setDragOverLogo(true); }}
                  onDragLeave={e => { e.preventDefault(); setDragOverLogo(false); }}
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: dragOverLogo ? "2px dashed #111111" : "1.5px dashed var(--color-border)",
                    boxShadow: dragOverLogo ? "0 0 0 3px rgba(17,17,17,0.06)" : "none",
                    borderRadius: "var(--radius-md)",
                    padding: "16px",
                    textAlign: "center",
                    cursor: "pointer",
                    color: dragOverLogo ? "#111111" : "var(--color-text-muted)",
                    fontSize: "12px",
                    background: dragOverLogo ? "rgba(17,17,17,0.03)" : "rgba(0,0,0,0.02)",
                    fontFamily: "var(--font-sans)",
                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  📤 Drag & Drop or Click to upload
                </div>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoFile(f); }} />
              </>
            )}
          </div>
        </div>

        {brandExpanded && design.logoDataUrl && (
          <div style={{ display: "flex", flexDirection: "column", marginTop: "12px" }}>
            <div style={{
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "10px",
              background: "rgba(0,0,0,0.02)",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <img src={design.logoDataUrl} alt="logo" style={{ maxHeight: "40px", maxWidth: "60%", objectFit: "contain" }} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    patch({ logoDataUrl: "", logoScale: 1.0 });
                    setBrandExpanded(true); // Re-open accordion if logo is removed
                  }}
                  style={{
                    border: "none",
                    background: "rgba(220, 38, 38, 0.08)",
                    color: "#dc2626",
                    padding: "6px 12px",
                    borderRadius: "var(--radius-md)",
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ✕ Remove
                </button>
              </div>

              {/* Logo scaling selector */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "12px",
                borderTop: "1px solid rgba(0,0,0,0.06)",
              }}>
                <span style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", fontWeight: 500 }}>
                  Logo Size
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <button
                    onClick={() => adjustScale(-0.1)}
                    disabled={scale <= 0.5}
                    style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      border: "1px solid var(--color-border)", background: "#fff",
                      color: "var(--color-text-primary)", display: "flex",
                      alignItems: "center", justifyContent: "center", fontSize: "16px",
                      fontWeight: 600, cursor: scale <= 0.5 ? "not-allowed" : "pointer",
                      opacity: scale <= 0.5 ? 0.5 : 1, userSelect: "none",
                      transition: "background 0.15s, border-color 0.15s",
                    }}
                    onMouseEnter={e => scale > 0.5 && (e.currentTarget.style.background = "rgba(0,0,0,0.03)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
                  >
                    −
                  </button>
                  <span style={{
                    fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-primary)",
                    width: "48px", textAlign: "center", fontFamily: "monospace",
                  }}>
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    onClick={() => adjustScale(0.1)}
                    disabled={scale >= 2.0}
                    style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      border: "1px solid var(--color-border)", background: "#fff",
                      color: "var(--color-text-primary)", display: "flex",
                      alignItems: "center", justifyContent: "center", fontSize: "16px",
                      fontWeight: 600, cursor: scale >= 2.0 ? "not-allowed" : "pointer",
                      opacity: scale >= 2.0 ? 0.5 : 1, userSelect: "none",
                      transition: "background 0.15s, border-color 0.15s",
                    }}
                    onMouseEnter={e => scale < 2.0 && (e.currentTarget.style.background = "rgba(0,0,0,0.03)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* ── Color ── */}
      <Card>
        <div
          onClick={() => setColorExpanded(!colorExpanded)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            userSelect: "none",
            padding: "4px 0",
            marginBottom: colorExpanded ? "8px" : 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
            <h3 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--color-text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
              {isColorCompleted && colorTouched && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              Color
            </h3>
            {!colorExpanded && selectedSku && (
              <span style={{
                fontSize: "11px",
                color: "var(--color-text-muted)",
                background: "rgba(0,0,0,0.04)",
                padding: "2px 8px",
                borderRadius: "100px",
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "200px",
              }}>
                {selectedSku.colorTab === "presets" && (
                  <span>Preset: {COLOR_PRESETS.find(p => p.id === selectedSku.colorPresetId)?.label ?? "Sunset"}</span>
                )}
                {selectedSku.colorTab === "custom" && (
                  <span>Custom: {selectedSku.customColor}</span>
                )}
                {selectedSku.colorTab === "image" && (
                  <span>Image Background</span>
                )}
                {selectedSku.colorTab === "ai" && (
                  <span>AI Gradient</span>
                )}
              </span>
            )}
          </div>
          <div style={{ color: "var(--color-text-muted)", display: "flex", alignItems: "center" }}>
            {colorExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>

        <div className={`v2-accordion-wrapper ${colorExpanded ? "expanded" : ""}`}>
          <div className="v2-accordion-content" style={{ display: "flex", flexDirection: "column" }}>

        {/* Tab bar */}
        <div style={{
          display: "flex", gap: "2px", marginBottom: "12px",
          background: "rgba(0,0,0,0.05)", borderRadius: "8px", padding: "3px",
        }}>
          {(["presets", "custom", "ai", "image"] as const).map(tab => {
            const isActive = selectedSku ? (selectedSku.colorTab === tab && !(tab === "ai" && !aiRunning)) : false;
            const label = tab === "presets" ? "Presets" : tab === "custom" ? "Custom Colors" : tab === "image" ? "Image" : "Ai Generate";
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

        {selectedSku && selectedSku.colorTab === "image" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <p style={{ margin: "0", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
              Upload a custom background image. Once uploaded, you can drag the image in the preview to adjust its position.
            </p>
            
            <div
              onDrop={e => { e.preventDefault(); setDragOverBg(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) handleBgFile(f); }}
              onDragOver={e => { e.preventDefault(); setDragOverBg(true); }}
              onDragEnter={e => { e.preventDefault(); setDragOverBg(true); }}
              onDragLeave={e => { e.preventDefault(); setDragOverBg(false); }}
              onClick={() => bgFileRef.current?.click()}
              style={{
                border: dragOverBg ? "2px dashed #111111" : "1.5px dashed var(--color-border)",
                boxShadow: dragOverBg ? "0 0 0 3px rgba(17,17,17,0.06)" : "none",
                borderRadius: "var(--radius-md)",
                padding: "16px",
                textAlign: "center",
                cursor: "pointer",
                color: dragOverBg ? "#111111" : "var(--color-text-muted)",
                fontSize: "13px",
                background: dragOverBg ? "rgba(17,17,17,0.03)" : "rgba(0,0,0,0.02)",
                fontFamily: "var(--font-sans)",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {selectedSku.bgImageDataUrl ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", width: "100%" }}>
                    <img src={selectedSku.bgImageDataUrl} alt="bg" style={{ maxHeight: "60px", maxWidth: "100%", objectFit: "contain", borderRadius: "4px" }} />
                    
                    {/* Controls for Box Background */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "10px", width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-text-secondary)" }}>Box Background</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            patchSku({ bgImagePositionBox: { x: 0, y: 0 } });
                          }}
                          style={{
                            border: "1px solid var(--color-border)",
                            background: "#fff",
                            color: "var(--color-text-primary)",
                            padding: "4px 8px",
                            borderRadius: "var(--radius-md)",
                            fontSize: "11px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Reset Pos
                        </button>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "13px" }}>
                        <span style={{ color: "var(--color-text-muted)" }}>Scale</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const scaleVal = selectedSku.bgImageScaleBox ?? 1.0;
                              const next = Math.max(0.5, parseFloat((scaleVal - 0.1).toFixed(2)));
                              patchSku({ bgImageScaleBox: next });
                            }}
                            disabled={(selectedSku.bgImageScaleBox ?? 1.0) <= 0.5}
                            style={{
                              width: "24px", height: "24px", borderRadius: "50%",
                              border: "1px solid var(--color-border)", background: "#fff",
                              color: "var(--color-text-primary)", display: "flex",
                              alignItems: "center", justifyContent: "center", fontSize: "14px",
                              fontWeight: 600, cursor: (selectedSku.bgImageScaleBox ?? 1.0) <= 0.5 ? "not-allowed" : "pointer",
                              opacity: (selectedSku.bgImageScaleBox ?? 1.0) <= 0.5 ? 0.5 : 1, userSelect: "none",
                            }}
                          >
                            −
                          </button>
                          <span style={{
                            fontSize: "12px", fontWeight: 600, color: "var(--color-text-primary)",
                            width: "36px", textAlign: "center", fontFamily: "monospace",
                          }}>
                            {Math.round((selectedSku.bgImageScaleBox ?? 1.0) * 100)}%
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const scaleVal = selectedSku.bgImageScaleBox ?? 1.0;
                              const next = Math.min(3.0, parseFloat((scaleVal + 0.1).toFixed(2)));
                              patchSku({ bgImageScaleBox: next });
                            }}
                            disabled={(selectedSku.bgImageScaleBox ?? 1.0) >= 3.0}
                            style={{
                              width: "24px", height: "24px", borderRadius: "50%",
                              border: "1px solid var(--color-border)", background: "#fff",
                              color: "var(--color-text-primary)", display: "flex",
                              alignItems: "center", justifyContent: "center", fontSize: "14px",
                              fontWeight: 600, cursor: (selectedSku.bgImageScaleBox ?? 1.0) >= 3.0 ? "not-allowed" : "pointer",
                              opacity: (selectedSku.bgImageScaleBox ?? 1.0) >= 3.0 ? 0.5 : 1, userSelect: "none",
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Controls for Bottle Background */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "10px", width: "100%" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--color-text-secondary)" }}>Bottle Background</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            patchSku({ bgImagePositionBottle: { x: 0, y: 0 } });
                          }}
                          style={{
                            border: "1px solid var(--color-border)",
                            background: "#fff",
                            color: "var(--color-text-primary)",
                            padding: "4px 8px",
                            borderRadius: "var(--radius-md)",
                            fontSize: "11px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Reset Pos
                        </button>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "13px" }}>
                        <span style={{ color: "var(--color-text-muted)" }}>Scale</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const scaleVal = selectedSku.bgImageScaleBottle ?? 1.0;
                              const next = Math.max(0.5, parseFloat((scaleVal - 0.1).toFixed(2)));
                              patchSku({ bgImageScaleBottle: next });
                            }}
                            disabled={(selectedSku.bgImageScaleBottle ?? 1.0) <= 0.5}
                            style={{
                              width: "24px", height: "24px", borderRadius: "50%",
                              border: "1px solid var(--color-border)", background: "#fff",
                              color: "var(--color-text-primary)", display: "flex",
                              alignItems: "center", justifyContent: "center", fontSize: "14px",
                              fontWeight: 600, cursor: (selectedSku.bgImageScaleBottle ?? 1.0) <= 0.5 ? "not-allowed" : "pointer",
                              opacity: (selectedSku.bgImageScaleBottle ?? 1.0) <= 0.5 ? 0.5 : 1, userSelect: "none",
                            }}
                          >
                            −
                          </button>
                          <span style={{
                            fontSize: "12px", fontWeight: 600, color: "var(--color-text-primary)",
                            width: "36px", textAlign: "center", fontFamily: "monospace",
                          }}>
                            {Math.round((selectedSku.bgImageScaleBottle ?? 1.0) * 100)}%
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const scaleVal = selectedSku.bgImageScaleBottle ?? 1.0;
                              const next = Math.min(3.0, parseFloat((scaleVal + 0.1).toFixed(2)));
                              patchSku({ bgImageScaleBottle: next });
                            }}
                            disabled={(selectedSku.bgImageScaleBottle ?? 1.0) >= 3.0}
                            style={{
                              width: "24px", height: "24px", borderRadius: "50%",
                              border: "1px solid var(--color-border)", background: "#fff",
                              color: "var(--color-text-primary)", display: "flex",
                              alignItems: "center", justifyContent: "center", fontSize: "14px",
                              fontWeight: 600, cursor: (selectedSku.bgImageScaleBottle ?? 1.0) >= 3.0 ? "not-allowed" : "pointer",
                              opacity: (selectedSku.bgImageScaleBottle ?? 1.0) >= 3.0 ? 0.5 : 1, userSelect: "none",
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Remove Background Image */}
                    <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "10px", display: "flex", justifyContent: "center", width: "100%" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          patchSku({
                            bgImageDataUrl: undefined,
                            bgImagePositionBox: undefined,
                            bgImageScaleBox: undefined,
                            bgImagePositionBottle: undefined,
                            bgImageScaleBottle: undefined,
                          });
                        }}
                        style={{
                          border: "none",
                          background: "rgba(220, 38, 38, 0.08)",
                          color: "#dc2626",
                          padding: "6px 16px",
                          borderRadius: "var(--radius-md)",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                          width: "100%",
                        }}
                      >
                        ✕ Remove Image
                      </button>
                    </div>
                  </div>
              ) : (
                <>📤 Drag & Drop or Click to upload background</>
              )}
            </div>
            <input ref={bgFileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => { const f = e.target.files?.[0]; if (f) handleBgFile(f); }} />
          </div>
        )}

        {selectedSku && (selectedSku.colorTab === "presets" || selectedSku.colorTab === "ai") && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(64px, 1fr))", gap: "12px", width: "100%", padding: "4px 0" }}>
            {COLOR_PRESETS.map(preset => {
              const active = selectedSku.colorPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    patchSku({ colorPresetId: preset.id, colorTab: "presets", customColor: preset.color });
                    setColorTouched(true);
                    setColorExpanded(false); // auto-collapse color
                    setFlavorExpanded(true); // auto-expand flavor
                  }}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                    background: "transparent", border: "none", cursor: "pointer",
                    padding: "4px", width: "100%", outline: "none",
                  }}
                >
                  <div style={{
                    width: "36px", height: "36px",
                    borderRadius: "50%",
                    background: preset.gradient,
                    border: active ? "2.5px solid #111111" : "1px solid var(--color-border)",
                    boxShadow: active ? "0 0 0 3px rgba(17,17,17,0.15)" : "none",
                    flexShrink: 0,
                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  }} />
                  <span style={{
                    fontSize: "10px",
                    fontWeight: active ? 600 : 400,
                    color: active ? "var(--color-text-primary)" : "var(--color-text-muted)",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "100%",
                  }}>
                    {preset.label}
                  </span>
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
              />
              <input
                className="ds-input"
                value={selectedSku.customColor}
                onChange={e => patchSku({ customColor: e.target.value })}
                onBlur={() => {
                  setColorTouched(true);
                  setColorExpanded(false); // auto-collapse color
                  setFlavorExpanded(true); // auto-expand flavor
                }}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                placeholder="#6b21a8"
                style={{ flex: 1, fontFamily: "monospace", fontSize: "13px" }}
              />
            </div>
          </div>
        )}

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(0,0,0,0.06)", margin: "16px 0" }} />

        {/* Graphics & Text Color Selector */}
        {selectedSku && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--color-text-secondary)" }}>
                Graphics &amp; Text Color
              </span>
              <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
                Applied to texts and packaging dividers
              </span>
            </div>

            {/* Selector Segment Tabs */}
            <div style={{
              display: "flex", gap: "2px",
              background: "rgba(0,0,0,0.04)", borderRadius: "8px", padding: "3px",
            }}>
              {(["white", "black", "custom"] as const).map(gTab => {
                const getGraphicsDefaultColor = (sku: SKU) => {
                  if (sku.colorPresetId === "alabaster" || sku.colorPresetId === "gold") {
                    return "black";
                  }
                  return "white";
                };
                const activeTab = selectedSku.graphicsColorTab ?? getGraphicsDefaultColor(selectedSku);
                const isActive = activeTab === gTab;
                const label = gTab === "white" ? "White" : gTab === "black" ? "Black" : "Custom Color";
                return (
                  <button
                    key={gTab}
                    onClick={(e) => {
                      e.stopPropagation();
                      patchSku({ graphicsColorTab: gTab });
                      if (gTab === "custom" && !selectedSku.graphicsCustomColor) {
                        patchSku({ graphicsCustomColor: "#ffffff" });
                      }
                    }}
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
                      transition: "all 0.15s ease",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Custom Graphics Color Inputs */}
            {(selectedSku.graphicsColorTab === "custom") && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px", animation: "fadeIn 0.2s ease-in-out" }}>
                <input
                  type="color"
                  value={selectedSku.graphicsCustomColor ?? "#ffffff"}
                  onChange={e => patchSku({ graphicsCustomColor: e.target.value })}
                />
                <input
                  className="ds-input"
                  value={selectedSku.graphicsCustomColor ?? "#ffffff"}
                  onChange={e => patchSku({ graphicsCustomColor: e.target.value })}
                  placeholder="#ffffff"
                  style={{ flex: 1, fontFamily: "monospace", fontSize: "13px" }}
                />
              </div>
            )}
          </div>
        )}
        </div>
        </div>
      </Card>

      {/* ── Flavor (per-SKU) ── */}
      {selectedSku && (
        <Card>
          <div
            onClick={() => setFlavorExpanded(!flavorExpanded)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              userSelect: "none",
              padding: "4px 0",
              marginBottom: flavorExpanded ? "8px" : 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
              <h3 style={{ margin: 0, fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--color-text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                {isFlavorCompleted && flavorTouched && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                Flavor
              </h3>
              {!flavorExpanded && (
                <span style={{
                  fontSize: "11px",
                  color: "var(--color-text-muted)",
                  background: "rgba(0,0,0,0.04)",
                  padding: "2px 8px",
                  borderRadius: "100px",
                  fontWeight: 500,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "250px",
                }}>
                  <span>{selectedSku.displayName} ({selectedSku.strength})</span>
                </span>
              )}
            </div>
            <div style={{ color: "var(--color-text-muted)", display: "flex", alignItems: "center" }}>
              {flavorExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </div>

          <div className={`v2-accordion-wrapper ${flavorExpanded ? "expanded" : ""}`}>
            <div className="v2-accordion-content" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "grid", gap: "10px" }}>

                <Field label="Unique name">
                  <input
                    className="ds-input"
                    placeholder="JUICY GRAPE"
                    value={selectedSku.displayName}
                    onChange={e => patchSku({ displayName: e.target.value })}
                    onBlur={() => {
                      if (selectedSku.displayName.trim()) {
                        setFlavorTouched(true);
                        setFlavorExpanded(false); // auto-collapse flavor on blur
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
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
                        onClick={() => {
                          patchSku({ strength: s });
                          setFlavorTouched(true);
                          setFlavorExpanded(false); // auto-collapse flavor
                        }}
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
            </div>
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
