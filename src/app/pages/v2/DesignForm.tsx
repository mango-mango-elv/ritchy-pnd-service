import React, { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { COLOR_PRESETS, type DesignState, type SKU } from "./design-types";

const FLAVOR_OPTIONS = [
  "Passion Fruit", "Mango", "Watermelon", "Blueberry", "Strawberry",
  "Peach", "Grape", "Raspberry", "Lemon", "Classic Tobacco",
  "Virginia Tobacco", "Menthol", "Spearmint", "Peppermint",
  "Vanilla Custard", "Cheesecake", "Caramel", "Coffee", "Cola",
];

const WARNING_PRESETS = [
  { lang: "English", code: "EN", text: "This product contains nicotine which is a highly addictive substance." },
  { lang: "Spanish", code: "ES", text: "Este producto contiene nicotina, una sustancia muy adictiva." },
  { lang: "Czech", code: "CS", text: "Tento výrobek obsahuje nikotin, který je vysoce návykovou látkou." },
  { lang: "Slovak", code: "SK", text: "Tento výrobok obsahuje nikotín, ktorý je vysoko návykovou látkou." },
  { lang: "Italian", code: "IT", text: "Questo prodotto contiene nicotina, una sostanza che crea un'elevata dipendenza." },
  { lang: "Romanian", code: "RO", text: "Acest produs conține nicotină, o substanță cu grad ridicat de dependență." },
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
  const [colorTouched, setColorTouched] = useState(false);
  const [flavorTouched, setFlavorTouched] = useState(false);

  const isBrandCompleted = !!(design.brandName.trim() || design.logoDataUrl);
  const isColorCompleted = selectedSku
    ? (selectedSku.colorTab !== "image" || !!selectedSku.bgImageDataUrl)
    : false;
  const isFlavorCompleted = selectedSku ? selectedSku.displayName.trim() !== "" : false;
  const isWarningCompleted = !!design.healthWarningText?.trim();

  const handleLogoFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      patch({ logoDataUrl: e.target?.result as string });
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
        setColorTouched(true);
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
    }, 1500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* ── Brand Identity ── */}
      <Card first>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700, letterSpacing: "-0.01em", textTransform: "uppercase", color: "var(--color-text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
            {isBrandCompleted && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            1 · Brand Identity
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {!design.logoDataUrl && (
            <input
              className="ds-input"
              placeholder="Brand Name"
              value={design.brandName}
              onChange={e => patch({ brandName: e.target.value })}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  (e.target as HTMLInputElement).blur();
                }
              }}
              style={{
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                height: "40px",
                background: "rgba(0,0,0,0.02)",
                border: "1px solid rgba(0,0,0,0.03)",
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "13px",
              }}
            />
          )}
          
          {!design.logoDataUrl && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                onDrop={e => { e.preventDefault(); setDragOverLogo(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) handleLogoFile(f); }}
                onDragOver={e => { e.preventDefault(); setDragOverLogo(true); }}
                onDragEnter={e => { e.preventDefault(); setDragOverLogo(true); }}
                onDragLeave={e => { e.preventDefault(); setDragOverLogo(false); }}
                onClick={() => fileRef.current?.click()}
                style={{
                  borderRadius: "8px",
                  padding: "16px",
                  textAlign: "center",
                  cursor: "pointer",
                  color: "var(--color-text-secondary)",
                  fontSize: "12px",
                  fontWeight: 500,
                  background: dragOverLogo ? "rgba(0,0,0,0.04)" : "rgba(0,0,0,0.02)",
                  fontFamily: "var(--font-sans)",
                  transition: "all 0.15s ease",
                }}
              >
                Upload Vector Logo (.SVG / .PNG)
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoFile(f); }} />
            </div>
          )}

          {design.logoDataUrl && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{
                borderRadius: "8px",
                padding: "12px",
                background: "rgba(0,0,0,0.02)",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <img src={design.logoDataUrl} alt="logo" style={{ maxHeight: "30px", maxWidth: "60%", objectFit: "contain" }} />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      patch({ logoDataUrl: "", logoScale: 1.0 });
                    }}
                    style={{
                      border: "none",
                      background: "rgba(220, 38, 38, 0.08)",
                      color: "#dc2626",
                      padding: "5px 12px",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    ✕ Remove Logo
                  </button>
                </div>

                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "12px",
                  borderTop: "1px solid rgba(0,0,0,0.04)",
                }}>
                  <span style={{ fontSize: "12px", color: "var(--color-text-secondary)", fontWeight: 500 }}>
                    Logo Size
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      onClick={() => adjustScale(-0.1)}
                      disabled={scale <= 0.5}
                      style={{
                        width: "24px", height: "24px", borderRadius: "50%",
                        border: "1px solid rgba(0,0,0,0.08)", background: "#fff",
                        color: "#111111", display: "flex",
                        alignItems: "center", justifyContent: "center", fontSize: "14px",
                        fontWeight: 600, cursor: scale <= 0.5 ? "not-allowed" : "pointer",
                        opacity: scale <= 0.5 ? 0.5 : 1, userSelect: "none"
                      }}
                    >
                      −
                    </button>
                    <span style={{
                      fontSize: "12px", fontWeight: 600, color: "#111111",
                      width: "36px", textAlign: "center", fontFamily: "monospace",
                    }}>
                      {Math.round(scale * 100)}%
                    </span>
                    <button
                      onClick={() => adjustScale(0.1)}
                      disabled={scale >= 2.0}
                      style={{
                        width: "24px", height: "24px", borderRadius: "50%",
                        border: "1px solid rgba(0,0,0,0.08)", background: "#fff",
                        color: "#111111", display: "flex",
                        alignItems: "center", justifyContent: "center", fontSize: "14px",
                        fontWeight: 600, cursor: scale >= 2.0 ? "not-allowed" : "pointer",
                        opacity: scale >= 2.0 ? 0.5 : 1, userSelect: "none"
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* ── Packaging Color ── */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700, letterSpacing: "-0.01em", textTransform: "uppercase", color: "var(--color-text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
            {isColorCompleted && colorTouched && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            2 · Packaging Color
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* macOS Style Segmented Tab bar */}
          <div style={{
            display: "flex", gap: "2px",
            background: "rgba(0,0,0,0.03)", borderRadius: "8px", padding: "3px",
          }}>
            {(["presets", "custom", "ai", "image"] as const).map(tab => {
              const isActive = selectedSku ? (selectedSku.colorTab === tab && !(tab === "ai" && !aiRunning)) : false;
              const label = tab === "presets" ? "Presets" : tab === "custom" ? "Custom" : tab === "image" ? "Image" : "AI Gen";
              return (
                <button
                  key={tab}
                  onClick={() => tab === "ai" ? handleAIGenerate() : patchSku({ colorTab: tab })}
                  style={{
                    flex: 1, padding: "5px 4px",
                    border: "none",
                    borderRadius: "6px",
                    background: isActive ? "#ffffff" : "transparent",
                    boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                    color: isActive ? "#111111" : "var(--color-text-secondary)",
                    fontSize: "11px",
                    fontWeight: isActive ? 600 : 500,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {tab === "ai" && aiRunning ? <Loader2 size={10} className="animate-spin" style={{ display: "inline-block" }} /> : label}
                </button>
              );
            })}
          </div>

          {selectedSku && selectedSku.colorTab === "image" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div
                onDrop={e => { e.preventDefault(); setDragOverBg(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) handleBgFile(f); }}
                onDragOver={e => { e.preventDefault(); setDragOverBg(true); }}
                onDragEnter={e => { e.preventDefault(); setDragOverBg(true); }}
                onDragLeave={e => { e.preventDefault(); setDragOverBg(false); }}
                onClick={() => bgFileRef.current?.click()}
                style={{
                  borderRadius: "8px",
                  padding: "16px",
                  textAlign: "center",
                  cursor: "pointer",
                  color: "var(--color-text-secondary)",
                  fontSize: "12px",
                  fontWeight: 500,
                  background: dragOverBg ? "rgba(0,0,0,0.04)" : "rgba(0,0,0,0.02)",
                  fontFamily: "var(--font-sans)",
                  transition: "all 0.15s ease",
                }}
              >
                {selectedSku.bgImageDataUrl ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", width: "100%" }}>
                    <img src={selectedSku.bgImageDataUrl} alt="bg" style={{ maxHeight: "50px", maxWidth: "100%", objectFit: "contain", borderRadius: "4px" }} />
                    <div style={{ display: "flex", gap: "10px", width: "100%" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          patchSku({ bgImagePositionBox: { x: 0, y: 0 }, bgImagePositionBottle: { x: 0, y: 0 } });
                        }}
                        style={{
                          flex: 1, border: "1px solid rgba(0,0,0,0.08)", background: "#fff", color: "#111111",
                          padding: "5px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, cursor: "pointer",
                        }}
                      >
                        Reset Pos
                      </button>
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
                          flex: 1, border: "none", background: "rgba(220, 38, 38, 0.08)", color: "#dc2626",
                          padding: "5px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, cursor: "pointer",
                        }}
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <>Upload background image (.JPG / .PNG)</>
                )}
              </div>
              <input ref={bgFileRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleBgFile(f); }} />
            </div>
          )}

          {/* Clean Color Preset single row */}
          {selectedSku && (selectedSku.colorTab === "presets" || selectedSku.colorTab === "ai") && (
            <div style={{ display: "flex", gap: "8px", justifyContent: "space-between", width: "100%", padding: "4px 0" }}>
              {COLOR_PRESETS.map(preset => {
                const active = selectedSku.colorPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      patchSku({ colorPresetId: preset.id, colorTab: "presets", customColor: preset.color });
                      setColorTouched(true);
                    }}
                    title={preset.label}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: preset.gradient,
                      border: active ? "2.5px solid #111111" : "1px solid rgba(0,0,0,0.08)",
                      boxShadow: active ? "0 0 0 3px rgba(17,17,17,0.12)" : "none",
                      cursor: "pointer",
                      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                      flexShrink: 0
                    }}
                  />
                );
              })}
            </div>
          )}

          {selectedSku && selectedSku.colorTab === "custom" && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="color"
                value={selectedSku.customColor}
                onChange={e => patchSku({ customColor: e.target.value })}
                style={{ width: "30px", height: "30px", border: "none", padding: 0, background: "transparent", cursor: "pointer" }}
              />
              <input
                className="ds-input"
                value={selectedSku.customColor}
                onChange={e => patchSku({ customColor: e.target.value })}
                onBlur={() => setColorTouched(true)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    (e.target as HTMLInputElement).blur();
                  }
                }}
                placeholder="#6b21a8"
                style={{ flex: 1, fontFamily: "monospace", fontSize: "12px", height: "32px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "6px", padding: "0 8px" }}
              />
            </div>
          )}

          {/* Graphics & Text Color Selector - macOS Style Segmented */}
          {selectedSku && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "4px" }}>
              <div style={{
                display: "flex", gap: "2px",
                background: "rgba(0,0,0,0.03)", borderRadius: "8px", padding: "3px",
              }}>
                {(["white", "black", "custom"] as const).map(gTab => {
                  const getGraphicsDefaultColor = (sku: SKU) => {
                    if (sku.colorPresetId === "alabaster" || sku.colorPresetId === "gold") return "black";
                    return "white";
                  };
                  const activeTab = selectedSku.graphicsColorTab ?? getGraphicsDefaultColor(selectedSku);
                  const isActive = activeTab === gTab;
                  const label = gTab === "white" ? "White Text" : gTab === "black" ? "Black Text" : "Custom Color";
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
                        flex: 1, padding: "5px 4px",
                        border: "none",
                        borderRadius: "6px",
                        background: isActive ? "#ffffff" : "transparent",
                        boxShadow: isActive ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                        color: isActive ? "#111111" : "var(--color-text-secondary)",
                        fontSize: "11px",
                        fontWeight: isActive ? 600 : 500,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {selectedSku.graphicsColorTab === "custom" && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="color"
                    value={selectedSku.graphicsCustomColor ?? "#ffffff"}
                    onChange={e => patchSku({ graphicsCustomColor: e.target.value })}
                    style={{ width: "24px", height: "24px", border: "none", padding: 0, background: "transparent", cursor: "pointer" }}
                  />
                  <input
                    className="ds-input"
                    value={selectedSku.graphicsCustomColor ?? "#ffffff"}
                    onChange={e => patchSku({ graphicsCustomColor: e.target.value })}
                    placeholder="#ffffff"
                    style={{ flex: 1, fontFamily: "monospace", fontSize: "12px", height: "28px", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "6px", padding: "0 8px" }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* ── Flavor Labeling ── */}
      {selectedSku && (
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700, letterSpacing: "-0.01em", textTransform: "uppercase", color: "var(--color-text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
              {isFlavorCompleted && flavorTouched && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              3 · Flavor Labeling
            </h3>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
              className="ds-input"
              placeholder="Flavor Name"
              value={selectedSku.displayName}
              onChange={e => patchSku({ displayName: e.target.value })}
              onBlur={() => setFlavorTouched(true)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  (e.target as HTMLInputElement).blur();
                }
              }}
              style={{
                fontWeight: 600,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                height: "40px",
                background: "rgba(0,0,0,0.02)",
                border: "1px solid rgba(0,0,0,0.03)",
                borderRadius: "8px",
                padding: "10px 14px",
                fontSize: "13px",
              }}
            />

            <div style={{
              display: "flex",
              background: "rgba(0,0,0,0.02)",
              borderRadius: "8px",
              padding: "10px 14px",
              fontSize: "11px",
              color: "var(--color-text-secondary)",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div>
                <span style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>Formulation: </span>
                {selectedSku.type === "salt" ? "Nicotine Salt" : "Free Base"} • {selectedSku.strength}
              </div>
              <div style={{ fontSize: "9px", color: "var(--color-text-muted)", letterSpacing: "0.05em", fontWeight: 700, textTransform: "uppercase" }}>
                LOCKED IN STEP 1
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* ── Section 4: Health Warning ── */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700, letterSpacing: "-0.01em", textTransform: "uppercase", color: "var(--color-text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
            {isWarningCompleted && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            4 · Health Warning
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--color-text-secondary)", fontWeight: 500 }}>
              Language Presets
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {WARNING_PRESETS.map(preset => {
                const isSelected = design.healthWarningText === preset.text;
                return (
                  <button
                    key={preset.code}
                    onClick={() => patch({ healthWarningText: preset.text })}
                    style={{
                      padding: "6px 12px",
                      border: isSelected ? "1px solid #111111" : "1px solid rgba(0,0,0,0.06)",
                      borderRadius: "6px",
                      background: isSelected ? "#111111" : "rgba(0,0,0,0.02)",
                      color: isSelected ? "#ffffff" : "var(--color-text-secondary)",
                      fontSize: "12px",
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span style={{ fontSize: "10px", opacity: 0.8 }}>{preset.code}</span>
                    <span>{preset.lang}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "12px", color: "var(--color-text-secondary)", fontWeight: 500 }}>
              Custom Warning Text (Global)
            </span>
            <textarea
              className="ds-input"
              rows={3}
              placeholder="Warning text..."
              value={design.healthWarningText || ""}
              onChange={e => patch({ healthWarningText: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 14px",
                fontSize: "13px",
                fontWeight: 500,
                fontFamily: "var(--font-sans)",
                lineHeight: "1.4",
                background: "rgba(0,0,0,0.02)",
                border: "1px solid rgba(0,0,0,0.03)",
                borderRadius: "8px",
                resize: "none",
              }}
            />
          </div>
        </div>
      </Card>

    </div>
  );
}

function Card({ children }: { children: React.ReactNode; first?: boolean }) {
  return (
    <section style={{
      padding: "12px 0",
      display: "flex",
      flexDirection: "column",
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
