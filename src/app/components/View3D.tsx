import React, { useRef, useState, useCallback, useEffect } from "react";
import { RotateCcw, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import type { Flavor } from "./packageTypes";
import { BoxFace } from "./BoxFace";

/* ─────────────────────────────────────────────────────────────
   View3D — fully interactive CSS 3D box (75×35×25 mm).
   Drag to rotate. Correct face placement via pivot-edge method.
   Zoom via perspective adjustment (preserves 3D context).
───────────────────────────────────────────────────────────────*/

const SCALE = 4.5; // px per mm

const W = Math.round(35 * SCALE);   // front face width  = 157px
const H = Math.round(75 * SCALE);   // front face height = 337px
const D = Math.round(25 * SCALE);   // depth             = 112px

interface View3DProps {
  flavor: Flavor;
}

export function View3D({ flavor }: View3DProps) {
  const [rotX, setRotX] = useState(-12);
  const [rotY, setRotY] = useState(22);
  const [zoom, setZoom] = useState(1);

  const dragging  = useRef(false);
  const lastXY    = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const basePerspective = 900;
  const minZoom = 0.5;
  const maxZoom = 3;
  const zoomStep = 0.2;

  /* ── Drag handlers ── */
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    lastXY.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastXY.current.x;
    const dy = e.clientY - lastXY.current.y;
    setRotY(r => r + dx * 0.45);
    setRotX(r => Math.max(-60, Math.min(60, r - dy * 0.35)));
    lastXY.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const reset = () => { setRotX(-12); setRotY(22); setZoom(1); };

  /* ── Zoom controls ── */
  const handleZoomIn = () => setZoom(z => Math.min(maxZoom, z + zoomStep));
  const handleZoomOut = () => setZoom(z => Math.max(minZoom, z - zoomStep));

  /* ── Mouse wheel zoom ── */
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
    setZoom(z => Math.max(minZoom, Math.min(maxZoom, z + delta)));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  /* ── CSS face box: W×H front, W×D top/bottom, D×H sides ── */
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        userSelect: "none",
        position: "relative",
      }}
    >
      {/* Zoom controls */}
      <div
        style={{
          position: "absolute",
          top: "var(--space-4)",
          right: "var(--space-4)",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
          background: "var(--color-surface-raised)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          padding: "var(--space-2)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <button
          onClick={handleZoomIn}
          disabled={zoom >= maxZoom}
          title="Zoom in (scroll up)"
          style={{
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: zoom >= maxZoom ? "var(--color-surface)" : "var(--color-surface-raised)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            cursor: zoom >= maxZoom ? "not-allowed" : "pointer",
            opacity: zoom >= maxZoom ? 0.5 : 1,
            transition: "opacity .15s",
          }}
        >
          <ZoomIn size={14} style={{ color: "var(--color-text-primary)" }} />
        </button>

        <button
          onClick={handleZoomOut}
          disabled={zoom <= minZoom}
          title="Zoom out (scroll down)"
          style={{
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: zoom <= minZoom ? "var(--color-surface)" : "var(--color-surface-raised)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            cursor: zoom <= minZoom ? "not-allowed" : "pointer",
            opacity: zoom <= minZoom ? 0.5 : 1,
            transition: "opacity .15s",
          }}
        >
          <ZoomOut size={14} style={{ color: "var(--color-text-primary)" }} />
        </button>

        <div
          style={{
            height: "1px",
            background: "var(--color-border)",
            margin: "2px 0",
          }}
        />

        <button
          onClick={reset}
          title="Reset rotation & zoom"
          style={{
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--color-surface-raised)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            cursor: "pointer",
          }}
        >
          <Maximize2 size={14} style={{ color: "var(--color-text-primary)" }} />
        </button>

        {/* Zoom level indicator */}
        <div
          style={{
            fontSize: "9px",
            fontFamily: "var(--font-sans)",
            color: "var(--color-text-muted)",
            textAlign: "center",
            marginTop: "2px",
            letterSpacing: "0.02em",
          }}
        >
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Drag hint */}
      <div
        style={{
          position: "absolute",
          bottom: "var(--space-3)",
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "11px",
          fontFamily: "var(--font-sans)",
          color: "var(--color-text-muted)",
          pointerEvents: "none",
          letterSpacing: "0.03em",
        }}
      >
        drag to rotate
      </div>

      {/* Scene */}
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        style={{
          width: `${W + D}px`,
          height: `${H + D}px`,
          perspective: `${basePerspective / zoom}px`,
          cursor: dragging.current ? "grabbing" : "grab",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${zoom})`,
          transition: "transform 0.15s ease-out",
        }}
      >
        {/* Centering wrapper — pushes box D/2 toward camera in screen z,
            outside the rotating box root so it's always in screen space */}
        <div style={{ transformStyle: "preserve-3d", transform: `translateZ(${D / 2}px)` }}>
          {/* Box root — rotates */}
          <div
            style={{
              position: "relative",
              width: `${W}px`,
              height: `${H}px`,
              transformStyle: "preserve-3d",
              transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
              transition: dragging.current ? "none" : "transform 0.08s ease-out",
            }}
          >
            {/* ── Front face — at z=0 (no offset; centering wrapper handles visual depth) */}
            <BoxFace
              kind="front"
              flavor={flavor}
              width={W}
              height={H}
              showGuides
              style={{
                top: 0,
                left: 0,
                transform: "none",
                backfaceVisibility: "hidden",
                borderRadius: "1px",
              }}
            />

            {/* ── Back face — at z=-D (full depth behind front) */}
            <BoxFace
              kind="back"
              flavor={flavor}
              width={W}
              height={H}
              style={{
                top: 0,
                left: 0,
                transform: `rotateY(180deg) translateZ(${D}px)`,
                backfaceVisibility: "hidden",
              }}
            />

            {/* ── Right face — pivot at right edge of front (x=W, z=0) */}
            <BoxFace
              kind="side-right"
              flavor={flavor}
              width={D}
              height={H}
              style={{
                top: 0,
                left: W,
                transformOrigin: "left center",
                transform: "rotateY(90deg)",
                backfaceVisibility: "hidden",
              }}
            />

            {/* ── Left face — pivot at left edge of front (x=0, z=0) */}
            <BoxFace
              kind="side-left"
              flavor={flavor}
              width={D}
              height={H}
              style={{
                top: 0,
                left: -D,
                transformOrigin: "right center",
                transform: "rotateY(-90deg)",
                backfaceVisibility: "hidden",
              }}
            />

            {/* ── Top face — pivot at top edge of front (y=0, z=0) */}
            <BoxFace
              kind="top"
              flavor={flavor}
              width={W}
              height={D}
              style={{
                top: -D,
                left: 0,
                transformOrigin: "bottom center",
                transform: "rotateX(90deg)",
                backfaceVisibility: "hidden",
              }}
            />

            {/* ── Bottom face — pivot at bottom edge of front (y=H, z=0) */}
            <BoxFace
              kind="bottom"
              flavor={flavor}
              width={W}
              height={D}
              style={{
                top: H,
                left: 0,
                transformOrigin: "top center",
                transform: "rotateX(-90deg)",
                backfaceVisibility: "hidden",
              }}
            />
          </div>
        </div>
      </div>

      {/* Dimension label */}
      <div
        style={{
          position: "absolute",
          top: "var(--space-3)",
          left: "var(--space-3)",
          fontSize: "11px",
          fontFamily: "var(--font-sans)",
          color: "var(--color-text-muted)",
          letterSpacing: "0.04em",
        }}
      >
        75 × 35 × 25 mm
      </div>
    </div>
  );
}