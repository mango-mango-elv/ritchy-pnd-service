import React from "react";
import bottleBg from "../../../assets/bottle-bg.png";

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
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) translate(${bgImagePosition.x}px, ${bgImagePosition.y}px) scale(${bgImageScale})`,
          transformOrigin: "center center",
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
    </div>
  );
}

/* ─── Shared warning zone — exactly 32% of box height ────────── */
function WarningZone() {
  return (
    <div style={abs({
      top: "68%", left: 0, right: 0, bottom: 0,
      boxSizing: "border-box",
      border: "5px solid #000",
      background: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "3px 8px",
      overflow: "hidden",
      pointerEvents: "none",
    })}>
      <p style={{
        margin: 0,
        fontSize: "6.7cqw",
        fontWeight: 700,
        color: "#111",
        textAlign: "center",
        lineHeight: 1.2,
        fontFamily: "var(--font-sans)",
      }}>
        {WARNING_TEXT}
      </p>
    </div>
  );
}


/* ─── T1 — Flavor First ───────────────────────────────────────── */
export function BoxT1Flavor({ brand, flavor, strength, nicLabel, gradient, logoDataUrl, logoScale, bgImageDataUrl, bgImagePosition, bgImageScale, onBgPositionChange, colorTab, graphicsColor }: BoxProps) {
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
      <div style={abs({ top: "5%", left: "7.5%", right: "7.5%", pointerEvents: "none" })}>
        <p style={{
          margin: 0,
          fontSize: "9cqw",
          fontWeight: 800,
          color: textColor,
          textTransform: "uppercase",
          lineHeight: 1.1,
          wordBreak: "break-word",
          fontFamily: "var(--font-sans)",
        }}>
          {flavor}
        </p>
      </div>

      {/* nic and strength */}
      <div style={abs({ top: "20%", left: "7.5%", right: "7.5%", pointerEvents: "none" })}>
        <p style={{
          margin: 0,
          fontSize: "5cqw",
          fontWeight: 600,
          color: textColor,
          opacity: 0.95,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontFamily: "var(--font-sans)",
        }}>
          {nicText}
        </p>
      </div>

      {/* separator line */}
      <div style={abs({
        top: "27%",
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
            fontFamily: "var(--font-sans)",
          }}>
            {brand}
          </p>
        )}
      </div>

      <WarningZone />
    </BoxRoot>
  );
}

/* ─── T2 — Centered (matches Figma Template 12, canvas 164×363) ── */
export function BoxT2Centered({ brand, flavor, strength, nicLabel, gradient, logoDataUrl, logoScale, bgImageDataUrl, bgImagePosition, bgImageScale, onBgPositionChange, colorTab, graphicsColor }: BoxProps) {
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
            fontFamily: "'Albert Sans', var(--font-sans)",
            color: textColor,
            textTransform: "uppercase",
            textAlign: "center",
            lineHeight: 0.874,
            wordBreak: "break-word",
          }}>
            {brand}
          </p>
        </div>
      )}

      {/* flavor — at 40.5%, Albert Sans ExtraBold */}
      <div style={abs({ top: "40.5%", left: 0, right: 0, pointerEvents: "none" })}>
        <p style={{
          margin: 0,
          fontSize: "9.76cqw",
          fontWeight: 800,
          fontFamily: "'Albert Sans', var(--font-sans)",
          color: textColor,
          textTransform: "uppercase",
          textAlign: "center",
          lineHeight: 1.06,
          wordBreak: "break-word",
        }}>
          {flavor}
        </p>
      </div>

      {/* divider — at 56.47% */}
      <div style={abs({
        top: "56.47%", left: "6.71%", right: "6.71%", height: "1.2cqw",
        background: textColor,
        pointerEvents: "none",
      })} />

      {/* footer — strength left, nic label right, at 57.6% */}
      <div style={abs({
        top: "57.6%", left: "6.71%", right: "6.71%",
        display: "flex", justifyContent: "space-between", paddingTop: "1.2%",
        pointerEvents: "none",
      })}>
        <span style={{ fontSize: "6.1cqw", fontWeight: 500, color: textColor, fontFamily: "var(--font-sans)" }}>
          {strength}
        </span>
        <span style={{ fontSize: "6.1cqw", fontWeight: 500, color: textColor, fontFamily: "var(--font-sans)" }}>
          {nicLabel}
        </span>
      </div>

      <WarningZone />
    </BoxRoot>
  );
}

/* ─── BOX routing ─────────────────────────────────────────────── */
const BOX_MAP: Record<string, React.FC<BoxProps>> = {
  "t1-flavor":   BoxT1Flavor,
  "t2-centered": BoxT2Centered,
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
        top: "5%",
        left: "7.5%",
        right: "7.5%",
        pointerEvents: "none",
      }}>
        <p style={{
          margin: 0,
          fontSize: "9cqw",
          fontWeight: 800,
          color: textColor,
          textTransform: "uppercase",
          lineHeight: 1.1,
          wordBreak: "break-word",
          fontFamily: "var(--font-sans)",
        }}>
          {flavor}
        </p>
      </div>

      {/* nic and strength */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "7.5%",
        right: "7.5%",
        pointerEvents: "none",
      }}>
        <p style={{
          margin: 0,
          fontSize: "5cqw",
          fontWeight: 600,
          color: textColor,
          opacity: 0.95,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontFamily: "var(--font-sans)",
        }}>
          {nicText}
        </p>
      </div>

      {/* separator line */}
      <div style={{
        position: "absolute",
        top: "27%",
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
            fontFamily: "var(--font-sans)",
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
        top: "15.43%",
        left: 0,
        right: 0,
        bottom: "70.25%",
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
            fontFamily: "'Albert Sans', var(--font-sans)",
            color: textColor,
            textTransform: "uppercase",
            textAlign: "center",
            lineHeight: 0.874,
            wordBreak: "break-word",
          }}>
            {brand}
          </p>
        )}
      </div>

      {/* flavor — centered in the lower zone */}
      <div style={{
        position: "absolute",
        top: "40.5%",
        left: 0,
        right: 0,
        pointerEvents: "none",
      }}>
        <p style={{
          margin: 0,
          fontSize: "9.76cqw",
          fontWeight: 800,
          fontFamily: "'Albert Sans', var(--font-sans)",
          color: textColor,
          textTransform: "uppercase",
          textAlign: "center",
          lineHeight: 1.06,
          wordBreak: "break-word",
        }}>
          {flavor}
        </p>
      </div>

      {/* separator line — below flavor */}
      <div style={{
        position: "absolute",
        top: "56.47%",
        left: "6.71%",
        right: "6.71%",
        height: "1.2cqw",
        background: textColor,
        pointerEvents: "none",
      }} />

      {/* footer — strength left, nic salt right */}
      <div style={{
        position: "absolute",
        top: "57.6%",
        left: "6.71%",
        right: "6.71%",
        display: "flex",
        justifyContent: "space-between",
        paddingTop: "1.2%",
        pointerEvents: "none",
      }}>
        <span style={{ fontSize: "6.1cqw", fontWeight: 500, color: textColor, fontFamily: "var(--font-sans)" }}>
          {strength}
        </span>
        <span style={{ fontSize: "6.1cqw", fontWeight: 500, color: textColor, fontFamily: "var(--font-sans)" }}>
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
  const LabelComp = templateId === "t1-flavor" ? BottleLabelT1 : BottleLabelT2;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", width: "100%" }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "1083 / 2375" }}>
        <img
          src={bottleBg}
          alt="bottle"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block", pointerEvents: "none" }}
        />
        <LabelComp brand={brand} flavor={flavor} strength={strength} nicLabel={nicLabel} gradient={gradient} logoDataUrl={logoDataUrl} logoScale={logoScale} bgImageDataUrl={bgImageDataUrl} bgImagePosition={bgImagePosition} bgImageScale={bgImageScale} onBgPositionChange={onBgPositionChange} colorTab={colorTab} graphicsColor={graphicsColor} />
      </div>
      <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}>Bottle</span>
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────────────── */
export function PackagePreview({
  templateId, brandName, flavorName, strength, nicType, gradient, logoDataUrl, logoScale,
  bgImageDataUrl, bgImagePositionBox, bgImageScaleBox, bgImagePositionBottle, bgImageScaleBottle,
  onBgPositionBoxChange, onBgPositionBottleChange, colorTab, graphicsColor
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
        />
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}>Box</span>
      </div>
    </div>
  );
}
