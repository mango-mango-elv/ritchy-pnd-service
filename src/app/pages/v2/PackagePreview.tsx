import React from "react";
import { TEMPLATES } from "./TemplateGrid";
import type { DesignState } from "./DesignPageV2";

function isLight(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length < 6) return false;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

interface Props {
  design: DesignState;
}

export function PackagePreview({ design }: Props) {
  const template  = TEMPLATES.find(t => t.id === design.templateId) ?? TEMPLATES[0];
  const bgStyle   = design.background?.style ?? "linear-gradient(135deg, #1a2a1a 0%, #2d4a2d 100%)";
  const accent    = design.accentColor ?? "#ffffff";
  const textColor = isLight(accent) ? "#111111" : "#ffffff";

  const previewW = 220;
  const rawH     = Math.round(previewW / template.aspectRatio);
  const previewH = Math.min(Math.max(rawH, 140), 400);
  const actualW  = Math.round(previewH * template.aspectRatio);

  const isNarrow = template.aspectRatio < 0.45;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-2)" }}>
      <div style={{
        width: `${actualW}px`, height: `${previewH}px`,
        background: bgStyle,
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)",
        display: "flex", flexDirection: "column",
        padding: isNarrow ? "10px 8px" : "16px",
        position: "relative",
        flexShrink: 0,
        transition: "width .2s, height .2s",
      }}>
        {/* Logo */}
        {design.logoDataUrl && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
            <img
              src={design.logoDataUrl}
              alt="logo"
              style={{ maxWidth: isNarrow ? "44px" : "64px", maxHeight: "36px", objectFit: "contain" }}
            />
          </div>
        )}

        {/* Brand name */}
        <div style={{
          fontSize: isNarrow ? "13px" : "18px",
          fontWeight: 700,
          color: accent,
          fontFamily: "var(--font-sans)",
          lineHeight: 1.1,
          wordBreak: "break-word",
        }}>
          {design.brandName || "Your Brand"}
        </div>

        {/* Divider */}
        <div style={{
          width: "32px", height: "2px",
          background: accent,
          opacity: 0.5,
          margin: "8px 0",
          flexShrink: 0,
        }} />

        {/* Flavor */}
        <div style={{
          fontSize: isNarrow ? "9px" : "12px",
          fontWeight: 600,
          color: textColor,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontFamily: "var(--font-sans)",
        }}>
          {design.flavorName || "Flavor"}
        </div>

        {/* Tagline */}
        {design.tagline && (
          <div style={{
            fontSize: isNarrow ? "8px" : "10px",
            color: textColor,
            opacity: 0.7,
            fontFamily: "var(--font-sans)",
            marginTop: "4px",
          }}>
            {design.tagline}
          </div>
        )}

        {/* Nicotine warning */}
        <div style={{
          position: "absolute", bottom: "6px", left: "6px", right: "6px",
          background: "rgba(255,255,255,0.92)",
          borderRadius: "3px",
          padding: "3px 5px",
          fontSize: "7px",
          color: "#111111",
          fontFamily: "var(--font-sans)",
          lineHeight: 1.3,
          textAlign: "center",
        }}>
          This product contains nicotine. Nicotine is an addictive chemical.
        </div>
      </div>

      <div style={{ fontSize: "11px", color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}>
        {template.label} · live preview
      </div>
    </div>
  );
}
