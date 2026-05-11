import React from "react";
import { ArrowRight } from "lucide-react";
import { useStageNav } from "../components/AppShell";

export function InfoPage() {
  const { goNext } = useStageNav();
  return (
    <StagePlaceholder
      stage="Info"
      description="Onboarding — collect brand info, company details, and project requirements before starting the design."
      onNext={goNext}
      nextLabel="Start designing →"
    />
  );
}

/* ── Shared placeholder shell used by all non-Design stages ── */
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
      {/* Stage badge */}
      <div style={{
        padding: "4px 14px",
        border: "1px dashed var(--color-border)",
        borderRadius: "var(--radius-full)",
        fontSize: "11px", fontFamily: "var(--font-sans)",
        color: "var(--color-text-muted)", letterSpacing: "0.06em", textTransform: "uppercase",
      }}>
        {stage}
      </div>

      {/* Heading */}
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        <div style={{
          fontSize: "22px", fontFamily: "var(--font-sans)", fontWeight: 600,
          color: "var(--color-text-primary)", marginBottom: "var(--space-3)", lineHeight: 1.2,
        }}>
          {stage} — coming soon
        </div>
        <div style={{
          fontSize: "14px", fontFamily: "var(--font-sans)",
          color: "var(--color-text-secondary)", lineHeight: 1.6,
        }}>
          {description}
        </div>
      </div>

      {/* Placeholder content block */}
      <div style={{
        width: 480, height: 240,
        border: "1.5px dashed var(--color-border)",
        borderRadius: "var(--radius-lg)",
        background: "var(--color-surface-raised)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontSize: "13px", fontFamily: "var(--font-sans)", color: "var(--color-text-muted)" }}>
          This stage is not yet implemented
        </span>
      </div>

      {/* Navigation buttons */}
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
            {nextLabel ?? "Continue"} <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
