import React, { useState } from "react";
import { useNavigate } from "react-router";
import { ShieldCheck } from "lucide-react";

const WARNING_DEFAULTS: Record<string, string> = {
  eu: "This product contains nicotine which is a highly addictive substance. Not for sale to persons under the age of 18.",
  uk: "NICOTINE — This product contains nicotine which is a highly addictive substance.",
  us: "WARNING: This product contains nicotine. Nicotine is an addictive chemical.",
};

const REG_BADGES = ["TPD Article 20", "REACH", "CLP", "PCN", "Child-proof"];

export function CompliancePage() {
  const navigate = useNavigate();
  const [market, setMarket]   = useState("eu");
  const [warning, setWarning] = useState(WARNING_DEFAULTS.eu);
  const [confirmed, setConfirmed] = useState(false);

  const handleMarketChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const m = e.target.value;
    setMarket(m);
    setWarning(WARNING_DEFAULTS[m] ?? WARNING_DEFAULTS.eu);
  };

  const handleContinue = () => {
    if (!confirmed) return;
    sessionStorage.setItem("ritchy-v2-compliance", JSON.stringify({ market, warning }));
    navigate("/confirm");
  };

  return (
    <div className="v2-page-container">
      <div style={{ maxWidth: "640px", margin: "0 auto", display: "grid", gap: "var(--space-4)" }}>

        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
            Step 4 of 5
          </div>
          <h1 style={{ margin: "6px 0 0", fontSize: "26px", color: "var(--color-text-primary)" }}>Compliance Preview</h1>
          <p style={{ margin: "6px 0 0", color: "var(--color-text-secondary)", fontSize: "14px" }}>
            We handle regulatory notifications. Review your target market and label warning text.
          </p>
        </div>

        {/* Regulation badges */}
        <section style={{
          background: "rgba(37,99,235,0.05)",
          border: "1px solid rgba(37,99,235,0.15)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-4) var(--space-5)",
          display: "flex", flexDirection: "column", gap: "var(--space-3)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldCheck size={16} color="#2563eb" />
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#2563eb" }}>
              Article 20 compliant, every EU market
            </span>
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {REG_BADGES.map(b => (
              <span key={b} style={{
                fontSize: "11px", fontWeight: 600,
                padding: "3px 9px",
                background: "rgba(255,255,255,0.6)",
                color: "#2563eb",
                borderRadius: "var(--radius-full)",
                border: "1px solid rgba(37,99,235,0.18)",
              }}>
                {b}
              </span>
            ))}
          </div>
          <p style={{ margin: 0, fontSize: "12px", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
            All products are manufactured to TPD Article 20 standards. We handle regulatory notifications for the markets you select.
          </p>
        </section>

        <section style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(0,0,0,0.07)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-5)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.90)",
          display: "grid", gap: "var(--space-4)",
        }}>
          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "var(--color-text-secondary)" }}>
              Target Market
            </label>
            <select
              className="ds-input"
              value={market}
              onChange={handleMarketChange}
              style={{ appearance: "auto" }}
            >
              <option value="eu">European Union</option>
              <option value="uk">United Kingdom</option>
              <option value="us">United States</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "var(--color-text-secondary)" }}>
              Health Warning Text
            </label>
            <textarea
              className="ds-input"
              value={warning}
              onChange={e => setWarning(e.target.value)}
              rows={4}
              style={{ resize: "vertical" }}
            />
            <p style={{ margin: "6px 0 0", fontSize: "11px", color: "var(--color-text-muted)" }}>
              This warning will be printed on every package, alongside nicotine strength and child-safety pictograms.
            </p>
          </div>

          <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={confirmed}
              onChange={e => setConfirmed(e.target.checked)}
              style={{ marginTop: "2px", flexShrink: 0 }}
            />
            <span style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              I confirm that the label and warning text have been reviewed and authorize Ritchy P&amp;D to submit regulatory notifications on my behalf.
            </span>
          </label>
        </section>

        <div className="v2-nav-footer">
          <button onClick={() => navigate("/signup")} className="v2-footer-btn v2-footer-btn-secondary">← Back</button>
          <button
            onClick={handleContinue}
            className="v2-footer-btn v2-footer-btn-primary"
            disabled={!confirmed}
            style={{ opacity: confirmed ? 1 : 0.4, cursor: confirmed ? "pointer" : "default" }}
          >
            Continue to Review →
          </button>
        </div>
      </div>
    </div>
  );
}
