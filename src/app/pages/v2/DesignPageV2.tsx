import React, { useState } from "react";
import { useNavigate } from "react-router";
import { TemplateGrid } from "./TemplateGrid";
import { DesignForm } from "./DesignForm";
import { PackagePreview } from "./PackagePreview";
import type { Background } from "./DesignForm";

export interface DesignState {
  templateId:   string;
  brandName:    string;
  flavorName:   string;
  tagline:      string;
  logoDataUrl:  string;
  accentColor:  string;
  background:   Background | null;
}

const DEFAULT_STATE: DesignState = {
  templateId:  "standard-box",
  brandName:   "",
  flavorName:  "",
  tagline:     "",
  logoDataUrl: "",
  accentColor: "#ffffff",
  background:  null,
};

export function DesignPageV2() {
  const navigate = useNavigate();
  const [design, setDesign] = useState<DesignState>(() => {
    try {
      const order = JSON.parse(sessionStorage.getItem("ritchy-v2-order") ?? "{}");
      return { ...DEFAULT_STATE, flavorName: order.flavor ?? "" };
    } catch {
      return DEFAULT_STATE;
    }
  });

  const patch = (p: Partial<DesignState>) => setDesign(prev => ({ ...prev, ...p }));

  const handleContinue = () => {
    sessionStorage.setItem("ritchy-v2-design", JSON.stringify(design));
    navigate("/v2/signup");
  };

  return (
    <div style={{ overflowY: "auto", padding: "var(--space-5)" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        <div style={{ marginBottom: "var(--space-5)" }}>
          <div style={{ fontSize: "11px", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
            Step 2 of 5
          </div>
          <h1 style={{ margin: "6px 0 0", fontSize: "26px", color: "var(--color-text-primary)" }}>Brand &amp; Design</h1>
          <p style={{ margin: "6px 0 0", color: "var(--color-text-secondary)", fontSize: "14px" }}>
            Choose a template, pick your colours, and add your brand details.
          </p>
        </div>

        {/* Template strip */}
        <div style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(0,0,0,0.07)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-4)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.90)",
          marginBottom: "var(--space-4)",
        }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "var(--space-3)" }}>
            Choose Template
          </div>
          <TemplateGrid selected={design.templateId} onSelect={id => patch({ templateId: id })} />
        </div>

        {/* Preview (mobile: above form, hidden on desktop) */}
        <div className="v2-preview-mobile">
          <PackagePreview design={design} />
        </div>

        {/* Form + desktop preview side-by-side */}
        <div className="v2-design-layout">
          <DesignForm design={design} onChange={patch} />

          {/* Preview (desktop: sticky right column, hidden on mobile) */}
          <div className="v2-preview-desktop">
            <PackagePreview design={design} />
          </div>
        </div>

        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "var(--space-6)", paddingBottom: "var(--space-8)" }}>
          <button onClick={() => navigate("/v2/order")} className="ds-btn ds-btn-secondary">← Back</button>
          <button onClick={handleContinue} className="ds-btn ds-btn-primary">Continue →</button>
        </div>
      </div>
    </div>
  );
}
