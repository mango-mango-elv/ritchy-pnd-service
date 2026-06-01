import React from "react";
import bottleBg from "../../../assets/bottle-bg.png";
import boxGlare from "../../../assets/Blicks_box.png";

interface Props {
  templateId:  string;
  brandName:   string;
  flavorName:  string;
  strength:    string;
  nicType:     "salt" | "freebase";
  gradient:    string;
  logoDataUrl: string;
  logoScale?:  number;
  bgImageDataUrl?: string;
  bgImagePositionBox?: { x: number; y: number; };
  bgImageScaleBox?: number;
  bgImagePositionBottle?: { x: number; y: number; };
  bgImageScaleBottle?: number;
  onBgPositionBoxChange?: (pos: { x: number; y: number; }) => void;
  onBgPositionBottleChange?: (pos: { x: number; y: number; }) => void;
  colorTab?: string;
  graphicsColor?: string;
  healthWarningText?: string;
}

interface BoxProps {
  brand:      string;
  flavor:     string;
  strength:   string;
  nicLabel:   string;
  gradient:   string;
  logoDataUrl: string;
  logoScale?:  number;
  bgImageDataUrl?: string;
  bgImagePosition?: { x: number; y: number; };
  bgImageScale?: number;
  onBgPositionChange?: (pos: { x: number; y: number; }) => void;
  colorTab?: string;
  graphicsColor?: string;
  healthWarningText?: string;
}

interface BottleProps extends BoxProps {
  logoDataUrl: string;
}

const WARNING_TEXT = "This product contains nicotine which is a highly addictive substance.";

const abs = (style: React.CSSProperties): React.CSSProperties => ({ position: "absolute", ...style });

/* ─── Shared Image Background ─────────────────────────────────── */
function ImageBackground({
  bgImageDataUrl,
  bgImagePosition = { x: 0, y: 0 },
  bgImageScale = 1.0,
  onBgPositionChange,
  draggable
}: {
  bgImageDataUrl: string;
  bgImagePosition?: { x: number; y: number; };
  bgImageScale?: number;
  onBgPositionChange?: (pos: { x: number; y: number; }) => void;
  draggable?: boolean;
}) {
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable || !onBgPositionChange) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const startBgX = bgImagePosition.x;
    const startBgY = bgImagePosition.y;

    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      onBgPositionChange({ x: startBgX + dx, y: startBgY + dy });
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      target.releasePointerCapture(e.pointerId);
      target.removeEventListener("pointermove", handlePointerMove);
      target.removeEventListener("pointerup", handlePointerUp);
    };

    target.addEventListener("pointermove", handlePointerMove);
    target.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        cursor: draggable ? "move" : "default",
        touchAction: draggable ? "none" : "auto",
      }}
    >
      <img
        src={bgImageDataUrl}
        alt="background"
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: `translateX(-50%) translate(${bgImagePosition.x}px, ${bgImagePosition.y}px) scale(${bgImageScale})`,
          transformOrigin: "top center",
          height: "100%",
          width: "auto",
          maxWidth: "none",
          maxHeight: "none",
          display: "block",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </div>
  );
}

/* ─── Box root wrapper ────────────────────────────────────────── */
function BoxRoot({ children }: { children: React.ReactNode }) {
  return (
    <div className="v2-box-root" style={{
      position: "relative", width: "100%", aspectRatio: "164 / 363",
      overflow: "hidden", borderRadius: "4px",
    }}>
      {children}
      {/* Box Glare Overlay (Raster PNG from Figma) */}
      <img
        src={boxGlare}
        alt="glare"
        style={abs({
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "fill",
          pointerEvents: "none",
          zIndex: 10,
        })}
      />
    </div>
  );
}

/* ─── Shared warning zone — exactly 32% of box height ────────── */
function WarningZone({ text }: { text?: string }) {
  const warning = text || WARNING_TEXT;
  // The zone is a fixed 32% of the box, but market-specific warnings vary in
  // length. Scale the font down for longer text so it never clips the box —
  // the short default keeps its pixel-perfect Figma size.
  const len = warning.length;
  const fontSize =
    len <= 80  ? "8.2cqw" :
    len <= 110 ? "6.6cqw" :
    len <= 150 ? "5.6cqw" :
                 "4.8cqw";
  return (
    <div style={abs({
      top: "68%", left: 0, right: 0, bottom: 0,
      boxSizing: "border-box",
      border: "10px solid #000",
      background: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "8px 12px", // premium protective padding
      overflow: "hidden",
      pointerEvents: "none",
    })}>
      <p style={{
        margin: 0,
        fontSize, // scales with warning length to stay inside the zone
        fontWeight: 800,
        color: "#111",
        textAlign: "center",
        lineHeight: 1.15,
        fontFamily: "var(--font-sans)",
      }}>
        {warning}
      </p>
    </div>
  );
}


