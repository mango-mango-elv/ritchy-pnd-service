import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ShieldCheck } from "lucide-react";
import { PackagePreview } from "./PackagePreview";
import { COLOR_PRESETS } from "./design-types";

const WARNING_DEFAULTS: Record<string, string> = {
  eu: "This product contains nicotine which is a highly addictive substance. Not for sale to persons under the age of 18.",
  uk: "NICOTINE — This product contains nicotine which is a highly addictive substance.",
  us: "WARNING: This product contains nicotine. Nicotine is an addictive chemical.",
};

const REG_BADGES = ["TPD Article 20", "REACH", "CLP", "PCN", "Child-proof"];

function readSession<T>(key: string, fallback: T): T {
  try { return JSON.parse(sessionStorage.getItem(key) ?? "null") ?? fallback; }
  catch { return fallback; }
}

export function CompliancePage() {
  const navigate = useNavigate();
  const [market, setMarket]   = useState("eu");
  const [warning, setWarning] = useState(WARNING_DEFAULTS.eu);
  const [confirmed, setConfirmed] = useState(false);

  // Retrieve previous designs and order details dynamically to render package preview
  const design = readSession<any>("ritchy-v2-design", {
    templateId: "t1-flavor",
    brandName: "",
    logoDataUrl: "",
    logoScale: 1.0,
    healthWarningText: "This product contains nicotine which is a highly addictive substance.",
    skus: [],
    selectedSkuId: "",
  });

  const order = readSession<any>("ritchy-v2-order", {});

  let skus = design.skus || [];
  if (skus.length === 0) {
    const flavor = String(order.flavor ?? "Passion Fruit");
    skus = [{
      id: "sku-1",
      displayName: flavor,
      type: order.nicType === "freebase" ? "freebase" : "salt",
      flavor,
      strength: "20mg",
      colorTab: "presets",
      colorPresetId: "sunset",
      customColor: "#ea580c"
    }];
  }
  const selectedSkuId = design.selectedSkuId || skus[0]?.id;
  const selectedSku = skus.find((s: any) => s.id === selectedSkuId) || skus[0];

  const selectedPreset = selectedSku
    ? (COLOR_PRESETS.find(p => p.id === selectedSku.colorPresetId) ?? COLOR_PRESETS[0])
    : COLOR_PRESETS[0];

  const activeGradient = selectedSku
    ? (selectedSku.colorTab === "custom"
      ? `linear-gradient(135deg, ${selectedSku.customColor} 0%, ${selectedSku.customColor} 100%)`
      : selectedPreset.gradient)
    : COLOR_PRESETS[0].gradient;

  const getGraphicsDefaultColor = (sku: any) => {
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

  const handleMarketChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const m = e.target.value;
    setMarket(m);
    setWarning(WARNING_DEFAULTS[m] ?? WARNING_DEFAULTS.eu);
  };

  const handleContinue = () => {
    if (!confirmed) return;
    sessionStorage.setItem("ritchy-v2-compliance", JSON.stringify({ market, warning }));
    navigate("/confirm");
  };

  return (
    <div className="v2-design-page">
      {/* ── Center: form ── */}
      <main className="v2-design-center" style={{ display: "flex", flexDirection: "column" }}>
        <div className="v2-design-center-scroll" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px", paddingBottom: "24px" }}>
          
          {/* Header Steps */}
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-muted)", fontWeight: 600 }}>
              Step 4 of 5
            </div>
            <h1 style={{ margin: "6px 0 0", fontSize: "26px", fontWeight: 700, color: "var(--color-text-primary)" }}>Compliance Preview</h1>
            <p style={{ margin: "6px 0 0", color: "var(--color-text-secondary)", fontSize: "14px", lineHeight: "1.5" }}>
              We handle regulatory notifications. Review your target market and label warning text.
            </p>
          </div>

          {/* Upgraded Regulation badges to Premium Monochrome Alert Panel */}
          <section style={{
            background: "var(--color-surface)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid var(--color-border)",
            borderRadius: "16px",
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            boxShadow: "var(--shadow-sm), inset 0 1px 0 rgba(255,255,255,0.90)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldCheck size={18} style={{ color: "#166534" }} />
              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text-primary)" }}>
                Article 20 compliant, every EU market
              </span>
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", margin: "2px 0" }}>
              {REG_BADGES.map(b => (
                <span key={b} style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "4px 10px",
                  background: "rgba(0,0,0,0.04)",
                  color: "var(--color-text-primary)",
                  borderRadius: "999px",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}>
                  {b}
                </span>
              ))}
            </div>
            <p style={{ margin: 0, fontSize: "12px", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              All products are manufactured to TPD Article 20 standards. We handle regulatory notifications for the markets you select.
            </p>
          </section>

          {/* Main Card with Premium Design System Glassmorphism */}
          <section style={{
            background: "var(--color-surface)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid var(--color-border)",
            borderRadius: "16px",
            padding: "28px 24px",
            boxShadow: "var(--shadow-box), inset 0 1px 0 rgba(255,255,255,0.90)",
            display: "flex",
            flexDirection: "column",
            gap: "18px"
          }}>
            
            {/* Target Market Dropdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 500, color: "var(--color-text-secondary)" }}>
                Target Market
              </label>
              <select
                className="v2-signup-input-field"
                value={market}
                onChange={handleMarketChange}
                style={{ appearance: "auto" }}
              >
                <option value="eu">European Union</option>
                <option value="uk">United Kingdom</option>
                <option value="us">United States</option>
              </select>
            </div>

            {/* Health Warning Text */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 500, color: "var(--color-text-secondary)" }}>
                Health Warning Text
              </label>
              <textarea
                className="v2-signup-input-field"
                value={warning}
                onChange={e => setWarning(e.target.value)}
                rows={4}
                style={{ resize: "vertical" }}
              />
              <p style={{ margin: "6px 0 0", fontSize: "11px", color: "var(--color-text-muted)", lineHeight: "1.4" }}>
                This warning will be printed on every package, alongside nicotine strength and child-safety pictograms.
              </p>
            </div>

            {/* Confirm Checkbox Row */}
            <label style={{
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
              cursor: "pointer",
              userSelect: "none",
              padding: "8px 0 0",
              margin: 0
            }}>
              <input
                type="checkbox"
                checked={confirmed}
                onChange={e => setConfirmed(e.target.checked)}
                style={{
                  marginTop: "3px",
                  flexShrink: 0,
                  width: "16px",
                  height: "16px",
                  accentColor: "#111111",
                  cursor: "pointer"
                }}
              />
              <span style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                I confirm that the label and warning text have been reviewed and authorize Ritchy P&amp;D to submit regulatory notifications on my behalf.
              </span>
            </label>
          </section>

          {/* Footer buttons row */}
          <div className="v2-nav-footer" style={{ marginTop: "4px" }}>
            <button onClick={() => navigate("/signup")} className="v2-footer-btn v2-footer-btn-secondary fc-nav-btn">
              ← Back
            </button>
            <button
              onClick={handleContinue}
              className="v2-footer-btn v2-footer-btn-primary fc-nav-btn"
              disabled={!confirmed}
              style={{
                opacity: confirmed ? 1 : 0.4,
                cursor: confirmed ? "pointer" : "default"
              }}
            >
              Continue to Review →
            </button>
          </div>
        </div>
      </main>

      {/* ── Right: Package Preview Sidebar (Warnings are dynamic in real-time!) ── */}
      <aside className="v2-design-right">
        <div className="v2-design-right-card" style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
          
          {/* Card Header */}
          <div style={{ flexShrink: 0, paddingBottom: "12px" }}>
            <div style={{ fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--color-text-primary)" }}>
              Regulatory Mockup
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "2px" }}>
              Warning text updating dynamically on package
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(0,0,0,0.06)", margin: "0 0 16px 0", flexShrink: 0 }} />

          {/* Physical Packaging Preview with Dynamic Warning Text */}
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
              boxSizing: "border-box"
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
                bgImageDataUrl={selectedSku?.bgImageDataUrl}
                bgImagePositionBox={selectedSku?.bgImagePositionBox}
                bgImageScaleBox={selectedSku?.bgImageScaleBox ?? 1.0}
                bgImagePositionBottle={selectedSku?.bgImagePositionBottle}
                bgImageScaleBottle={selectedSku?.bgImageScaleBottle ?? 1.0}
                colorTab={selectedSku?.colorTab}
                graphicsColor={activeGraphicsColor}
                healthWarningText={warning} // Dynamic warning text is updated in real time as user types!
              />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
