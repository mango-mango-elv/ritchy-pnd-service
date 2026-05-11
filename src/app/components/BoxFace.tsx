import React, { CSSProperties } from "react";
import { COLOR_MAP, TITLE_FONTS } from "./packageTypes";
import type { Flavor, PackageColor } from "./packageTypes";

const imgBarcode =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 120'><rect width='300' height='120' fill='white'/><g fill='black'><rect x='8' y='10' width='4' height='82'/><rect x='16' y='10' width='2' height='82'/><rect x='22' y='10' width='7' height='82'/><rect x='33' y='10' width='3' height='82'/><rect x='39' y='10' width='2' height='82'/><rect x='45' y='10' width='6' height='82'/><rect x='56' y='10' width='2' height='82'/><rect x='62' y='10' width='5' height='82'/><rect x='72' y='10' width='3' height='82'/><rect x='79' y='10' width='8' height='82'/><rect x='91' y='10' width='2' height='82'/><rect x='98' y='10' width='6' height='82'/><rect x='108' y='10' width='3' height='82'/><rect x='114' y='10' width='2' height='82'/><rect x='121' y='10' width='7' height='82'/><rect x='132' y='10' width='3' height='82'/><rect x='138' y='10' width='2' height='82'/><rect x='145' y='10' width='9' height='82'/><rect x='158' y='10' width='2' height='82'/><rect x='164' y='10' width='6' height='82'/><rect x='174' y='10' width='3' height='82'/><rect x='180' y='10' width='2' height='82'/><rect x='186' y='10' width='8' height='82'/><rect x='198' y='10' width='3' height='82'/><rect x='205' y='10' width='5' height='82'/><rect x='214' y='10' width='2' height='82'/><rect x='220' y='10' width='7' height='82'/><rect x='230' y='10' width='3' height='82'/><rect x='236' y='10' width='2' height='82'/><rect x='242' y='10' width='10' height='82'/><rect x='255' y='10' width='3' height='82'/><rect x='261' y='10' width='5' height='82'/><rect x='270' y='10' width='2' height='82'/><rect x='276' y='10' width='7' height='82'/></g><text x='150' y='108' font-family='Arial, sans-serif' font-size='14' text-anchor='middle' fill='black'>5901234123457</text></svg>",
  );

/* ─────────────────────────────────────────────────────────────
   BoxFace — renders a single face of the packaging box.
   Used by FrontView, View3D, RangeView (and indirectly Layout).

   Props:
     kind       — which face to render
     flavor     — all flavor/design data
     width/height — face dimensions in px (caller decides scale)
     showGuides — show logo/content placement guides
     style      — CSS overrides (for 3D transforms etc.)
─────────────────────────────────────────────────────────────*/

export type FaceKind =
  | "front" | "back"
  | "side-left" | "side-right"
  | "top" | "bottom";

interface BoxFaceProps {
  kind:        FaceKind;
  flavor:      Flavor;
  width:       number;
  height:      number;
  showGuides?: boolean;
  style?:      CSSProperties;
}

/* Reference front-face native size (dieline origin) */
const FRONT_W = 166;
const FRONT_H = 387;

/* ── Art layer transform (center-pivot pan + zoom) ── */
function artTransformCSS(w: number, h: number, f: Flavor): string {
  // Layout view stores pan offsets in dieline-native space (589x620).
  // Scale offsets to the current face so Front/3D stay in sync with Layout.
  const scaledOffsetX = f.artOffsetX * (w / 589);
  const scaledOffsetY = f.artOffsetY * (h / 620);
  return `translate(${w / 2 + scaledOffsetX}px, ${h / 2 + scaledOffsetY}px) scale(${f.artScale}) translate(${-w / 2}px, ${-h / 2}px)`;
}