/* ─── T1 — Flavor First ───────────────────────────────────────── */
export function BoxT1Flavor({ brand, flavor, strength, nicLabel, gradient, logoDataUrl, logoScale, bgImageDataUrl, bgImagePosition, bgImageScale, onBgPositionChange, colorTab, graphicsColor, healthWarningText }: BoxProps) {
  const nicText = `${nicLabel} • ${strength}`;
  const textColor = graphicsColor ?? "#ffffff";
  return (
    <BoxRoot>
      {/* bg */}
      {bgImageDataUrl ? (
        <ImageBackground
          bgImageDataUrl={bgImageDataUrl}
          bgImagePosition={bgImagePosition}
          bgImageScale={bgImageScale}
          onBgPositionChange={onBgPositionChange}
          draggable={colorTab === "image"}
        />
      ) : (
        <div style={abs({ inset: 0, background: gradient })} />
      )}

      {/* flavor — large, top-left */}
      <div style={abs({ top: "7%", left: "7.5%", right: "7.5%", pointerEvents: "none" })}>
        <p style={{
          margin: 0,
          fontSize: "11.5cqw",
          fontWeight: 900,
          color: textColor,
          textTransform: "uppercase",
          lineHeight: 1.1,
          wordBreak: "break-word",
          fontFamily: "'Albert Sans', var(--font-sans)",
        }}>
          {flavor}
        </p>
      </div>

      {/* nic and strength */}
      <div style={abs({ top: "26.5%", left: "7.5%", right: "7.5%", pointerEvents: "none" })}>
        <p style={{
          margin: 0,
          fontSize: "4.8cqw",
          fontWeight: 600,
          color: textColor,
          opacity: 0.95,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontFamily: "var(--font-sans)",
        }}>
          {nicText}
        </p>
      </div>

      {/* separator line */}
      <div style={abs({
        top: "33%",
        left: 0,
        right: 0,
        height: "1.2cqw",
        background: textColor,
        pointerEvents: "none",
      })} />

      {/* brand logo/text — bottom-left */}
      <div style={abs({
        bottom: "35%",
        left: "7.5%",
        right: "7.5%",
        height: "12cqw",
        display: "flex",
        alignItems: "flex-end",
        pointerEvents: "none",
      })}>
        {logoDataUrl ? (
          <img
            src={logoDataUrl}
            alt="logo"
            style={{
              maxWidth: "45%",
              maxHeight: "100%",
              objectFit: "contain",
              transform: logoScale && logoScale !== 1 ? `scale(${logoScale})` : undefined,
              transformOrigin: "bottom left",
            }}
          />
        ) : (
          <p style={{
            margin: 0,
            fontSize: "6.5cqw",
            fontWeight: 900,
            color: textColor,
            textTransform: "uppercase",
            fontFamily: "'Albert Sans', var(--font-sans)",
            letterSpacing: "0.03em",
          }}>
            {brand}
          </p>
        )}
      </div>

      <WarningZone text={healthWarningText} />
    </BoxRoot>
  );
}

/* ─── T2 — Centered (matches Figma Template 12, canvas 164×363) ── */
export function BoxT2Centered({ brand, flavor, strength, nicLabel, gradient, logoDataUrl, logoScale, bgImageDataUrl, bgImagePosition, bgImageScale, onBgPositionChange, colorTab, graphicsColor, healthWarningText }: BoxProps) {
  const textColor = graphicsColor ?? "#252525";
  return (
    <BoxRoot>
      {/* background */}
      {bgImageDataUrl ? (
        <ImageBackground
          bgImageDataUrl={bgImageDataUrl}
          bgImagePosition={bgImagePosition}
          bgImageScale={bgImageScale}
          onBgPositionChange={onBgPositionChange}
          draggable={colorTab === "image"}
        />
      ) : (
        <div style={abs({ inset: 0, background: gradient })} />
      )}

      {/* logo centered in the upper brand zone */}
      {logoDataUrl && (
        <div style={abs({
          top: "12%", left: 0, right: 0, bottom: "70.25%",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4%",
          pointerEvents: "none"
        })}>
          <img
            src={logoDataUrl}
            alt="logo"
            style={{
              maxWidth: "60%",
              maxHeight: "80%",
              objectFit: "contain",
              transform: logoScale && logoScale !== 1 ? `scale(${logoScale})` : undefined,
              transformOrigin: "center center",
            }}
          />
        </div>
      )}

      {/* brand — 15.43%–29.75% zone, Albert Sans Black */}
      {!logoDataUrl && (
        <div style={abs({ top: "15.43%", left: 0, right: 0, bottom: "70.25%",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4%",
          pointerEvents: "none" })}>
          <p style={{
            margin: 0,
            fontSize: "18.3cqw",
            fontWeight: 900,
            fontFamily: "'Albert Sans', 'Arial Black', -apple-system, sans-serif",
            color: textColor,
            textTransform: "uppercase",
            textAlign: "center",
            lineHeight: 0.82,
            letterSpacing: "-0.04em",
            wordBreak: "break-word",
          }}>
            {brand}
          </p>
        </div>
      )}

      {/* flavor — at 42.5%, Albert Sans ExtraBold */}
      <div style={abs({ top: "42.5%", left: 0, right: 0, pointerEvents: "none" })}>
        <p style={{
          margin: 0,
          fontSize: "11.5cqw",
          fontWeight: 900,
          fontFamily: "'Albert Sans', 'Arial Black', -apple-system, sans-serif",
          color: textColor,
          textTransform: "uppercase",
          textAlign: "center",
          lineHeight: 1.0,
          letterSpacing: "-0.03em",
          wordBreak: "break-word",
        }}>
          {flavor}
        </p>
      </div>

      {/* divider — at 60.3% */}
      <div style={abs({
        top: "60.3%", left: "6.71%", right: "6.71%", height: "0.6cqw",
        background: textColor,
        pointerEvents: "none",
      })} />

      {/* footer — strength left, nic label right, at 61.5% */}
      <div style={abs({
        top: "61.5%", left: "6.71%", right: "6.71%",
        display: "flex", justifyContent: "space-between", paddingTop: "1.2%",
        pointerEvents: "none",
      })}>
        <span style={{ fontSize: "6.1cqw", fontWeight: 600, color: textColor, fontFamily: "var(--font-sans)" }}>
          {strength}
        </span>
        <span style={{ fontSize: "6.1cqw", fontWeight: 600, color: textColor, fontFamily: "var(--font-sans)" }}>
          {nicLabel}
        </span>
      </div>

      <WarningZone text={healthWarningText} />
    </BoxRoot>
  );
}

