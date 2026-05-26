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
}

interface BoxProps {
  brand:      string;
  flavor:     string;
  strength:   string;
  nicLabel:   string;
  gradient:   string;
  logoDataUrl: string;
}

const WARNING_TEXT = "This product contains nicotine which is a highly addictive substance.";

const abs = (style: React.CSSProperties): React.CSSProperties => ({ position: "absolute", ...style });

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
export function BoxT1Flavor({ brand, flavor, strength, nicLabel, gradient, logoDataUrl }: BoxProps) {
  const nicText = `${nicLabel} • ${strength}`;
  return (
    <BoxRoot>
      {/* bg */}
      <div style={abs({ inset: 0, background: gradient })} />

      {/* logo */}
      {logoDataUrl && (
        <img src={logoDataUrl} alt="logo" style={abs({
          top: "2%", left: "7.5%", maxWidth: "45%", maxHeight: "8%", objectFit: "contain",
        })} />
      )}

      {/* flavor — large, top-left */}
      <div style={abs({ top: logoDataUrl ? "12%" : "5%", left: "7.5%", right: "7.5%" })}>
        <p style={{
          margin: 0,
          fontSize: "9cqw",
          fontWeight: 800,
          color: "#ffffff",
          textTransform: "uppercase",
          lineHeight: 1.1,
          wordBreak: "break-word",
          fontFamily: "var(--font-sans)",
        }}>
          {flavor}
        </p>
      </div>

      {/* nic and strength */}
      <div style={abs({ top: logoDataUrl ? "26%" : "20%", left: "7.5%", right: "7.5%" })}>
        <p style={{
          margin: 0,
          fontSize: "5cqw",
          fontWeight: 600,
          color: "rgba(255, 255, 255, 0.95)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontFamily: "var(--font-sans)",
        }}>
          {nicText}
        </p>
      </div>

      {/* separator line */}
      <div style={abs({
        top: logoDataUrl ? "32%" : "27%",
        left: 0,
        right: 0,
        height: "1.2cqw",
        background: "#ffffff",
      })} />

      {/* brand — bottom-left */}
      <div style={abs({
        top: "58%",
        left: "7.5%",
        right: "7.5%",
      })}>
        <p style={{
          margin: 0,
          fontSize: "6.5cqw",
          fontWeight: 900,
          color: "#ffffff",
          textTransform: "uppercase",
          fontFamily: "var(--font-sans)",
        }}>
          {brand}
        </p>
      </div>

      <WarningZone />
    </BoxRoot>
  );
}

