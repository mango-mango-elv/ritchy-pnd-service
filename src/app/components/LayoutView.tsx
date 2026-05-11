import React, { useRef, useState, useEffect, useCallback } from "react";
import type { Flavor, PackageColor } from "./packageTypes";
import { COLOR_MAP, TITLE_FONTS } from "./packageTypes";
import { ZoomIn, ZoomOut, RotateCcw, Move } from "lucide-react";
import { InteractiveElement } from "./InteractiveElement";
import svgPaths from "../../imports/Frame6-2-1/svg-d7jl7780ki";

const imgBarcode =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 120'><rect width='300' height='120' fill='white'/><g fill='black'><rect x='8' y='10' width='4' height='82'/><rect x='16' y='10' width='2' height='82'/><rect x='22' y='10' width='7' height='82'/><rect x='33' y='10' width='3' height='82'/><rect x='39' y='10' width='2' height='82'/><rect x='45' y='10' width='6' height='82'/><rect x='56' y='10' width='2' height='82'/><rect x='62' y='10' width='5' height='82'/><rect x='72' y='10' width='3' height='82'/><rect x='79' y='10' width='8' height='82'/><rect x='91' y='10' width='2' height='82'/><rect x='98' y='10' width='6' height='82'/><rect x='108' y='10' width='3' height='82'/><rect x='114' y='10' width='2' height='82'/><rect x='121' y='10' width='7' height='82'/><rect x='132' y='10' width='3' height='82'/><rect x='138' y='10' width='2' height='82'/><rect x='145' y='10' width='9' height='82'/><rect x='158' y='10' width='2' height='82'/><rect x='164' y='10' width='6' height='82'/><rect x='174' y='10' width='3' height='82'/><rect x='180' y='10' width='2' height='82'/><rect x='186' y='10' width='8' height='82'/><rect x='198' y='10' width='3' height='82'/><rect x='205' y='10' width='5' height='82'/><rect x='214' y='10' width='2' height='82'/><rect x='220' y='10' width='7' height='82'/><rect x='230' y='10' width='3' height='82'/><rect x='236' y='10' width='2' height='82'/><rect x='242' y='10' width='10' height='82'/><rect x='255' y='10' width='3' height='82'/><rect x='261' y='10' width='5' height='82'/><rect x='270' y='10' width='2' height='82'/><rect x='276' y='10' width='7' height='82'/></g><text x='150' y='108' font-family='Arial, sans-serif' font-size='14' text-anchor='middle' fill='black'>5901234123457</text></svg>",
  );

/* ─────────────────────────────────────────────────────────────
   LayoutView — packaging dieline (развертка)

   Native space: 663 × 708 px
   Die bounds: x=7..596, y=41..661
   Die panels L→R: Left side | Front face | Right side | Back face

   Interactive elements (drag to reposition):
     • Logo zone    → moves content cluster (contentX/contentY)
                      resize handles → logoWidth/logoHeight
     • Skull icon   → moves skullIconX/skullIconY on back panel
─────────────────────────────────────────────────────────────*/

const NW = 663;
const NH = 708;
const DX = 7, DY = 41, DW = 589, DH = 620;
const DCX = DX + DW / 2;
const DCY = DY + DH / 2;

const DIE_CLIP =
  "M311 158 H596 V545 H595 V661 H411 V545 H7 V158 H127 V41 H311 V158 Z";

/* Panel bounds in native coords */
const FRONT_X = 136, FRONT_Y = 158, FRONT_W = 166, FRONT_H = 387;
const BACK_X  = 414, BACK_Y  = 158, BACK_W  = 182, BACK_H  = 387;
const SKULL_SIZE = 66;

type EditableElement = "logo" | "skullIcon" | null;

interface LayoutViewProps {
  flavor: Flavor;
  onUpdateArtTransform: (u: { artOffsetX?: number; artOffsetY?: number; artScale?: number }) => void;
  onUpdateFlavor: (u: Partial<Flavor>) => void;
}