/* ─── T3 — Split (horizontal 50/50 split of brand/flavor area) ── */
export function BoxT3Split({ brand, flavor, strength, nicLabel, gradient, logoDataUrl, logoScale, bgImageDataUrl, bgImagePosition, bgImageScale, onBgPositionChange, colorTab, graphicsColor, healthWarningText }: BoxProps) {
  const textColor = graphicsColor ?? "#ffffff";
  const isDarkGraphics = textColor === "#252525";
  const topBgColor = isDarkGraphics ? "#ffffff" : "#252525";
  const topTextColor = isDarkGraphics ? "#252525" : "#ffffff";

  const brandLength = brand.length || 1;
  const brandFontSize = Math.min(32.3, 100 / (brandLength * 0.7));

  return (
    <BoxRoot>
      {/* Lower half (colored/image background) */}
      {bgImageDataUrl ? (
        <ImageBackground
          bgImageDataUrl={bgImageDataUrl}
          bgImagePosition={bgImagePosition}
          bgImageScale={bgImageScale}
          onBgPositionChange={onBgPositionChange}
          draggable={colorTab === "image"}
        />
      ) : (
        <div style={abs({ inset: 0, background: gradient })} />
      )}

      {/* Top half (solid contrast background) - NO BORDER */}
      <div style={abs({
        top: 0, left: 0, right: 0, height: "34%",
        background: topBgColor,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 6%",
        boxSizing: "border-box",
        zIndex: 1,
        pointerEvents: "none",
      })}>
        {logoDataUrl ? (
          <img
            src={logoDataUrl}
            alt="logo"
            style={{
              maxWidth: "65%",
              maxHeight: "75%",
              objectFit: "contain",
              transform: logoScale && logoScale !== 1 ? `scale(${logoScale})` : undefined,
              transformOrigin: "center center",
            }}
          />
        ) : (
          <p style={{
            margin: 0,
            fontSize: `${brandFontSize}cqw`,
            fontWeight: 400,
            fontFamily: "'Aboreto', sans-serif",
            color: topTextColor,
            textTransform: "uppercase",
            textAlign: "center",
            lineHeight: 0.87,
            letterSpacing: "0em",
            whiteSpace: "nowrap",
            wordBreak: "keep-all",
          }}>
            {brand}
          </p>
        )}
      </div>

      {/* Flavor — left-aligned in bottom half */}
      <div style={abs({ top: "41.5%", left: "6.71%", right: "15%", pointerEvents: "none", zIndex: 1 })}>
        <p style={{
          margin: 0,
          fontSize: "9cqw",
          fontWeight: 400,
          fontFamily: "'Aboreto', sans-serif",
          color: textColor,
          textTransform: "uppercase",
          textAlign: "left",
          lineHeight: 1.2,
          letterSpacing: "0em",
          wordBreak: "break-word",
        }}>
          {flavor}
        </p>
      </div>

      {/* Divider — below flavor in bottom half */}
      <div style={abs({
        top: "60.3%", left: "6.71%", right: "6.71%", height: "0.6cqw",
        background: textColor,
        pointerEvents: "none",
        zIndex: 1,
      })} />

      {/* Footer — strength & nic in bottom half */}
      <div style={abs({
        top: "61.5%", left: "6.71%", right: "6.71%",
        display: "flex", justifyContent: "flex-start", gap: "8cqw", paddingTop: "1.2%",
        pointerEvents: "none",
        zIndex: 1,
      })}>
        <span style={{ fontSize: "6.1cqw", fontWeight: 600, color: textColor, fontFamily: "var(--font-sans)", letterSpacing: "0.02em" }}>
          {strength}
        </span>
        <span style={{ fontSize: "6.1cqw", fontWeight: 600, color: textColor, fontFamily: "var(--font-sans)", letterSpacing: "0.02em" }}>
          {nicLabel}
        </span>
      </div>

      <WarningZone text={healthWarningText} />
    </BoxRoot>
  );
}

