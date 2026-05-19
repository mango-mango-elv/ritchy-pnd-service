import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Clock3, ArrowRight, Layers3 } from "lucide-react";
import { listDrafts } from "../lib/drafts";
import { PACKAGE_COLORS } from "../components/packageTypes";
import type { PackageColor } from "../components/packageTypes";
import type { PackagingDraft } from "../lib/drafts";

const CARD_SHADOW_DEFAULT = "0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.90)";
const CARD_SHADOW_HOVER   = "0 4px 12px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.90)";

function DraftCard({ draft, onOpen }: { draft: PackagingDraft; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        minHeight: "220px",
        border: "1px solid rgba(0,0,0,0.07)",
        borderRadius: "var(--radius-lg)",
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        boxShadow: hovered ? CARD_SHADOW_HOVER : CARD_SHADOW_DEFAULT,
        padding: "var(--space-6)",
        display: "flex",
        flexDirection: "column",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-6)" }}>
        <div style={{
          width: "38px", height: "38px",
          borderRadius: "var(--radius-sm)",
          border: "1px solid rgba(0,0,0,0.07)",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.04)",
          color: "#666666",
        }}>
          <Layers3 size={16} />
        </div>
        <div style={{
          fontSize: "10px", fontWeight: 600,
          letterSpacing: "0.07em", textTransform: "uppercase",
          color: "#1A7A5E",
          background: "rgba(26,122,94,0.10)",
          borderRadius: "var(--radius-sm)",
          padding: "4px 8px",
        }}>
          Draft
        </div>
      </div>

      <div style={{ fontSize: "17px", fontWeight: 600, color: "#111111" }}>{draft.name}</div>

      {draft.flavors.length > 0 && (
        <div
          style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "4px" }}
          title={draft.flavors.map(f => f.name || f.letter).join(", ")}
        >
          {draft.flavors.slice(0, 6).map((f, i) => {
            const hex = PACKAGE_COLORS.find(c => c.key === (f.packageColor as PackageColor))?.hex ?? "#EBEBED";
            return (
              <div key={i} style={{
                width: "14px", height: "14px", borderRadius: "50%",
                background: hex, border: "1px solid rgba(0,0,0,0.12)", flexShrink: 0,
              }} />
            );
          })}
          {draft.flavors.length > 6 && (
            <span style={{ fontSize: "11px", color: "#999999", marginLeft: "2px" }}>
              +{draft.flavors.length - 6}
            </span>
          )}
        </div>
      )}

      <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#999999" }}>
        <Clock3 size={12} /> updated {new Date(draft.updatedAt).toLocaleString()}
      </div>

      <div style={{ flex: 1 }} />

      <button
        onClick={onOpen}
        className="ds-btn ds-btn-secondary"
        style={{ width: "100%", justifyContent: "center", marginTop: "var(--space-5)" }}
      >
        Continue design <ArrowRight size={12} />
      </button>
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const drafts = listDrafts();

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-8)" }}>
      <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
        <div style={{ marginBottom: "var(--space-8)" }}>
          <div style={{
            fontSize: "11px", color: "#999999",
            letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: "var(--space-2)",
          }}>
            Dashboard
          </div>
          <h1 style={{ margin: 0, fontSize: "34px", lineHeight: 1.05, letterSpacing: "-0.02em", color: "#111111" }}>
            Your private label projects
          </h1>
          <p style={{ margin: "10px 0 0", color: "#666666", fontSize: "14px" }}>
            Manage drafts and launch new packaging lines in the same workflow as Design.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
          gap: "var(--space-5)",
        }}>
          <button
            onClick={() => navigate("/info")}
            style={{
              minHeight: "220px",
              border: "1.5px dashed rgba(0,0,0,0.12)",
              borderRadius: "var(--radius-lg)",
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.80)",
              padding: "var(--space-6)",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              cursor: "pointer",
              transition: "box-shadow 0.2s ease",
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.90)")}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.80)")}
          >
            <div style={{
              width: "42px", height: "42px",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(0,0,0,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#111111", background: "rgba(0,0,0,0.04)",
            }}>
              <Plus size={18} />
            </div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: 600, color: "#111111" }}>Create new project</div>
              <div style={{ marginTop: "6px", fontSize: "13px", color: "#999999" }}>
                Start a new line in configurator
              </div>
            </div>
          </button>

          {drafts.map((draft) => (
            <DraftCard key={draft.id} draft={draft} onOpen={() => navigate("/design", { state: { draftId: draft.id } })} />
          ))}
        </div>
      </div>
    </div>
  );
}