/* ─── T2 — Centered (matches Figma Template 12, canvas 164×363) ── */
export function BoxT2Centered({ brand, flavor, strength, nicLabel, gradient, logoDataUrl }: BoxProps) {
  return (
    <BoxRoot>
      {/* background */}
      <div style={abs({ inset: 0, background: gradient })} />

      {/* brand — 15.43%–29.75% zone, Albert Sans Black */}
      <div style={abs({ top: "15.43%", left: 0, right: 0, bottom: "70.25%",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4%" })}>
        <p style={{
          margin: 0,
          fontSize: "18.3cqw",
          fontWeight: 900,
          fontFamily: "'Albert Sans', var(--font-sans)",
          color: "#252525",
          textTransform: "uppercase",
          textAlign: "center",
          lineHeight: 0.874,
          wordBreak: "break-word",
        }}>
          {brand}
        </p>
      </div>

      {/* flavor — at 40.5%, Albert Sans ExtraBold */}
      <div style={abs({ top: "40.5%", left: 0, right: 0 })}>
        <p style={{
          margin: 0,
          fontSize: "9.76cqw",
          fontWeight: 800,
          fontFamily: "'Albert Sans', var(--font-sans)",
          color: "#252525",
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
        top: "56.47%", left: "6.71%", right: "6.71%", height: "1px",
        background: "rgba(37,37,37,0.3)",
      })} />

      {/* footer — strength left, nic label right, at 57.6% */}
      <div style={abs({
        top: "57.6%", left: "6.71%", right: "6.71%",
        display: "flex", justifyContent: "space-between", paddingTop: "1.2%",
      })}>
        <span style={{ fontSize: "6.1cqw", fontWeight: 500, color: "#252525", fontFamily: "var(--font-sans)" }}>
          {strength}
        </span>
        <span style={{ fontSize: "6.1cqw", fontWeight: 500, color: "#252525", fontFamily: "var(--font-sans)" }}>
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
function BottleLabelT1({ brand, flavor, strength, nicLabel, gradient }: Omit<BoxProps, "logoDataUrl">) {
  const nicText = `${nicLabel} • ${strength}`;
  return (
    <div style={{
      position: "absolute",
      inset: "50.96% 27.71% 5.23% 9.04%",
      background: gradient,
      overflow: "hidden",
      containerType: "inline-size",
    }}>
      {/* flavor — top-left */}
      <div style={{
        position: "absolute",
        top: "5%",
        left: "7.5%",
        right: "7.5%",
      }}>
        <p style={{
          margin: 0,
          fontSize: "9cqw",
          fontWeight: 800,
          color: "#ffffff",
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
      }}>
        <p style={{
          margin: 0,
          fontSize: "5cqw",
          fontWeight: 600,
          color: "rgba(255, 255, 255, 0.95)",
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
        background: "#ffffff",
      }} />

      {/* brand — bottom-left */}
      <div style={{
        position: "absolute",
        bottom: "8%",
        left: "7.5%",
        right: "7.5%",
      }}>
        <p style={{
          margin: 0,
          fontSize: "6.5cqw",
          fontWeight: 900,
          color: "#ffffff",
          textTransform: "uppercase",
          fontFamily: "var(--font-sans)",
        }}>
          {brand}
        </p>
      </div>
    </div>
  );
}

function BottleLabelT2({ brand, flavor, strength, nicLabel, gradient }: Omit<BoxProps, "logoDataUrl">) {
  return (
    <div style={{
      position: "absolute",
      inset: "50.96% 27.71% 5.23% 9.04%",
      background: gradient,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      overflow: "hidden", padding: "6% 5%",
    }}>
      {/* brand — larger, top */}
      <p style={{
        margin: "0 0 auto 0", fontSize: "14px", fontWeight: 900, color: "#fff",
        textTransform: "uppercase", textAlign: "center", lineHeight: 0.95,
        wordBreak: "break-word", fontFamily: "var(--font-sans)", width: "100%",
      }}>
        {brand}
      </p>

      {/* separator */}
      <div style={{ width: "80%", height: "1px", background: "rgba(255,255,255,0.4)", flexShrink: 0, margin: "8% 0" }} />

      {/* flavor */}
      <p style={{
        margin: "0 0 auto 0", fontSize: "10px", fontWeight: 800, color: "#fff",
        textTransform: "uppercase", textAlign: "center", lineHeight: 1.1,
        wordBreak: "break-word", fontFamily: "var(--font-sans)", width: "100%",
      }}>
        {flavor}
      </p>

      {/* footer */}
      <div style={{
        width: "100%", display: "flex", justifyContent: "space-between",
        marginTop: "auto",
      }}>
        <span style={{ fontSize: "7px", fontWeight: 500, color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-sans)" }}>
          {strength}
        </span>
        <span style={{ fontSize: "7px", fontWeight: 500, color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-sans)" }}>
          {nicLabel}
        </span>
      </div>
    </div>
  );
}

/* ─── Bottle wrapper ──────────────────────────────────────────── */
function BottlePreview({ templateId, brand, flavor, strength, nicLabel, gradient }: {
  templateId: string; brand: string; flavor: string;
  strength: string; nicLabel: string; gradient: string;
}) {
  const LabelComp = templateId === "t1-flavor" ? BottleLabelT1 : BottleLabelT2;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", width: "100%" }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "1083 / 2375" }}>
        <img
          src={bottleBg}
          alt="bottle"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <LabelComp brand={brand} flavor={flavor} strength={strength} nicLabel={nicLabel} gradient={gradient} />
      </div>
      <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}>Bottle</span>
    </div>
  );
}

/* ─── Main export ─────────────────────────────────────────────── */
export function PackagePreview({ templateId, brandName, flavorName, strength, nicType, gradient, logoDataUrl }: Props) {
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
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", width: "100%", marginLeft: "-14%" }}>
        <BoxComp
          brand={brand} flavor={flavor} strength={strength}
          nicLabel={nicLabel} gradient={gradient} logoDataUrl={logoDataUrl}
        />
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}>Box</span>
      </div>
    </div>
  );
}