/* ─── T4 — Badge (floating apothecary card badge) ──────────────── */
export function BoxT4Badge({ brand, flavor, strength, nicLabel, gradient, logoDataUrl, logoScale, bgImageDataUrl, bgImagePosition, bgImageScale, onBgPositionChange, colorTab, graphicsColor, healthWarningText }: BoxProps) {
  const textColor = graphicsColor ?? "#ffffff";
  const isDarkGraphics = textColor === "#252525";
  const badgeBg = isDarkGraphics ? "#ffffff" : "#1a1a1a";
  const badgeText = isDarkGraphics ? "#252525" : "#ffffff";
  const badgeBorder = isDarkGraphics ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)";
  const dividerBg = isDarkGraphics ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.2)";

  return (
    <BoxRoot>
      {/* background */}
      {bgImageDataUrl ? (
        <ImageBackground
          bgImageDataUrl={bgImageDataUrl}
          bgImagePosition={bgImagePosition}
          bgImageScale={bgImageScale}
          onBgPositionChange={onBgPositionChange}
          draggable={colorTab === "image"}
        />
      ) : (
        <div style={abs({ inset: 0, background: gradient })} />
      )}

      {/* Floating Badge */}
      <div style={abs({
        top: "7.5%", left: "8%", right: "8%", height: "52.5%",
        background: badgeBg,
        borderRadius: "12px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.14), 0 1px 3px rgba(0,0,0,0.08)",
        border: `1px solid ${badgeBorder}`,
        boxSizing: "border-box",
        padding: "5%",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
        pointerEvents: "none",
        zIndex: 1,
      })}>
        {/* Brand/logo centered at top of badge */}
        <div style={{ width: "100%", height: "30%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {logoDataUrl ? (
            <img
              src={logoDataUrl}
              alt="logo"
              style={{
                maxWidth: "75%",
                maxHeight: "90%",
                objectFit: "contain",
                transform: logoScale && logoScale !== 1 ? `scale(${logoScale})` : undefined,
                transformOrigin: "center center",
              }}
            />
          ) : (
            <p style={{
              margin: 0,
              fontSize: "7.5cqw",
              fontWeight: 900,
              fontFamily: "'Albert Sans', var(--font-sans)",
              color: badgeText,
              textTransform: "uppercase",
              textAlign: "center",
              lineHeight: 0.9,
              wordBreak: "break-word",
            }}>
              {brand}
            </p>
          )}
        </div>

        {/* Badge elegant thin divider */}
        <div style={{ width: "85%", height: "1px", background: dividerBg, margin: "2% 0" }} />

        {/* Flavor centered */}
        <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{
            margin: 0,
            fontSize: "8.5cqw",
            fontWeight: 800,
            fontFamily: "'Albert Sans', var(--font-sans)",
            color: badgeText,
            textTransform: "uppercase",
            textAlign: "center",
            lineHeight: 1.05,
            wordBreak: "break-word",
          }}>
            {flavor}
          </p>
        </div>

        {/* Strength and Nicotine at bottom of badge */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: "1px"
        }}>
          <span style={{ fontSize: "5cqw", fontWeight: 700, color: badgeText, fontFamily: "var(--font-sans)", letterSpacing: "0.03em" }}>
            {strength}
          </span>
          <span style={{ fontSize: "4cqw", fontWeight: 500, color: badgeText, opacity: 0.8, fontFamily: "var(--font-sans)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {nicLabel}
          </span>
        </div>
      </div>

      <WarningZone text={healthWarningText} />
    </BoxRoot>
  );
}