/* ── 18+ warning icon — pure SVG primitives, no <text> ── */
function Icon18Plus({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" fill="none">
      <circle cx="25" cy="25" r="23" stroke="#fff" strokeWidth="3" />
      <line x1="10" y1="10" x2="40" y2="40" stroke="#fff" strokeWidth="3" />
      {/* "1" */}
      <line x1="12" y1="19" x2="12" y2="32" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="9.5" y1="21.5" x2="12" y2="19" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" />
      {/* "8" — two stacked rounded rects */}
      <rect x="17.5" y="19"   width="12" height="6.5" rx="3" stroke="#fff" strokeWidth="2" />
      <rect x="17.5" y="25.5" width="12" height="6.5" rx="3" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

/* ── Skull / hazard icon — pure SVG primitives ── */
function SkullHazard({ size, color = "#fff" }: { size: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 66 66" fill="none">
      <path d="M33 3 L63 33 L33 63 L3 33 Z" stroke={color} strokeWidth="2.5" fill="rgba(0,0,0,0.45)" />
      <ellipse cx="33" cy="27" rx="9" ry="10" fill={color} />
      <rect x="27" y="33" width="4" height="5" rx="1" fill="rgba(0,0,0,0.45)" />
      <rect x="33" y="33" width="4" height="5" rx="1" fill="rgba(0,0,0,0.45)" />
      <circle cx="30" cy="25" r="2.2" fill="rgba(0,0,0,0.45)" />
      <circle cx="36" cy="25" r="2.2" fill="rgba(0,0,0,0.45)" />
      <line x1="23" y1="43" x2="44" y2="51" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="44" y1="43" x2="23" y2="51" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── Health warning text block (replaces old image) ── */
function HealthWarningText({ text, w, borderPx }: { text: string; w: number; borderPx: number }) {
  const pad      = Math.max(borderPx + 2, Math.round(w * 0.04));
  const fontSize = Math.max(8, Math.round(w * 0.07));
  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      backgroundColor: "#fff",
      padding: `${pad}px`,
      boxSizing: "border-box",
      overflow: "hidden",
    }}>
      <span style={{
        fontFamily: "var(--font-sans)",
        fontWeight: 800,
        fontSize: `${fontSize}px`,
        lineHeight: 1.35,
        color: "#000",
        textAlign: "center",
        textTransform: "uppercase",
        letterSpacing: "0.01em",
        display: "block",
        whiteSpace: "pre-line",
      }}>
        {text}
      </span>
    </div>
  );
}

/* ════════════════════════════════════════════
   FACE CONTENT COMPONENTS
════════════════════════════════════════════ */

/* ── FRONT ── */
function FrontContent({
  flavor, w, h, showGuides,
}: { flavor: Flavor; w: number; h: number; showGuides?: boolean }) {
  const c         = COLOR_MAP[flavor.packageColor as PackageColor] ?? COLOR_MAP.cream;
  const isDark    = flavor.packageColor !== "cream";
  const titleFont = TITLE_FONTS.find(f => f.key === flavor.titleFont)?.css ?? "'Inter', sans-serif";

  /* Content cluster anchor */
  const cx = w * (flavor.contentX / 100);
  const cy = h * (flavor.contentY / 100);

  /* Logo scaled to current face */
  const logoW = Math.round((flavor.logoWidth  / FRONT_W) * w);
  const logoH = Math.round((flavor.logoHeight / FRONT_H) * h);

  /* Text sizing */
  const nameSize    = Math.max(10, Math.round(w * 0.137));
  const taglineSize = Math.max(7,  Math.round(w * 0.049));
  const badgeV      = Math.max(2,  Math.round(h * 0.005));
  const badgeH      = Math.max(8,  Math.round(w * 0.077));

  /* Relative offsets from cy */
  const logoOffsetY  = -(nameSize * 0.6 + logoH * 0.5 + 2);
  const taglineOffY  =   nameSize * 0.6 + 4;
  const badgeOffY    =   taglineOffY + taglineSize * 1.3 + 6;

  /* Health warning border thickness */
  const hwBorder = Math.max(1, Math.round((9 / FRONT_W) * w));

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: c.face }}>

      {/* Art background */}
      {flavor.artImage && (
        <div style={{
          position: "absolute", inset: 0,
          transform: artTransformCSS(w, h, flavor),
          transformOrigin: "top left",
        }}>
          <img
            src={flavor.artImage}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      )}

      {/* ── Health warning: full width, bottom 30%, thick border ── */}
      <div style={{
        position: "absolute", left: 0, top: "70%",
        width: "100%", height: "30%",
        outline: `${hwBorder}px solid #000`,
        outlineOffset: `-${hwBorder}px`,
        pointerEvents: "none", zIndex: 9,
      }}>
        <HealthWarningText text={flavor.healthWarningText} w={w} borderPx={hwBorder} />
      </div>

      {/* Logo */}
      <div style={{
        position: "absolute",
        left: cx, top: cy + logoOffsetY,
        transform: "translate(-50%, -50%)",
        width: logoW, height: logoH,
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none", zIndex: 8,
      }}>
        {flavor.logoImage ? (
          <img src={flavor.logoImage} alt="logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
        ) : showGuides ? (
          <div style={{
            width: "100%", height: "100%",
            border: `1.5px dashed ${isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.25)"}`,
            borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              fontSize: Math.max(6, Math.round(h * 0.018)),
              fontFamily: "var(--font-sans)",
              color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)",
              letterSpacing: "0.07em", textTransform: "uppercase",
            }}>
              Logo
            </span>
          </div>
        ) : null}
      </div>

      {/* Flavor name */}
      <div style={{
        position: "absolute",
        left: cx, top: cy,
        transform: "translate(-50%, -50%)",
        fontFamily: titleFont, fontWeight: 700,
        fontSize: nameSize,
        color: c.text,
        letterSpacing: "-0.01em", lineHeight: 1.05,
        textAlign: "center",
        textShadow: isDark ? "0 1px 8px rgba(0,0,0,0.35)" : "0 1px 4px rgba(255,255,255,0.6)",
        pointerEvents: "none", zIndex: 8, whiteSpace: "nowrap",
      }}>
        {flavor.name || "Flavor Name"}
      </div>

      {/* Tagline */}
      {flavor.tagline && (
        <div style={{
          position: "absolute",
          left: cx, top: cy + taglineOffY,
          transform: "translate(-50%, -50%)",
          fontFamily: "var(--font-sans)",
          fontSize: taglineSize,
          color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.5)",
          letterSpacing: "0.04em", textAlign: "center",
          pointerEvents: "none", zIndex: 8, whiteSpace: "nowrap",
        }}>
          {flavor.tagline}
        </div>
      )}

      {/* Strength badge */}
      <div style={{
        position: "absolute",
        left: cx, top: cy + badgeOffY,
        transform: "translate(-50%, 0)",
        background: flavor.type === "salt"
          ? "#C94B2A"
          : isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.1)",
        border: flavor.type === "salt"
          ? "none"
          : `1px solid ${isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.2)"}`,
        borderRadius: "2px",
        padding: `${badgeV}px ${badgeH}px`,
        pointerEvents: "none", zIndex: 8,
      }}>
        <span style={{
          fontFamily: "var(--font-sans)", fontWeight: 700,
          fontSize: Math.max(6, Math.round(w * 0.052)),
          color: "#fff", letterSpacing: "0.07em", textTransform: "uppercase",
        }}>
          {flavor.type === "salt" ? "SALT" : "FREE"} · {flavor.strength} mg
        </span>
      </div>

      {/* Custom text overlays */}
      {flavor.customTexts.map(txt => {
        const font = TITLE_FONTS.find(f => f.key === txt.fontFamily)?.css ?? "'Inter', sans-serif";
        return (
          <div key={txt.id} style={{
            position: "absolute",
            left: `${txt.x}%`, top: `${txt.y}%`,
            transform: "translate(-50%, -50%)",
            fontFamily: font,
            fontSize: Math.round((txt.fontSize / FRONT_W) * w),
            color: txt.color, fontWeight: 700,
            pointerEvents: "none", zIndex: 10, whiteSpace: "nowrap",
            textShadow: "0 2px 8px rgba(0,0,0,0.4)",
          }}>
            {txt.text}
          </div>
        );
      })}
    </div>
  );
}

