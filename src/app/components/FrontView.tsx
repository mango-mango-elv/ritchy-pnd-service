import React from "react";
import type { Flavor } from "./packageTypes";
import { BoxFace } from "./BoxFace";

/* ─────────────────────────────────────────────────────────────
   FrontView — flat 2D front face, exact 35:75 aspect ratio,
   centered in available space with pixel-perfect crisp edges.
───────────────────────────────────────────────────────────────*/

interface FrontViewProps {
  flavor: Flavor;
  /** Available container height (px) */
  maxH?: number;
}

/* 35:75 → width = height × (35/75) */
const ASPECT = 35 / 75;

export function FrontView({ flavor, maxH = 440 }: FrontViewProps) {
  const h = maxH;
  const w = Math.round(h * ASPECT);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          position: "relative",
          width: `${w}px`,
          height: `${h}px`,
          borderRadius: "3px",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)",
        }}
      >
        <BoxFace
          kind="front"
          flavor={flavor}
          width={w}
          height={h}
          showGuides
          style={{ top: 0, left: 0 }}
        />
        {/* Dimension callout */}
        <div
          style={{
            position: "absolute",
            bottom: "6px",
            right: "6px",
            background: "rgba(0,0,0,0.28)",
            backdropFilter: "blur(4px)",
            color: "#fff",
            fontSize: "9px",
            fontFamily: "var(--font-sans)",
            letterSpacing: "0.05em",
            padding: "2px 6px",
            borderRadius: "2px",
          }}
        >
          35 × 75 mm
        </div>
      </div>
    </div>
  );
}
