import React, { useRef, useState, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────
   InteractiveElement — draggable + resizable wrapper.

   onMove / onResize receive INCREMENTAL deltas per event,
   already converted to native coordinate space (÷ fitScale).
   Stops event propagation so it doesn't trigger art-pan on
   the parent die div.
─────────────────────────────────────────────────────────────*/

interface InteractiveElementProps {
  children:   React.ReactNode;
  x:          number;           // Absolute position in native px
  y:          number;
  width?:     number;
  height?:    number;
  isSelected: boolean;
  onSelect:   () => void;
  onMove:     (dx: number, dy: number) => void;
  onResize?:  (dw: number, dh: number) => void;
  resizable?: boolean;
  fitScale:   number;           // Screen px → native px conversion
  hint?:      string;           // Tooltip
}

export function InteractiveElement({
  children, x, y, width, height,
  isSelected, onSelect, onMove, onResize,
  resizable = false, fitScale, hint,
}: InteractiveElementProps) {
  const [isDragging,     setIsDragging]     = useState(false);
  const [isResizingState, setIsResizingState] = useState(false);
  // Store last mouse position for incremental deltas
  const lastPos = useRef({ x: 0, y: 0 });

  /* ── Drag ── */
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains("resize-handle")) return;
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
    onSelect();
  }, [onSelect]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || isResizingState) return;
    const inv = 1 / fitScale;
    const dx = (e.clientX - lastPos.current.x) * inv;
    const dy = (e.clientY - lastPos.current.y) * inv;
    lastPos.current = { x: e.clientX, y: e.clientY };
    onMove(dx, dy);
  }, [isDragging, isResizingState, fitScale, onMove]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  /* ── Resize ── */
  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!onResize || !width || !height) return;
    setIsResizingState(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
    onSelect();
  }, [onResize, width, height, onSelect]);

  const handleResizeMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizingState || !onResize) return;
    const inv = 1 / fitScale;
    const dw = (e.clientX - lastPos.current.x) * inv;
    const dh = (e.clientY - lastPos.current.y) * inv;
    lastPos.current = { x: e.clientX, y: e.clientY };
    onResize(dw, dh);
  }, [isResizingState, fitScale, onResize]);

  const handleResizeMouseUp = useCallback(() => {
    setIsResizingState(false);
  }, []);

  /* ── Global listeners ── */
  React.useEffect(() => {
    if (!isDragging) return;
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup",  handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup",  handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  React.useEffect(() => {
    if (!isResizingState) return;
    window.addEventListener("mousemove", handleResizeMouseMove);
    window.addEventListener("mouseup",  handleResizeMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleResizeMouseMove);
      window.removeEventListener("mouseup",  handleResizeMouseUp);
    };
  }, [isResizingState, handleResizeMouseMove, handleResizeMouseUp]);

  const CORNERS = ["nw","n","ne","e","se","s","sw","w"] as const;

  return (
    <div
      title={hint}
      onMouseDown={handleMouseDown}
      onClick={e => e.stopPropagation()}
      /* Stop pointer events from bubbling to the art-pan die layer */
      onPointerDown={e => e.stopPropagation()}
      style={{
        position: "absolute",
        left: x, top: y,
        width, height,
        cursor: isDragging ? "grabbing" : "grab",
        outline: isSelected ? "2px solid var(--color-accent)" : "2px solid transparent",
        outlineOffset: "2px",
        pointerEvents: "auto",
        zIndex: isSelected ? 20 : 6,
        transition: "outline-color .12s",
      }}
    >
      {children}

      {/* Resize handles — only when selected and resizable */}
      {isSelected && resizable && width != null && height != null && CORNERS.map(corner => (
        <div
          key={corner}
          className="resize-handle"
          onMouseDown={handleResizeMouseDown}
          style={{
            position: "absolute",
            width:  corner.length === 1 ? 5 : 7,
            height: corner.length === 1 ? 5 : 7,
            background: "var(--color-accent)",
            border: "1.5px solid #fff",
            borderRadius: "50%",
            cursor: `${corner}-resize`,
            pointerEvents: "auto",
            ...handlePos(corner),
          }}
        />
      ))}
    </div>
  );
}

function handlePos(corner: string): React.CSSProperties {
  const m: Record<string, React.CSSProperties> = {
    nw: { top: -4,   left: -4  },
    n:  { top: -4,   left: "50%", transform: "translateX(-50%)" },
    ne: { top: -4,   right: -4 },
    e:  { top: "50%", right: -4, transform: "translateY(-50%)" },
    se: { bottom: -4, right: -4 },
    s:  { bottom: -4, left: "50%", transform: "translateX(-50%)" },
    sw: { bottom: -4, left: -4  },
    w:  { top: "50%", left: -4,  transform: "translateY(-50%)" },
  };
  return m[corner] ?? {};
}