/* ── 18+ icon ── */
function Icon18Plus({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" fill="none">
      <circle cx="25" cy="25" r="23" stroke="#fff" strokeWidth="3" />
      <line x1="10" y1="10" x2="40" y2="40" stroke="#fff" strokeWidth="3" />
      {/* "1" — vertical stroke + top-left serif, no <text> */}
      <line x1="12" y1="19" x2="12" y2="32" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" />
      <line x1="9.5" y1="21.5" x2="12" y2="19" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" />
      {/* "8" — two stacked rounded rect outlines */}
      <rect x="17.5" y="19"   width="12" height="6.5" rx="3" stroke="#fff" strokeWidth="2" />
      <rect x="17.5" y="25.5" width="12" height="6.5" rx="3" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

/* ── Skull hazard icon ── */
function SkullHazard({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 66 66" fill="none">
      <path d="M33 3 L63 33 L33 63 L3 33 Z" stroke="#fff" strokeWidth="2.5" fill="rgba(0,0,0,0.45)" />
      <ellipse cx="33" cy="27" rx="9" ry="10" fill="#fff" />
      <rect x="27" y="33" width="4" height="5" rx="1" fill="rgba(0,0,0,0.45)" />
      <rect x="33" y="33" width="4" height="5" rx="1" fill="rgba(0,0,0,0.45)" />
      <circle cx="30" cy="25" r="2.2" fill="rgba(0,0,0,0.45)" />
      <circle cx="36" cy="25" r="2.2" fill="rgba(0,0,0,0.45)" />
      <line x1="23" y1="43" x2="44" y2="51" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="44" y1="43" x2="23" y2="51" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/* ── Main component ── */
export function LayoutView({ flavor, onUpdateArtTransform, onUpdateFlavor }: LayoutViewProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const dieRef  = useRef<HTMLDivElement>(null);
  const [fitScale, setFitScale]   = useState(0.7);
  const [isDrag, setIsDrag]       = useState(false);
  const [selectedElement, setSelectedElement] = useState<EditableElement>(null);

  const dragging    = useRef(false);
  const fitScaleRef = useRef(fitScale);
  fitScaleRef.current = fitScale;

  const imgOffX  = flavor.artOffsetX;
  const imgOffY  = flavor.artOffsetY;
  const imgScale = flavor.artScale;

  /* ── Fit dieline to container ── */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      const s = Math.min((width - 32) / NW, (height - 64) / NH, 1);
      setFitScale(Math.max(s, 0.25));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ── Escape to deselect ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedElement(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ── Art pan (pointer events on die background) ── */
  const onDieDown = useCallback((e: React.PointerEvent) => {
    if (!flavor.artImage) return;
    e.stopPropagation();
    dragging.current = true;
    setIsDrag(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [flavor.artImage]);

  const onDieMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current || !flavor.artImage) return;
    e.stopPropagation();
    const inv = 1 / fitScaleRef.current;
    onUpdateArtTransform({
      artOffsetX: flavor.artOffsetX + e.movementX * inv,
      artOffsetY: flavor.artOffsetY + e.movementY * inv,
    });
  }, [flavor.artImage, flavor.artOffsetX, flavor.artOffsetY, onUpdateArtTransform]);

  const onDieUp = useCallback((e: React.PointerEvent) => {
    dragging.current = false;
    setIsDrag(false);
    e.stopPropagation();
  }, []);

  /* ── Wheel zoom ── */
  useEffect(() => {
    const el = dieRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!flavor.artImage) return;
      e.preventDefault();
      onUpdateArtTransform({ artScale: Math.max(0.3, Math.min(6, flavor.artScale + (e.deltaY > 0 ? -0.1 : 0.1))) });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [flavor.artImage, flavor.artScale, onUpdateArtTransform]);

  const resetImage = () => onUpdateArtTransform({ artOffsetX: 0, artOffsetY: 0, artScale: 1 });

  const c         = COLOR_MAP[flavor.packageColor as PackageColor] ?? COLOR_MAP.cream;
  const isDark    = flavor.packageColor !== "cream";
  const titleFont = TITLE_FONTS.find(f => f.key === flavor.titleFont)?.css ?? "'Inter', sans-serif";
  const artT      = `translate(${DCX + imgOffX},${DCY + imgOffY}) scale(${imgScale}) translate(${-DCX},${-DCY})`;

  /* ── Computed element positions ── */
  const logoLeft = FRONT_X + (flavor.contentX / 100) * FRONT_W - flavor.logoWidth  / 2;
  const logoTop  = FRONT_Y + (flavor.contentY / 100) * FRONT_H - 45 - flavor.logoHeight / 2;

  const skullLeft = BACK_X + (flavor.skullIconX / 100) * BACK_W  - SKULL_SIZE / 2;
  const skullTop  = BACK_Y + (flavor.skullIconY / 100) * BACK_H  - SKULL_SIZE / 2;

  /* Content cluster anchor (shared by name, tagline, badge) */
  const clusterX = FRONT_X + (flavor.contentX / 100) * FRONT_W;
  const clusterY = FRONT_Y + (flavor.contentY / 100) * FRONT_H;

  return (
    <div
      ref={wrapRef}
      style={{
        width: "100%", height: "100%",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        overflow: "hidden", background: "var(--color-bg)",
      }}
    >
      {/* ── Scaled wrapper ── */}
      <div style={{ width: NW * fitScale, height: NH * fitScale, position: "relative", flexShrink: 0 }}>
        <div
          style={{ transform: `scale(${fitScale})`, transformOrigin: "top left", width: NW, height: NH, position: "relative" }}
          /* Click on background deselects any selected element */
          onClick={() => setSelectedElement(null)}
        >

          {/* ══════════════════════════════════════
              SVG LAYER — background + art + fold lines
          ══════════════════════════════════════ */}
          <svg
            style={{ position: "absolute", inset: 0, width: NW, height: NH, overflow: "visible", pointerEvents: "none" }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <clipPath id="lv-die-clip">
                <path d={DIE_CLIP} />
              </clipPath>
            </defs>

            {/* Base fill */}
            <rect x={DX} y={DY} width={DW} height={DH} fill={c.face} clipPath="url(#lv-die-clip)" />

            {/* Side tints */}
            <rect x={DX}  y={158} width={129} height={387} fill={c.side} clipPath="url(#lv-die-clip)" />
            <rect x={302} y={158} width={112} height={387} fill={c.side} clipPath="url(#lv-die-clip)" />

            {/* Art */}
            {flavor.artImage && (
              <g clipPath="url(#lv-die-clip)">
                <g transform={artT}>
                  <image href={flavor.artImage} x={DX} y={DY} width={DW} height={DH} preserveAspectRatio="xMidYMid slice" />
                </g>
              </g>
            )}

            {/* Fold lines */}
            <line x1={136} y1={158} x2={136} y2={545} stroke="rgba(255,255,255,0.55)" strokeWidth="0.8" strokeDasharray="5 4" />
            <line x1={414} y1={158} x2={414} y2={545} stroke="rgba(255,255,255,0.55)" strokeWidth="0.8" strokeDasharray="5 4" />
            <line x1={302} y1={158} x2={302} y2={545} stroke="#709B00" strokeWidth="1.2" />
            <line x1={DX}  y1={158} x2={596} y2={158} stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1={DX}  y1={545} x2={596} y2={545} stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1={127} y1={41}  x2={311} y2={41}  stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" strokeDasharray="2 2" />

            {/* Die cut outline */}
            <path
              d={svgPaths.p2182a500}
              transform={`translate(${DX},${DY})`}
              fill="none"
              stroke="rgba(195,35,35,0.85)"
              strokeWidth="1.5"
            />
          </svg>

          {/* ══════════════════════════════════════
              ART PAN ZONE (background — below interactive elements)
          ══════════════════════════════════════ */}
          <div
            ref={dieRef}
            onPointerDown={onDieDown}
            onPointerMove={onDieMove}
            onPointerUp={onDieUp}
            onPointerCancel={onDieUp}
            style={{
              position: "absolute", left: DX, top: DY, width: DW, height: DH,
              cursor: flavor.artImage ? (isDrag ? "grabbing" : "grab") : "default",
              zIndex: 2,
            }}
          />

          {/* ══════════════════════════════════════
              MANDATORY FIXED OVERLAYS (non-interactive)
          ══════════════════════════════════════ */}

          {/* Health warning — front */}
          <div style={{
            position: "absolute",
            left: FRONT_X, top: FRONT_Y + FRONT_H * 0.7,
            width: FRONT_W, height: FRONT_H * 0.3,
            zIndex: 10, pointerEvents: "none",
            outline: "9px solid #000", outlineOffset: "-9px",
          }}>
            <DielineWarningText text={flavor.healthWarningText} panelW={FRONT_W} borderPx={9} />
          </div>

          {/* Health warning — back */}
          <div style={{
            position: "absolute",
            left: BACK_X, top: BACK_Y + BACK_H * 0.7,
            width: BACK_W, height: BACK_H * 0.3,
            zIndex: 10, pointerEvents: "none",
            outline: "9px solid #000", outlineOffset: "-9px",
          }}>
            <DielineWarningText text={flavor.healthWarningText} panelW={BACK_W} borderPx={9} />
          </div>

          {/* Barcode */}
          <div style={{ position: "absolute", left: 27, top: 358, width: 103, height: 170, borderRadius: 11, overflow: "hidden", zIndex: 4, pointerEvents: "none" }}>
            <img src={imgBarcode} alt="Barcode" style={{ width: "117%", height: "100%", objectFit: "cover", marginLeft: "-8%", display: "block" }} />
          </div>

          {/* 18+ icon */}
          <div style={{ position: "absolute", left: 35, top: 188, width: 50, height: 50, zIndex: 4, pointerEvents: "none" }}>
            <Icon18Plus size={50} />
          </div>

          {/* ══════════════════════════════════════
              INTERACTIVE: SKULL ICON (back panel)
          ══════════════════════════════════════ */}
          <InteractiveElement
            x={skullLeft} y={skullTop}
            width={SKULL_SIZE} height={SKULL_SIZE}
            isSelected={selectedElement === "skullIcon"}
            onSelect={() => setSelectedElement("skullIcon")}
            onMove={(dx, dy) => onUpdateFlavor({
              skullIconX: clamp(flavor.skullIconX + (dx / BACK_W) * 100, 0, 100),
              skullIconY: clamp(flavor.skullIconY + (dy / BACK_H) * 100, 0, 100),
            })}
            fitScale={fitScale}
            hint="Drag to reposition hazard icon on back panel"
          >
            {flavor.skullIconImage
              ? <img src={flavor.skullIconImage} alt="hazard icon" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              : <SkullHazard size={SKULL_SIZE} />
            }
          </InteractiveElement>

          {/* ══════════════════════════════════════
              INTERACTIVE: LOGO (front panel)
              — dragging moves entire content cluster
              — resize handles adjust logo dimensions
          ══════════════════════════════════════ */}
          <InteractiveElement
            x={logoLeft} y={logoTop}
            width={flavor.logoWidth} height={flavor.logoHeight}
            isSelected={selectedElement === "logo"}
            onSelect={() => setSelectedElement("logo")}
            onMove={(dx, dy) => onUpdateFlavor({
              contentX: clamp(flavor.contentX + (dx / FRONT_W) * 100, 0, 100),
              contentY: clamp(flavor.contentY + (dy / FRONT_H) * 100, 0, 100),
            })}
            onResize={(dw, dh) => onUpdateFlavor({
              logoWidth:  clamp(flavor.logoWidth  + dw, 20, 150),
              logoHeight: clamp(flavor.logoHeight + dh, 20, 150),
            })}
            resizable
            fitScale={fitScale}
            hint="Drag to reposition content cluster · corner handles resize logo"
          >
            {flavor.logoImage ? (
              <img src={flavor.logoImage} alt="logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            ) : (
              <div style={{
                width: "100%", height: "100%",
                border: `1.5px dashed ${isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.25)"}`,
                borderRadius: 3,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: 7, fontFamily: "var(--font-sans)", color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)", letterSpacing: "0.07em", textTransform: "uppercase" }}>
                  Logo
                </span>
              </div>
            )}
          </InteractiveElement>

          {/* ══════════════════════════════════════
              NON-INTERACTIVE CONTENT OVERLAYS
              (flavor name, tagline, badge — move with contentX/Y)
          ══════════════════════════════════════ */}

          {/* Flavor name */}
          <div style={{
            position: "absolute", left: clusterX, top: clusterY,
            transform: "translate(-50%, -50%)",
            fontFamily: titleFont, fontWeight: 700, fontSize: 25,
            color: c.text, letterSpacing: "-0.01em", lineHeight: 1.05,
            textAlign: "center", padding: "0 10px",
            textShadow: isDark ? "0 1px 8px rgba(0,0,0,0.35)" : "0 1px 4px rgba(255,255,255,0.6)",
            zIndex: 5, pointerEvents: "none", whiteSpace: "nowrap",
          }}>
            {flavor.name || "Flavor Name"}
          </div>

          {/* Tagline */}
          {flavor.tagline && (
            <div style={{
              position: "absolute", left: clusterX, top: clusterY + 20,
              transform: "translate(-50%, -50%)",
              fontFamily: "var(--font-sans)", fontSize: 9,
              color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.5)",
              letterSpacing: "0.04em", textAlign: "center",
              zIndex: 5, pointerEvents: "none", whiteSpace: "nowrap",
            }}>
              {flavor.tagline}
            </div>
          )}

          {/* Strength badge */}
          <div style={{
            position: "absolute", left: clusterX, top: clusterY + 35,
            transform: "translate(-50%, 0)",
            background: flavor.type === "salt" ? "#C94B2A" : isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.1)",
            border: flavor.type === "salt" ? "none" : `1px solid ${isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.2)"}`,
            borderRadius: 2, padding: "2px 14px",
            zIndex: 5, pointerEvents: "none",
          }}>
            <span style={{
              fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 8,
              color: "#fff", letterSpacing: "0.07em", textTransform: "uppercase",
            }}>
              {flavor.type === "salt" ? "SALT" : "FREE"} · {flavor.strength} mg
            </span>
          </div>

          {/* Panel labels */}
          {(["side","front","side","back","top","bottom"] as const).map((label, i) => {
            const positions = [
              { x: 10,  y: 161 }, { x: 140, y: 161 }, { x: 304, y: 161 },
              { x: 416, y: 161 }, { x: 200, y: 50  }, { x: 490, y: 580 },
            ];
            const { x, y } = positions[i];
            return (
              <div key={i} style={{
                position: "absolute", left: x, top: y,
                fontSize: 7, fontFamily: "var(--font-sans)",
                color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.06em",
                textShadow: "0 1px 2px rgba(0,0,0,0.6)",
                pointerEvents: "none", zIndex: 5,
              }}>
                {label}
              </div>
            );
          })}

          {/* Version tag */}
          <div style={{
            position: "absolute", right: 2, top: "50%",
            transform: "translateY(-50%) rotate(90deg)", transformOrigin: "right center",
            fontSize: 6, fontFamily: "var(--font-sans)",
            color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em",
            whiteSpace: "nowrap", pointerEvents: "none", zIndex: 5,
          }}>
            Version: 01.1.2025
          </div>

          {/* Custom texts */}
          {flavor.customTexts.map(txt => {
            const font = TITLE_FONTS.find(f => f.key === txt.fontFamily)?.css ?? "'Inter', sans-serif";
            return (
              <div key={txt.id} style={{
                position: "absolute",
                left: FRONT_X + (txt.x / 100) * FRONT_W,
                top:  FRONT_Y + (txt.y / 100) * FRONT_H,
                transform: "translate(-50%, -50%)",
                fontFamily: font, fontSize: txt.fontSize,
                color: txt.color, fontWeight: 700,
                pointerEvents: "none", zIndex: 7, whiteSpace: "nowrap",
                textShadow: "0 2px 8px rgba(0,0,0,0.4)",
              }}>
                {txt.text}
              </div>
            );
          })}

          {/* ── Selection hint bar ── */}
          {selectedElement && (
            <div style={{
              position: "absolute", left: FRONT_X, top: FRONT_Y - 22,
              padding: "3px 10px", zIndex: 30, pointerEvents: "none",
              background: "var(--color-accent)", borderRadius: "var(--radius-sm)",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ fontSize: 9, fontFamily: "var(--font-sans)", color: "#fff", letterSpacing: "0.03em" }}>
                {selectedElement === "logo"
                  ? "Content cluster — drag to reposition · corner handles resize logo · Esc to deselect"
                  : "Skull icon — drag to reposition on back panel · Esc to deselect"
                }
              </span>
            </div>
          )}

          {/* ── Art zoom controls ── */}
          {flavor.artImage && (
            <div style={{
              position: "absolute", right: 14, top: 50, zIndex: 25,
              display: "flex", flexDirection: "column", gap: 4,
              background: "rgba(255,255,255,0.92)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "var(--space-2)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.14)",
              backdropFilter: "blur(8px)",
            }}>
              <button onClick={() => onUpdateArtTransform({ artScale: Math.min(6, flavor.artScale + 0.15) })} style={CTRL_BTN} title="Zoom in">
                <ZoomIn size={13} style={{ color: "var(--color-text-primary)" }} />
              </button>
              <button onClick={() => onUpdateArtTransform({ artScale: Math.max(0.3, flavor.artScale - 0.15) })} style={CTRL_BTN} title="Zoom out">
                <ZoomOut size={13} style={{ color: "var(--color-text-primary)" }} />
              </button>
              <div style={{ height: 1, background: "var(--color-border)", margin: "1px 0" }} />
              <button onClick={resetImage} style={CTRL_BTN} title="Reset">
                <RotateCcw size={13} style={{ color: "var(--color-text-primary)" }} />
              </button>
              <div style={{ fontSize: 8, fontFamily: "var(--font-sans)", color: "var(--color-text-muted)", textAlign: "center", marginTop: 1 }}>
                {Math.round(imgScale * 100)}%
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Legend bar ── */}
      <div style={{ marginTop: 8, flexShrink: 0, display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
        <LegendItem color="rgba(195,35,35,0.85)" label="Cut line" />
        <LegendItem color="rgba(180,180,180,0.7)" dashed label="Fold" />
        <LegendItem color="#709B00" label="Main fold" />
        {flavor.artImage && (
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Move size={10} style={{ color: "var(--color-text-muted)" }} />
            <span style={{ fontSize: 9, fontFamily: "var(--font-sans)", color: "var(--color-text-muted)" }}>
              drag · scroll to zoom art
            </span>
          </div>
        )}
        <span style={{ fontSize: 9, fontFamily: "var(--font-sans)", color: "var(--color-text-muted)" }}>
          75 × 35 × 25 mm
        </span>
      </div>
    </div>
  );
}

const CTRL_BTN: React.CSSProperties = {
  width: 26, height: 26,
  display: "flex", alignItems: "center", justifyContent: "center",
  background: "var(--color-surface-raised)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-sm)",
  cursor: "pointer",
};

function LegendItem({ color, dashed, label }: { color: string; dashed?: boolean; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ width: 18, height: 1.5, background: dashed ? "none" : color, borderTop: dashed ? `1.5px dashed ${color}` : "none" }} />
      <span style={{ fontSize: 9, fontFamily: "var(--font-sans)", color: "var(--color-text-muted)" }}>{label}</span>
    </div>
  );
}

function DielineWarningText({ text, panelW, borderPx }: { text: string; panelW: number; borderPx: number }) {
  const fontSize = Math.max(8, Math.round(panelW * 0.055));
  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", alignItems: "center", justifyContent: "center",
      backgroundColor: "#fff",
      padding: `${borderPx + 3}px ${borderPx + 5}px`,
      boxSizing: "border-box",
      overflow: "hidden",
    }}>
      <span style={{
        fontFamily: "var(--font-sans)",
        fontWeight: 800,
        fontSize: `${fontSize}px`,
        lineHeight: 1.3,
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