/* ─── T5 — Vertical (Swiss vertical flavor layout) ──────────────── */
export function BoxT5Vertical({ brand, flavor, strength, nicLabel, gradient, logoDataUrl, logoScale, bgImageDataUrl, bgImagePosition, bgImageScale, onBgPositionChange, colorTab, graphicsColor, healthWarningText }: BoxProps) {
  const textColor = graphicsColor ?? "#ffffff";

  return (
    <BoxRoot>
      {/* background */}
      {bgImageDataUrl ? (
        <ImageBackground
          bgImageDataUrl={bgImageDataUrl}
          bgImagePosition={bgImagePosition}
          bgImageScale={bgImageScale}
          onBgPositionChange={onBgPositionChange}
          draggable={colorTab === "image"}
        />
      ) : (
        <div style={abs({ inset: 0, background: gradient })} />
      )}

      {/* Brand logo/text — top right horizontal */}
      <div style={abs({
        top: "6%",
        right: "8%",
        left: "32%",
        height: "12cqw",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        pointerEvents: "none",
        zIndex: 1,
      })}>
        {logoDataUrl ? (
          <img
            src={logoDataUrl}
            alt="logo"
            style={{
              maxWidth: "85%",
              maxHeight: "100%",
              objectFit: "contain",
              transform: logoScale && logoScale !== 1 ? `scale(${logoScale})` : undefined,
              transformOrigin: "top right",
            }}
          />
        ) : (
          <p style={{
            margin: 0,
            fontSize: "6cqw",
            fontWeight: 900,
            color: textColor,
            textTransform: "uppercase",
            textAlign: "right",
            fontFamily: "'Albert Sans', var(--font-sans)",
            letterSpacing: "0.05em",
          }}>
            {brand}
          </p>
        )}
      </div>

      {/* Flavor — bold vertical running along the left side */}
      <div style={abs({
        top: "5%",
        left: "5%",
        bottom: "35%",
        width: "28%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 1,
      })}>
        <div style={{
          transform: "rotate(-90deg)",
          whiteSpace: "nowrap",
        }}>
          <p style={{
            margin: 0,
            fontSize: "9.5cqw",
            fontWeight: 900,
            fontFamily: "'Albert Sans', var(--font-sans)",
            color: textColor,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            textAlign: "center",
          }}>
            {flavor}
          </p>
        </div>
      </div>

      {/* Strength & Nic — bottom right corner, stacked neatly */}
      <div style={abs({
        bottom: "35%",
        right: "8%",
        left: "35%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "2px",
        pointerEvents: "none",
        zIndex: 1,
      })}>
        <span style={{ fontSize: "5.5cqw", fontWeight: 700, color: textColor, fontFamily: "var(--font-sans)", letterSpacing: "0.02em" }}>
          {strength}
        </span>
        <span style={{ fontSize: "4.5cqw", fontWeight: 500, color: textColor, opacity: 0.85, fontFamily: "var(--font-sans)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {nicLabel}
        </span>
      </div>

      <WarningZone text={healthWarningText} />
    </BoxRoot>
  );
}

/* ─── BOX routing ─────────────────────────────────────────────── */
const BOX_MAP: Record<string, React.FC<BoxProps>> = {
  "t1-flavor":   BoxT1Flavor,
  "t2-centered": BoxT2Centered,
  "t3-split":    BoxT3Split,
  "t4-badge":    BoxT4Badge,
  "t5-vertical": BoxT5Vertical,
};

/* ─── Bottle label layouts ────────────────────────────────────── */
function BottleLabelT1({ brand, flavor, strength, nicLabel, gradient, logoDataUrl, logoScale, bgImageDataUrl, bgImagePosition, bgImageScale, onBgPositionChange, colorTab, graphicsColor }: BottleProps) {
  const nicText = `${nicLabel} • ${strength}`;
  const textColor = graphicsColor ?? "#ffffff";
  return (
    <div style={{
      position: "absolute",
      inset: "50.96% 27.71% 5.23% 9.04%",
      overflow: "hidden",
      containerType: "inline-size",
    }}>
      {bgImageDataUrl ? (
        <ImageBackground
          bgImageDataUrl={bgImageDataUrl}
          bgImagePosition={bgImagePosition}
          bgImageScale={bgImageScale}
          onBgPositionChange={onBgPositionChange}
          draggable={colorTab === "image"}
        />
      ) : (
        <div style={abs({ inset: 0, background: gradient })} />
      )}
      {/* flavor — top-left */}
      <div style={{
        position: "absolute",
        top: "10.3%",
        left: "7.5%",
        right: "7.5%",
        pointerEvents: "none",
      }}>
        <p style={{
          margin: 0,
          fontSize: "11.5cqw",
          fontWeight: 900,
          color: textColor,
          textTransform: "uppercase",
          lineHeight: 1.1,
          wordBreak: "break-word",
          fontFamily: "'Albert Sans', var(--font-sans)",
        }}>
          {flavor}
        </p>
      </div>

      {/* nic and strength */}
      <div style={{
        position: "absolute",
        top: "39%",
        left: "7.5%",
        right: "7.5%",
        pointerEvents: "none",
      }}>
        <p style={{
          margin: 0,
          fontSize: "4.8cqw",
          fontWeight: 600,
          color: textColor,
          opacity: 0.95,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontFamily: "var(--font-sans)",
        }}>
          {nicText}
        </p>
      </div>

      {/* separator line */}
      <div style={{
        position: "absolute",
        top: "48.5%",
        left: 0,
        right: 0,
        height: "1.2cqw",
        background: textColor,
        pointerEvents: "none",
      }} />

      {/* brand/logo — bottom-left */}
      <div style={{
        position: "absolute",
        bottom: "8%",
        left: "7.5%",
        right: "7.5%",
        height: "12cqw",
        display: "flex",
        alignItems: "flex-end",
        pointerEvents: "none",
      }}>
        {logoDataUrl ? (
          <img
            src={logoDataUrl}
            alt="logo"
            style={{
              maxWidth: "45%",
              maxHeight: "100%",
              objectFit: "contain",
              transform: logoScale && logoScale !== 1 ? `scale(${logoScale})` : undefined,
              transformOrigin: "bottom left",
            }}
          />
        ) : (
          <p style={{
            margin: 0,
            fontSize: "6.5cqw",
            fontWeight: 900,
            color: textColor,
            textTransform: "uppercase",
            fontFamily: "'Albert Sans', var(--font-sans)",
            letterSpacing: "0.03em",
          }}>
            {brand}
          </p>
        )}
      </div>
    </div>
  );
}

function BottleLabelT2({ brand, flavor, strength, nicLabel, gradient, logoDataUrl, logoScale, bgImageDataUrl, bgImagePosition, bgImageScale, onBgPositionChange, colorTab, graphicsColor }: BottleProps) {
  const textColor = graphicsColor ?? "#252525";
  return (
    <div style={{
      position: "absolute",
      inset: "50.96% 27.71% 5.23% 9.04%",
      overflow: "hidden",
      containerType: "inline-size",
    }}>
      {bgImageDataUrl ? (
        <ImageBackground
          bgImageDataUrl={bgImageDataUrl}
          bgImagePosition={bgImagePosition}
          bgImageScale={bgImageScale}
          onBgPositionChange={onBgPositionChange}
          draggable={colorTab === "image"}
        />
      ) : (
        <div style={abs({ inset: 0, background: gradient })} />
      )}
      {/* brand/logo — centered in the upper zone */}
      <div style={{
        position: "absolute",
        top: "22.7%",
        left: 0,
        right: 0,
        bottom: "56.25%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 4%",
        pointerEvents: "none",
      }}>
        {logoDataUrl ? (
          <img
            src={logoDataUrl}
            alt="logo"
            style={{
              maxWidth: "60%",
              maxHeight: "80%",
              objectFit: "contain",
              transform: logoScale && logoScale !== 1 ? `scale(${logoScale})` : undefined,
              transformOrigin: "center center",
            }}
          />
        ) : (
          <p style={{
            margin: 0,
            fontSize: "18.3cqw",
            fontWeight: 900,
            fontFamily: "'Albert Sans', 'Arial Black', -apple-system, sans-serif",
            color: textColor,
            textTransform: "uppercase",
            textAlign: "center",
            lineHeight: 0.82,
            letterSpacing: "-0.04em",
            wordBreak: "break-word",
          }}>
            {brand}
          </p>
        )}
      </div>

      {/* flavor — centered in the lower zone */}
      <div style={{
        position: "absolute",
        top: "55.5%",
        left: 0,
        right: 0,
        pointerEvents: "none",
      }}>
        <p style={{
          margin: 0,
          fontSize: "11.5cqw",
          fontWeight: 900,
          fontFamily: "'Albert Sans', 'Arial Black', -apple-system, sans-serif",
          color: textColor,
          textTransform: "uppercase",
          textAlign: "center",
          lineHeight: 1.0,
          letterSpacing: "-0.03em",
          wordBreak: "break-word",
        }}>
          {flavor}
        </p>
      </div>

      {/* separator line — below flavor */}
      <div style={{
        position: "absolute",
        top: "80%",
        left: "6.71%",
        right: "6.71%",
        height: "0.6cqw",
        background: textColor,
        pointerEvents: "none",
      }} />

      {/* footer — strength left, nic salt right */}
      <div style={{
        position: "absolute",
        top: "81.2%",
        left: "6.71%",
        right: "6.71%",
        display: "flex",
        justifyContent: "space-between",
        paddingTop: "1.2%",
        pointerEvents: "none",
      }}>
        <span style={{ fontSize: "6.1cqw", fontWeight: 600, color: textColor, fontFamily: "var(--font-sans)" }}>
          {strength}
        </span>
        <span style={{ fontSize: "6.1cqw", fontWeight: 600, color: textColor, fontFamily: "var(--font-sans)" }}>
          {nicLabel}
        </span>
      </div>
    </div>
  );
}

function BottleLabelT3({ brand, flavor, strength, nicLabel, gradient, logoDataUrl, logoScale, bgImageDataUrl, bgImagePosition, bgImageScale, onBgPositionChange, colorTab, graphicsColor }: BottleProps) {
  const textColor = graphicsColor ?? "#ffffff";
  const isDarkGraphics = textColor === "#252525";
  const topBgColor = isDarkGraphics ? "#ffffff" : "#252525";
  const topTextColor = isDarkGraphics ? "#252525" : "#ffffff";

  const brandLength = brand.length || 1;
  const brandFontSize = Math.min(32.3, 100 / (brandLength * 0.7));

  return (
    <div style={{
      position: "absolute",
      inset: "50.96% 27.71% 5.23% 9.04%",
      overflow: "hidden",
      containerType: "inline-size",
    }}>
      {bgImageDataUrl ? (
        <ImageBackground
          bgImageDataUrl={bgImageDataUrl}
          bgImagePosition={bgImagePosition}
          bgImageScale={bgImageScale}
          onBgPositionChange={onBgPositionChange}
          draggable={colorTab === "image"}
        />
      ) : (
        <div style={abs({ inset: 0, background: gradient })} />
      )}

      {/* Top half (solid contrast background) - NO BORDER */}
      <div style={abs({
        top: 0, left: 0, right: 0, height: "34%",
        background: topBgColor,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "0 6%",
        boxSizing: "border-box",
        zIndex: 1,
        pointerEvents: "none",
      })}>
        {logoDataUrl ? (
          <img
            src={logoDataUrl}
            alt="logo"
            style={{
              maxWidth: "65%",
              maxHeight: "75%",
              objectFit: "contain",
              transform: logoScale && logoScale !== 1 ? `scale(${logoScale})` : undefined,
              transformOrigin: "center center",
            }}
          />
        ) : (
          <p style={{
            margin: 0,
            fontSize: `${brandFontSize}cqw`,
            fontWeight: 400,
            fontFamily: "'Aboreto', sans-serif",
            color: topTextColor,
            textTransform: "uppercase",
            textAlign: "center",
            lineHeight: 0.87,
            letterSpacing: "0em",
            whiteSpace: "nowrap",
            wordBreak: "keep-all",
          }}>
            {brand}
          </p>
        )}
      </div>

      {/* Flavor — left-aligned in bottom half */}
      <div style={abs({ top: "41.5%", left: "6.71%", right: "15%", pointerEvents: "none", zIndex: 1 })}>
        <p style={{
          margin: 0,
          fontSize: "9cqw",
          fontWeight: 400,
          fontFamily: "'Aboreto', sans-serif",
          color: textColor,
          textTransform: "uppercase",
          textAlign: "left",
          lineHeight: 1.2,
          letterSpacing: "0em",
          wordBreak: "break-word",
        }}>
          {flavor}
        </p>
      </div>

      {/* Divider — below flavor in bottom half */}
      <div style={abs({
        top: "60.3%", left: "6.71%", right: "6.71%", height: "0.6cqw",
        background: textColor,
        pointerEvents: "none",
        zIndex: 1,
      })} />

      {/* Footer — strength & nic in bottom half */}
      <div style={abs({
        top: "61.5%", left: "6.71%", right: "6.71%",
        display: "flex", justifyContent: "flex-start", gap: "8cqw", paddingTop: "1.2%",
        pointerEvents: "none",
        zIndex: 1,
      })}>
        <span style={{ fontSize: "6.1cqw", fontWeight: 600, color: textColor, fontFamily: "var(--font-sans)", letterSpacing: "0.02em" }}>
          {strength}
        </span>
        <span style={{ fontSize: "6.1cqw", fontWeight: 600, color: textColor, fontFamily: "var(--font-sans)", letterSpacing: "0.02em" }}>
          {nicLabel}
        </span>
      </div>
    </div>
  );
}

function BottleLabelT4({ brand, flavor, strength, nicLabel, gradient, logoDataUrl, logoScale, bgImageDataUrl, bgImagePosition, bgImageScale, onBgPositionChange, colorTab, graphicsColor }: BottleProps) {
  const textColor = graphicsColor ?? "#ffffff";
  const isDarkGraphics = textColor === "#252525";
  const badgeBg = isDarkGraphics ? "#ffffff" : "#1a1a1a";
  const badgeText = isDarkGraphics ? "#252525" : "#ffffff";
  const badgeBorder = isDarkGraphics ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)";
  const dividerBg = isDarkGraphics ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.2)";

  return (
    <div style={{
      position: "absolute",
      inset: "50.96% 27.71% 5.23% 9.04%",
      overflow: "hidden",
      containerType: "inline-size",
    }}>
      {bgImageDataUrl ? (
        <ImageBackground
          bgImageDataUrl={bgImageDataUrl}
          bgImagePosition={bgImagePosition}
          bgImageScale={bgImageScale}
          onBgPositionChange={onBgPositionChange}
          draggable={colorTab === "image"}
        />
      ) : (
        <div style={abs({ inset: 0, background: gradient })} />
      )}

      {/* Floating Badge */}
      <div style={abs({
        top: "7.5%", left: "8%", right: "8%", height: "85%",
        background: badgeBg,
        borderRadius: "12px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.14), 0 1px 3px rgba(0,0,0,0.08)",
        border: `1px solid ${badgeBorder}`,
        boxSizing: "border-box",
        padding: "5%",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between",
        pointerEvents: "none",
        zIndex: 1,
      })}>
        {/* Brand/logo centered at top of badge */}
        <div style={{ width: "100%", height: "30%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {logoDataUrl ? (
            <img
              src={logoDataUrl}
              alt="logo"
              style={{
                maxWidth: "75%",
                maxHeight: "90%",
                objectFit: "contain",
                transform: logoScale && logoScale !== 1 ? `scale(${logoScale})` : undefined,
                transformOrigin: "center center",
              }}
            />
          ) : (
            <p style={{
              margin: 0,
              fontSize: "7.5cqw",
              fontWeight: 900,
              fontFamily: "'Albert Sans', var(--font-sans)",
              color: badgeText,
              textTransform: "uppercase",
              textAlign: "center",
              lineHeight: 0.9,
              wordBreak: "break-word",
            }}>
              {brand}
            </p>
          )}
        </div>

        {/* Badge elegant thin divider */}
        <div style={{ width: "85%", height: "1px", background: dividerBg, margin: "2% 0" }} />

        {/* Flavor centered */}
        <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{
            margin: 0,
            fontSize: "8.5cqw",
            fontWeight: 800,
            fontFamily: "'Albert Sans', var(--font-sans)",
            color: badgeText,
            textTransform: "uppercase",
            textAlign: "center",
            lineHeight: 1.05,
            wordBreak: "break-word",
          }}>
            {flavor}
          </p>
        </div>

        {/* Strength and Nicotine at bottom of badge */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: "1px"
        }}>
          <span style={{ fontSize: "5cqw", fontWeight: 700, color: badgeText, fontFamily: "var(--font-sans)", letterSpacing: "0.03em" }}>
            {strength}
          </span>
          <span style={{ fontSize: "4cqw", fontWeight: 500, color: badgeText, opacity: 0.8, fontFamily: "var(--font-sans)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {nicLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

function BottleLabelT5({ brand, flavor, strength, nicLabel, gradient, logoDataUrl, logoScale, bgImageDataUrl, bgImagePosition, bgImageScale, onBgPositionChange, colorTab, graphicsColor }: BottleProps) {
  const textColor = graphicsColor ?? "#ffffff";

  return (
    <div style={{
      position: "absolute",
      inset: "50.96% 27.71% 5.23% 9.04%",
      overflow: "hidden",
      containerType: "inline-size",
    }}>
      {bgImageDataUrl ? (
        <ImageBackground
          bgImageDataUrl={bgImageDataUrl}
          bgImagePosition={bgImagePosition}
          bgImageScale={bgImageScale}
          onBgPositionChange={onBgPositionChange}
          draggable={colorTab === "image"}
        />
      ) : (
        <div style={abs({ inset: 0, background: gradient })} />
      )}

      {/* Brand logo/text — top right horizontal */}
      <div style={abs({
        top: "6%",
        right: "8%",
        left: "32%",
        height: "12cqw",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        pointerEvents: "none",
        zIndex: 1,
      })}>
        {logoDataUrl ? (
          <img
            src={logoDataUrl}
            alt="logo"
            style={{
              maxWidth: "85%",
              maxHeight: "100%",
              objectFit: "contain",
              transform: logoScale && logoScale !== 1 ? `scale(${logoScale})` : undefined,
              transformOrigin: "top right",
            }}
          />
        ) : (
          <p style={{
            margin: 0,
            fontSize: "6cqw",
            fontWeight: 900,
            color: textColor,
            textTransform: "uppercase",
            textAlign: "right",
            fontFamily: "'Albert Sans', var(--font-sans)",
            letterSpacing: "0.05em",
          }}>
            {brand}
          </p>
        )}
      </div>

      {/* Flavor — bold vertical running along the left side */}
      <div style={abs({
        top: "5%",
        left: "5%",
        bottom: "5%",
        width: "28%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 1,
      })}>
        <div style={{
          transform: "rotate(-90deg)",
          whiteSpace: "nowrap",
        }}>
          <p style={{
            margin: 0,
            fontSize: "9.5cqw",
            fontWeight: 900,
            fontFamily: "'Albert Sans', var(--font-sans)",
            color: textColor,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            textAlign: "center",
          }}>
            {flavor}
          </p>
        </div>
      </div>

      {/* Strength & Nic — bottom right corner, stacked neatly */}
      <div style={abs({
        bottom: "8%",
        right: "8%",
        left: "35%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "2px",
        pointerEvents: "none",
        zIndex: 1,
      })}>
        <span style={{ fontSize: "5.5cqw", fontWeight: 700, color: textColor, fontFamily: "var(--font-sans)", letterSpacing: "0.02em" }}>
          {strength}
        </span>
        <span style={{ fontSize: "4.5cqw", fontWeight: 500, color: textColor, opacity: 0.85, fontFamily: "var(--font-sans)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {nicLabel}
        </span>
      </div>
    </div>
  );
}

/* ─── Bottle wrapper ──────────────────────────────────────────── */
function BottlePreview({ templateId, brand, flavor, strength, nicLabel, gradient, logoDataUrl, logoScale, bgImageDataUrl, bgImagePosition, bgImageScale, onBgPositionChange, colorTab, graphicsColor }: {
  templateId: string; brand: string; flavor: string;
  strength: string; nicLabel: string; gradient: string;
  logoDataUrl: string;
  logoScale?: number;
  bgImageDataUrl?: string;
  bgImagePosition?: { x: number; y: number; };
  bgImageScale?: number;
  onBgPositionChange?: (pos: { x: number; y: number; }) => void;
  colorTab?: string;
  graphicsColor?: string;
}) {
  const LabelComp = {
    "t1-flavor":   BottleLabelT1,
    "t2-centered": BottleLabelT2,
    "t3-split":    BottleLabelT3,
    "t4-badge":    BottleLabelT4,
    "t5-vertical": BottleLabelT5,
  }[templateId] ?? BottleLabelT2;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", width: "100%" }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "1083 / 2375" }}>
        <img
          src={bottleBg}
          alt="bottle"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
        />
        <LabelComp brand={brand} flavor={flavor} strength={strength} nicLabel={nicLabel} gradient={gradient} logoDataUrl={logoDataUrl} logoScale={logoScale} bgImageDataUrl={bgImageDataUrl} bgImagePosition={bgImagePosition} bgImageScale={bgImageScale} onBgPositionChange={onBgPositionChange} colorTab={colorTab} graphicsColor={graphicsColor} />
        
        {/* Bottle Label Glare Overlay (Matches label sticker inset perfectly!) */}
        <div style={abs({
          inset: "50.96% 27.71% 5.23% 9.04%",
          pointerEvents: "none",
          zIndex: 10,
          background: "linear-gradient(90deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 35%)",
        })} />
      </div>
      <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}>Bottle</span>
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────────────── */
export function PackagePreview({
  templateId, brandName, flavorName, strength, nicType, gradient, logoDataUrl, logoScale,
  bgImageDataUrl, bgImagePositionBox, bgImageScaleBox, bgImagePositionBottle, bgImageScaleBottle,
  onBgPositionBoxChange, onBgPositionBottleChange, colorTab, graphicsColor, healthWarningText
}: Props) {
  const brand    = brandName  || "YOUR BRAND";
  const flavor   = flavorName || "FLAVOR";
  const nicLabel = nicType === "salt" ? "Nic salt" : "Free Base";
  const BoxComp  = BOX_MAP[templateId] ?? BoxT2Centered;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "9fr 10fr",
      gap: "0",
      alignItems: "end",
      width: "100%",
      maxWidth: "100%",
      maxHeight: "100%",
      aspectRatio: "19 / 22",
      padding: "4px 0",
      boxSizing: "border-box",
    }}>
      <BottlePreview
        templateId={templateId}
        brand={brand} flavor={flavor}
        strength={strength} nicLabel={nicLabel}
        gradient={gradient}
        logoDataUrl={logoDataUrl}
        logoScale={logoScale}
        bgImageDataUrl={bgImageDataUrl}
        bgImagePosition={bgImagePositionBottle}
        bgImageScale={bgImageScaleBottle}
        onBgPositionChange={onBgPositionBottleChange}
        colorTab={colorTab}
        graphicsColor={graphicsColor}
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", width: "100%", marginLeft: "-14%" }}>
        <BoxComp
          brand={brand} flavor={flavor} strength={strength}
          nicLabel={nicLabel} gradient={gradient} logoDataUrl={logoDataUrl}
          logoScale={logoScale} bgImageDataUrl={bgImageDataUrl}
          bgImagePosition={bgImagePositionBox}
          bgImageScale={bgImageScaleBox}
          onBgPositionChange={onBgPositionBoxChange}
          colorTab={colorTab}
          graphicsColor={graphicsColor}
          healthWarningText={healthWarningText}
        />
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}>Box</span>
      </div>
    </div>
  );
}
