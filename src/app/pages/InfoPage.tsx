import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useStageNav } from "../components/AppShell";

export function InfoPage() {
  const { goNext } = useStageNav();

  const [form, setForm] = useState({
    brandName: "",
    contactPerson: "",
    projectName: "",
    targetMarket: "eu",
    quantity: "5000-20000",
    brief: "",
  });

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = () => {
    sessionStorage.setItem("ritchy-project-info", JSON.stringify(form));
    goNext();
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-8)", background: "var(--color-bg)" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", display: "grid", gap: "var(--space-5)" }}>

        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
            Info
          </div>
          <h1 style={{ margin: "8px 0 0", fontSize: "30px", color: "var(--color-text-primary)" }}>Brand & project info</h1>
          <p style={{ margin: "10px 0 0", color: "var(--color-text-secondary)", fontSize: "14px" }}>
            Tell us a bit about your brand and this project before we start designing packaging.
          </p>
        </div>

        <section style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-6)" }}>
          <h2 style={{ margin: "0 0 var(--space-5)", fontSize: "16px", color: "var(--color-text-primary)" }}>About your brand</h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "var(--color-text-secondary)" }}>Brand name</label>
              <input
                className="ds-input"
                value={form.brandName}
                onChange={set("brandName")}
                placeholder="e.g. Arctic Vapor"
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "var(--color-text-secondary)" }}>Contact person</label>
              <input
                className="ds-input"
                value={form.contactPerson}
                onChange={set("contactPerson")}
                placeholder="Full name"
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "var(--color-text-secondary)" }}>Project / line name</label>
              <input
                className="ds-input"
                value={form.projectName}
                onChange={set("projectName")}
                placeholder="e.g. Summer 2025 Collection"
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "var(--color-text-secondary)" }}>Target market</label>
              <select
                className="ds-input"
                value={form.targetMarket}
                onChange={set("targetMarket")}
                style={{ width: "100%", appearance: "auto" }}
              >
                <option value="eu">European Union</option>
                <option value="uk">United Kingdom</option>
                <option value="us">United States</option>
                <option value="other">Other / Multiple</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "var(--color-text-secondary)" }}>Estimated quantity</label>
              <select
                className="ds-input"
                value={form.quantity}
                onChange={set("quantity")}
                style={{ width: "100%", appearance: "auto" }}
              >
                <option value="1000-5000">1 000 – 5 000 pcs</option>
                <option value="5000-20000">5 000 – 20 000 pcs</option>
                <option value="20000+">20 000+ pcs</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: "var(--space-4)" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "12px", color: "var(--color-text-secondary)" }}>Brief / notes (optional)</label>
            <textarea
              className="ds-input"
              value={form.brief}
              onChange={set("brief")}
              rows={3}
              placeholder="Any special requirements, references, or notes for the design team…"
              style={{ width: "100%", resize: "vertical" }}
            />
          </div>
        </section>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleSubmit}
            style={{
              display: "flex", alignItems: "center", gap: "var(--space-2)",
              fontSize: "13px", fontFamily: "var(--font-sans)", fontWeight: 600,
              padding: "10px 24px",
              background: "var(--color-text-primary)", color: "#fff",
              border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer",
            }}
          >
            Start designing <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Shared placeholder shell (kept for backwards compatibility) ── */
export function StagePlaceholder({
  stage, description, onNext, nextLabel, onBack, backLabel,
}: {
  stage: string;
  description: string;
  onNext?: () => void;
  nextLabel?: string;
  onBack?: () => void;
  backLabel?: string;
}) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: "var(--space-5)",
      padding: "var(--space-8)",
    }}>
      <div style={{
        padding: "4px 14px",
        border: "1px dashed var(--color-border)",
        borderRadius: "var(--radius-full)",
        fontSize: "11px", fontFamily: "var(--font-sans)",
        color: "var(--color-text-muted)", letterSpacing: "0.06em", textTransform: "uppercase",
      }}>
        {stage}
      </div>

      <div style={{ textAlign: "center", maxWidth: 420 }}>
        <div style={{
          fontSize: "22px", fontFamily: "var(--font-sans)", fontWeight: 600,
          color: "var(--color-text-primary)", marginBottom: "var(--space-3)", lineHeight: 1.2,
        }}>
          {stage}
        </div>
        <div style={{
          fontSize: "14px", fontFamily: "var(--font-sans)",
          color: "var(--color-text-secondary)", lineHeight: 1.6,
        }}>
          {description}
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-3)" }}>
        {onBack && (
          <button
            onClick={onBack}
            className="ds-btn ds-btn-secondary"
            style={{ fontSize: "13px", padding: "10px 24px" }}
          >
            {backLabel ?? "← Back"}
          </button>
        )}
        {onNext && (
          <button
            onClick={onNext}
            style={{
              display: "flex", alignItems: "center", gap: "var(--space-2)",
              fontSize: "13px", fontFamily: "var(--font-sans)", fontWeight: 600,
              padding: "10px 24px",
              background: "var(--color-text-primary)", color: "#fff",
              border: "none", borderRadius: "var(--radius-sm)", cursor: "pointer",
            }}
          >
            {nextLabel ?? "Continue"}
          </button>
        )}
      </div>
    </div>
  );
}
