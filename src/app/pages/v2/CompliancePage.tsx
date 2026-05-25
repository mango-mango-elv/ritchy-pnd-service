import React, { useState } from "react";
import { useNavigate } from "react-router";

const WARNING_DEFAULTS: Record<string, string> = {
  eu: "This product contains nicotine which is a highly addictive substance. Not for sale to persons under the age of 18.",
  uk: "NICOTINE — This product contains nicotine which is a highly addictive substance.",
  us: "WARNING: This product contains nicotine. Nicotine is an addictive chemical.",
};

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
    navigate("/v2/confirm");
  };

  return (
    <div style={{ overflowY: "auto", padding: "var(--space-8) var(--space-5)" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", display: "grid", gap: "var(--space-5)" }}>

        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
            Step 4 of 5
          </div>
          <h1 style={{ margin: "8px 0 0", fontSize: "26px", color: "var(--color-text-primary)" }}>Compliance</h1>
          <p style={{ margin: "8px 0 0", color: "var(--color-text-secondary)", fontSize: "14px" }}>
            Confirm regulatory warning text for your target market before submission.
          </p>
        </div>

        <section style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(0,0,0,0.07)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-6)",
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
              Warning Text
            </label>
            <textarea
              className="ds-input"
              value={warning}
              onChange={e => setWarning(e.target.value)}
              rows={4}
              style={{ resize: "vertical" }}
            />
          </div>

          <label style={{ display: "flex", gap: "10px", alignItems: "flex-start", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={confirmed}
              onChange={e => setConfirmed(e.target.checked)}
              style={{ marginTop: "2px", flexShrink: 0 }}
            />
            <span style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
              I confirm that the label and warning text have been reviewed and are compliant with the regulations of the target market.
            </span>
          </label>
        </section>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={() => navigate("/v2/signup")} className="ds-btn ds-btn-secondary">← Back</button>
          <button
            onClick={handleContinue}
            className="ds-btn ds-btn-primary"
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
