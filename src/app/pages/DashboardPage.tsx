import React from "react";
import { useNavigate } from "react-router";
import { Plus, Clock3, ArrowRight, Layers3 } from "lucide-react";
import { listDrafts } from "../lib/drafts";
import { PACKAGE_COLORS } from "../components/packageTypes";
import type { PackageColor } from "../components/packageTypes";

export function DashboardPage() {
  const navigate = useNavigate();
  const drafts = listDrafts();

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "var(--color-bg)", padding: "var(--space-8)" }}>
      <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
        <div style={{ marginBottom: "var(--space-8)" }}>
          <div
            style={{
              fontSize: "11px",
              color: "var(--color-text-muted)",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              marginBottom: "var(--space-2)",
            }}
          >
            Dashboard
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "var(--color-text-primary)",
            }}
          >
            Your private label projects
          </h1>
          <p style={{ margin: "10px 0 0", color: "var(--color-text-secondary)", fontSize: "14px" }}>
            Manage drafts and launch new packaging lines in the same workflow as Design.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
            gap: "var(--space-5)",
          }}
        >
          <button
            onClick={() => navigate("/info")}
            style={{
              minHeight: "220px",
              border: "1.5px dashed var(--color-border)",
              borderRadius: "var(--radius-lg)",
              background: "var(--color-surface-raised)",
              padding: "var(--space-6)",
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-text-primary)",
                background: "var(--color-surface)",
              }}
            >
              <Plus size={18} />
            </div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: 600, color: "var(--color-text-primary)" }}>Create new project</div>
              <div style={{ marginTop: "6px", fontSize: "13px", color: "var(--color-text-muted)" }}>
                Start a new line in configurator
              </div>
            </div>
          </button>

          {drafts.map((draft) => (
            <div
              key={draft.id}
              style={{
                minHeight: "220px",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                background: "var(--color-surface)",
                padding: "var(--space-6)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-6)" }}>
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--color-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--color-surface-raised)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  <Layers3 size={16} />
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: "#0f766e",
                    background: "rgba(16, 185, 129, 0.12)",
                    borderRadius: "var(--radius-sm)",
                    padding: "4px 8px",
                  }}
                >
                  Draft
                </div>
              </div>

              <div style={{ fontSize: "17px", fontWeight: 600, color: "var(--color-text-primary)" }}>{draft.name}</div>

              {draft.flavors.length > 0 && (
                <div
                  style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "4px" }}
                  title={draft.flavors.map(f => f.name || f.letter).join(", ")}
                >
                  {draft.flavors.slice(0, 6).map((f, i) => {
                    const hex = PACKAGE_COLORS.find(c => c.key === (f.packageColor as PackageColor))?.hex ?? "#F5F2EB";
                    return (
                      <div
                        key={i}
                        style={{
                          width: "14px", height: "14px", borderRadius: "50%",
                          background: hex,
                          border: "1px solid rgba(0,0,0,0.12)",
                          flexShrink: 0,
                        }}
                      />
                    );
                  })}
                  {draft.flavors.length > 6 && (
                    <span style={{ fontSize: "11px", color: "var(--color-text-muted)", marginLeft: "2px" }}>
                      +{draft.flavors.length - 6}
                    </span>
                  )}
                </div>
              )}

              <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--color-text-muted)" }}>
                <Clock3 size={12} /> updated {new Date(draft.updatedAt).toLocaleString()}
              </div>

              <div style={{ flex: 1 }} />

              <button
                onClick={() => navigate("/design", { state: { draftId: draft.id } })}
                className="ds-btn ds-btn-secondary"
                style={{ width: "100%", justifyContent: "center", marginTop: "var(--space-5)" }}
              >
                Continue design <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