/* ── BACK ── */
function BackContent({
  flavor, w, h,
}: { flavor: Flavor; w: number; h: number }) {
  const c      = COLOR_MAP[flavor.packageColor as PackageColor] ?? COLOR_MAP.cream;
  const isDark = flavor.packageColor !== "cream";

  const hwBorder = Math.max(1, Math.round((9 / FRONT_W) * w));

  /* Skull icon position */
  const skullSize = Math.max(24, Math.round(w * 0.32));
  const skullLeft = w * (flavor.skullIconX / 100) - skullSize / 2;
  const skullTop  = h * (flavor.skullIconY / 100) - skullSize / 2;

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: c.side }}>

      {/* Art background (mirrored) */}
      {flavor.artImage && (
        <div style={{
          position: "absolute", inset: 0,
          transform: artTransformCSS(w, h, flavor),
          transformOrigin: "top left",
          opacity: 0.6,
        }}>
          <img
            src={flavor.artImage}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      )}

      {/* Skull / hazard icon */}
      <div style={{
        position: "absolute",
        left: skullLeft, top: skullTop,
        width: skullSize, height: skullSize,
        pointerEvents: "none", zIndex: 4,
      }}>
        {flavor.skullIconImage ? (
          <img src={flavor.skullIconImage} alt="hazard" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        ) : (
          <SkullHazard size={skullSize} color={isDark ? "#fff" : "rgba(0,0,0,0.6)"} />
        )}
      </div>

      {/* Health warning: full width, bottom 30% */}
      <div style={{
        position: "absolute", left: 0, top: "70%",
        width: "100%", height: "30%",
        outline: `${hwBorder}px solid #000`,
        outlineOffset: `-${hwBorder}px`,
        pointerEvents: "none", zIndex: 9,
      }}>
        <HealthWarningText text={flavor.healthWarningText} w={w} borderPx={hwBorder} />
      </div>
    </div>
  );
}

