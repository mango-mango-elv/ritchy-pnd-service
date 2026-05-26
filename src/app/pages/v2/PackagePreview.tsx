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

/* ─── Shared warning zone ─────────────────────────────────────── */
function WarningZone() {
  return (
    <>
      <div style={abs({ inset: "64.19% 0 0 0", background: "#fff" })} />
      <div style={abs({
        inset: "69.15% 10.98% 4.68% 10.37%",
        display: "flex", alignItems: "center", justifyContent: "center",
      })}>
        <p style={{
          margin: 0, fontSize: "7px", color: "#111", textAlign: "center",
          lineHeight: 1.35, fontFamily: "var(--font-sans)", fontWeight: 600,
        }}>
          {WARNING_TEXT}
        </p>
      </div>
    </>
  );
}

/* ─── Box root wrapper ────────────────────────────────────────── */
function BoxRoot({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: "relative", width: "100%", aspectRatio: "200 / 290",
      overflow: "hidden", borderRadius: "4px",
    }}>
      {children}
    </div>
  );
}

/* ─── T1 — Flavor First ───────────────────────────────────────── */
export function BoxT1Flavor({ brand, flavor, strength, nicLabel, gradient, logoDataUrl }: BoxProps) {
  return (
    <BoxRoot>
      {/* bg */}
      <div style={abs({ inset: 0, background: gradient })} />

      {/* logo */}
      {logoDataUrl && (
        <img src={logoDataUrl} alt="logo" style={abs({
          top: "3%", left: "7.3%", maxWidth: "40%", maxHeight: "8%", objectFit: "contain",
        })} />
      )}

      {/* flavor — large, top-left */}
      <div style={abs({ top: "4.1%", left: "7.3%", right: "7.3%" })}>
        <p style={{
          margin: 0, fontSize: "14px", fontWeight: 800, color: "#fff",
          textTransform: "uppercase", lineHeight: 1.1, wordBreak: "break-word",
          fontFamily: "var(--font-sans)",
        }}>
          {flavor}
        </p>
      </div>

      {/* nic · strength */}
      <p style={abs({
        top: "22.3%", left: "7.3%", margin: 0,
        fontSize: "8px", fontWeight: 500, color: "rgba(255,255,255,0.85)",
        textTransform: "uppercase", letterSpacing: "0.08em",
        fontFamily: "var(--font-sans)",
      })}>
        {nicLabel} · {strength}
      </p>

      {/* separator */}
      <div style={abs({
        top: "27.27%", left: 0, right: 0, height: "1px",
        background: "rgba(255,255,255,0.4)",
      })} />

      {/* brand — small, lower-left */}
      <div style={abs({ top: "57.58%", left: "6.71%", right: "47.56%", bottom: "38.02%" })}>
        <p style={{
          margin: 0, fontSize: "10px", fontWeight: 900, color: "#fff",
          textTransform: "uppercase", lineHeight: 1.1, wordBreak: "break-word",
          fontFamily: "var(--font-sans)",
        }}>
          {brand}
        </p>
      </div>

      <WarningZone />
    </BoxRoot>
  );
}

/* ─── T2 — Centered ──────────────────────────────────────────── */
export function BoxT2Centered({ brand, flavor, strength, nicLabel, gradient, logoDataUrl }: BoxProps) {
  return (
    <BoxRoot>
      {/* bg */}
      <div style={abs({ inset: 0, background: gradient })} />

      {/* logo */}
      {logoDataUrl && (
        <img src={logoDataUrl} alt="logo" style={abs({
          top: "8%", left: "50%", transform: "translateX(-50%)",
          maxWidth: "55%", maxHeight: "8%", objectFit: "contain",
        })} />
      )}

      {/* brand — large, centered top zone */}
      <div style={abs({ inset: "15.43% 0 70.25% 0", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6%" })}>
        <p style={{
          margin: 0, fontSize: "24px", fontWeight: 900, color: "#fff",
          textTransform: "uppercase", textAlign: "center", lineHeight: 0.9,
          wordBreak: "break-word", fontFamily: "var(--font-sans)",
        }}>
          {brand}
        </p>
      </div>

      {/* separator */}
      <div style={abs({
        top: "56.47%", left: "6.71%", right: "6.71%", height: "1px",
        background: "rgba(255,255,255,0.4)",
      })} />

      {/* flavor — centered */}
      <div style={abs({ top: "58%", left: 0, right: 0, display: "flex", justifyContent: "center", padding: "0 6%" })}>
        <p style={{
          margin: 0, fontSize: "13px", fontWeight: 800, color: "#fff",
          textTransform: "uppercase", textAlign: "center", lineHeight: 1.1,
          wordBreak: "break-word", fontFamily: "var(--font-sans)",
        }}>
          {flavor}
        </p>
      </div>

      {/* footer: 20mg left · nic salt right */}
      <div style={abs({
        top: "57.6%", left: "6.7%", right: "6.7%",
        display: "flex", justifyContent: "space-between", alignItems: "flex-end",
        paddingTop: "28px",
      })}>
        <span style={{ fontSize: "9px", fontWeight: 500, color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-sans)" }}>
          {strength}
        </span>
        <span style={{ fontSize: "9px", fontWeight: 500, color: "rgba(255,255,255,0.85)", fontFamily: "var(--font-sans)" }}>
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
  return (
    <div style={{
      position: "absolute",
      inset: "50.96% 27.71% 5.23% 9.04%",
      background: gradient,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      overflow: "hidden", padding: "6% 5%",
    }}>
      {/* flavor — top, larger */}
      <p style={{
        margin: "0 0 4% 0", fontSize: "11px", fontWeight: 800, color: "#fff",
        textTransform: "uppercase", textAlign: "center", lineHeight: 1.1,
        wordBreak: "break-word", fontFamily: "var(--font-sans)", width: "100%",
      }}>
        {flavor}
      </p>

      {/* separator */}
      <div style={{ width: "80%", height: "1px", background: "rgba(255,255,255,0.4)", flexShrink: 0, marginBottom: "4%" }} />

      {/* brand — small */}
      <p style={{
        margin: "0 0 auto 0", fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.9)",
        textTransform: "uppercase", textAlign: "center", lineHeight: 1.1,
        fontFamily: "var(--font-sans)", width: "100%",
      }}>
        {brand}
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
      gridTemplateColumns: "110fr 200fr",
      gap: "clamp(8px, 3%, 16px)",
      alignItems: "end",
      width: "100%",
      padding: "4px 0",
    }}>
      <BottlePreview
        templateId={templateId}
        brand={brand} flavor={flavor}
        strength={strength} nicLabel={nicLabel}
        gradient={gradient}
      />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", width: "100%" }}>
        <BoxComp
          brand={brand} flavor={flavor} strength={strength}
          nicLabel={nicLabel} gradient={gradient} logoDataUrl={logoDataUrl}
        />
        <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}>Box</span>
      </div>
    </div>
  );
}
