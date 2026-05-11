import React, { useRef, useState, useCallback, useEffect } from "react";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   ZoomableView — wraps any view with zoom + pan controls.
   - Mouse wheel to zoom
   - Buttons to zoom in/out/reset
   - Pan when zoomed in (drag to move)
───────────────────────────────────────────────────────────────*/

interface ZoomableViewProps {
  children: React.ReactNode;
  /** Initial zoom level (default 1) */
  initialZoom?: number;
  /** Min zoom (default 0.5) */
  minZoom?: number;
  /** Max zoom (default 3) */
  maxZoom?: number;
  /** Zoom step for buttons (default 0.2) */
  zoomStep?: number;
  /** Disable panning (useful when child has own interaction, default false) */
  disablePan?: boolean;
}

export function ZoomableView({
  children,
  initialZoom = 1,
  minZoom = 0.5,
  maxZoom = 3,
  zoomStep = 0.2,
  disablePan = false,
}: ZoomableViewProps) {
  const [zoom, setZoom] = useState(initialZoom);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });

  /* ── Zoom controls ── */
  const handleZoomIn = () => {
    setZoom(z => Math.min(maxZoom, z + zoomStep));
  };

  const handleZoomOut = () => {
    setZoom(z => Math.max(minZoom, z - zoomStep));
  };

  const handleResetZoom = () => {
    setZoom(initialZoom);
    setPanX(0);
    setPanY(0);
  };

  /* ── Mouse wheel zoom ── */
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
    setZoom(z => Math.max(minZoom, Math.min(maxZoom, z + delta)));
  }, [minZoom, maxZoom, zoomStep]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  /* ── Pan controls (when zoomed in) ── */
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (disablePan || zoom <= 1) return; // only pan when zoomed in and pan enabled
    setIsPanning(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [disablePan, zoom]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setPanX(x => x + dx);
    setPanY(y => y + dy);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, [isPanning]);

  const handlePointerUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
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
          onClick={handleResetZoom}
          disabled={zoom === initialZoom && panX === 0 && panY === 0}
          title="Reset zoom & pan"
          style={{
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: zoom === initialZoom && panX === 0 && panY === 0 ? "var(--color-surface)" : "var(--color-surface-raised)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            cursor: zoom === initialZoom && panX === 0 && panY === 0 ? "not-allowed" : "pointer",
            opacity: zoom === initialZoom && panX === 0 && panY === 0 ? 0.5 : 1,
            transition: "opacity .15s",
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

      {/* Content with zoom + pan */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          width: "100%",
          height: "100%",
          cursor: !disablePan && zoom > 1 ? (isPanning ? "grabbing" : "grab") : "default",
          transformOrigin: "center center",
          transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)`,
          transition: isPanning ? "none" : "transform 0.15s ease-out",
        }}
      >
        {children}
      </div>

      {/* Scroll/drag hint when zoomed */}
      {zoom > 1 && !disablePan && (
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
            background: "var(--color-surface-raised)",
            padding: "4px 10px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--color-border)",
            letterSpacing: "0.02em",
          }}
        >
          drag to pan
        </div>
      )}
    </div>
  );
}
