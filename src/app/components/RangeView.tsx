import React from "react";
import type { Flavor } from "./packageTypes";
import { BoxFace } from "./BoxFace";

/* ─────────────────────────────────────────────────────────────
   RangeView — all flavors displayed side-by-side as front views,
   standing in a row. Clicking selects the active flavor.
───────────────────────────────────────────────────────────────*/

/* Each box is shown at a fixed height; width by 35:75 ratio */
const BOX_H = 220;
const BOX_W = Math.round(BOX_H * (35 / 75)); // ~102px

interface RangeViewProps {
  flavors:       Flavor[];
  activeFlavor:  number;
  onSelect:      (i: number) => void;
}

export function RangeView({ flavors, activeFlavor, onSelect }: RangeViewProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        gap: "var(--space-4)",
        padding: "var(--space-8)",
        flexWrap: "wrap",
        overflowY: "auto",
      }}
    >
      {flavors.map((f, i) => {
        const isActive = i === activeFlavor;
        return (
          <div
            key={f.id}
            onClick={() => onSelect(i)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--space-2)",
              cursor: "pointer",
              transition: "transform .18s ease, opacity .18s",
              transform: isActive ? "translateY(-8px) scale(1.04)" : "scale(0.94)",
              opacity: isActive ? 1 : 0.72,
            }}
          >
            {/* Box */}
            <div
              style={{
                position: "relative",
                width: BOX_W,
                height: BOX_H,
                borderRadius: "2px",
                overflow: "hidden",
                boxShadow: isActive
                  ? "0 12px 32px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)"
                  : "0 4px 12px rgba(0,0,0,0.12)",
                outline: isActive ? "2px solid var(--color-text-primary)" : "none",
                outlineOffset: "3px",
              }}
            >
              <BoxFace
                kind="front"
                flavor={f}
                width={BOX_W}
                height={BOX_H}
                showGuides
                style={{ top: 0, left: 0 }}
              />
            </div>

            {/* Label */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "11px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                  letterSpacing: "0.02em",
                  transition: "color .15s",
                }}
              >
                {f.name || f.letter}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "10px",
                  color: "var(--color-text-muted)",
                  marginTop: "1px",
                }}
              >
                {f.strength} mg · {f.type === "salt" ? "Salt" : "Free"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