/* ── SIDE (left & right) ── */
function SideContent({
  flavor, w, h, kind,
}: { flavor: Flavor; w: number; h: number; kind: "side-left" | "side-right" }) {
  const c      = COLOR_MAP[flavor.packageColor as PackageColor] ?? COLOR_MAP.cream;

  /* Barcode takes ~60% of width, centered */
  const barcodeW = Math.round(w * 0.92);
  const barcodeH = Math.round(h * 0.38);
  const iconSize = Math.max(18, Math.round(w * 0.45));
  const legalTextSize = Math.max(6, Math.round(w * 0.09));

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: c.side }}>
      {/* Subtle art tint */}
      {flavor.artImage && (
        <img
          src={flavor.artImage}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }}
        />
      )}

      {kind === "side-left" ? (
        <>
          {/* 18+ icon */}
          <div style={{ position: "absolute", top: h * 0.06, left: (w - iconSize) / 2, zIndex: 4, pointerEvents: "none" }}>
            <Icon18Plus size={iconSize} />
          </div>

          {/* Barcode — lower half */}
          <div style={{
            position: "absolute",
            left: (w - barcodeW) / 2,
            top: h * 0.52,
            width: barcodeW, height: barcodeH,
            borderRadius: 2, overflow: "hidden",
          }}>
            <img src={imgBarcode} alt="barcode" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </>
      ) : (
        <>
          {/* Layout-matching legal text placeholders on right side panel */}
          <p style={{
            position: "absolute",
            left: "8%",
            top: "24%",
            width: "84%",
            margin: 0,
            fontFamily: "var(--font-sans)",
            fontSize: legalTextSize,
            lineHeight: 1.35,
            color: "#111",
          }}>
            legal text here ...
          </p>
          <p style={{
            position: "absolute",
            left: "8%",
            top: "71%",
            width: "84%",
            margin: 0,
            fontFamily: "var(--font-sans)",
            fontSize: legalTextSize,
            lineHeight: 1.35,
            color: "#111",
          }}>
            legal text here ...
          </p>
        </>
      )}
    </div>
  );
}

/* ── TOP ── */
function TopContent({ flavor, w, h }: { flavor: Flavor; w: number; h: number }) {
  const c      = COLOR_MAP[flavor.packageColor as PackageColor] ?? COLOR_MAP.cream;
  const isDark = flavor.packageColor !== "cream";
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: c.top }}>
      {flavor.artImage && (
        <img src={flavor.artImage} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 }} />
      )}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{
          fontFamily: "var(--font-sans)", fontWeight: 700,
          fontSize: Math.max(5, Math.round(h * 0.22)),
          color: isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.3)",
          letterSpacing: "0.08em", textTransform: "uppercase",
          whiteSpace: "nowrap",
        }}>
          {flavor.name || "—"}
        </div>
      </div>
    </div>
  );
}

/* ── BOTTOM ── */
function BottomContent({ flavor, w, h }: { flavor: Flavor; w: number; h: number }) {
  const c = COLOR_MAP[flavor.packageColor as PackageColor] ?? COLOR_MAP.cream;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: c.top }}>
      {flavor.artImage && (
        <img src={flavor.artImage} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.2 }} />
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   EXPORTED COMPONENT
════════════════════════════════════════════ */
export function BoxFace({ kind, flavor, width, height, showGuides, style }: BoxFaceProps) {
  const base: CSSProperties = {
    position: "absolute",
    width:    `${width}px`,
    height:   `${height}px`,
    overflow: "hidden",
  };

  const merged = { ...base, ...style };

  const props = { flavor, w: width, h: height, showGuides };

  return (
    <div style={merged}>
      {kind === "front"      && <FrontContent  {...props} />}
      {kind === "back"       && <BackContent   {...props} />}
      {kind === "side-left"  && <SideContent   {...props} kind="side-left" />}
      {kind === "side-right" && <SideContent   {...props} kind="side-right" />}
      {kind === "top"        && <TopContent    {...props} />}
      {kind === "bottom"     && <BottomContent {...props} />}
    </div>
  );
}
