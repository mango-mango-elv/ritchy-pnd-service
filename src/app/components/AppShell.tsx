import React, { useState, useEffect, useContext, createContext } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { LayoutDashboard } from "lucide-react";
import { STAGES } from "../routes";
import type { StagePath } from "../routes";

/* ─────────────────────────────────────────────────────────────
   AppShell — shared layout for all stages.

   Provides two contexts to child pages via <Outlet />:
     StageNavContext  — navigate between stages
     HeaderActionsCtx — inject right-side header buttons from
                        any child page (Design page uses this
                        for Reset / Save draft / Panel toggle)
─────────────────────────────────────────────────────────────*/

/* ── Stage navigation context ── */
export interface StageNavCtx {
  currentIdx: number;
  goTo:   (path: StagePath) => void;
  goNext: () => void;
  goBack: () => void;
}
export const StageNavContext = createContext<StageNavCtx>({
  currentIdx: 1, goTo: () => {}, goNext: () => {}, goBack: () => {},
});
export function useStageNav() { return useContext(StageNavContext); }

/* ── Header actions injection context ── */
interface ActionsCtx { setActions: (n: React.ReactNode) => void; }
const HeaderActionsCtx = createContext<ActionsCtx>({ setActions: () => {} });

/** Call inside any page to mount custom buttons into the shared header. */
export function useHeaderActions(node: React.ReactNode) {
  const { setActions } = useContext(HeaderActionsCtx);
  useEffect(() => {
    setActions(node);
    return () => setActions(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node]);
}

/* ─────────────────────────────────────────────────────────────
   AppShell component
─────────────────────────────────────────────────────────────*/
const WORKFLOW_PATHS = new Set(["info", "design", "legal", "order", "checkout"]);

export function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const [headerActions, setHeaderActions] = useState<React.ReactNode>(null);

  const currentPath = location.pathname.replace(/^\//, "") as StagePath;
  const isWorkflow  = WORKFLOW_PATHS.has(currentPath);
  const currentIdx  = Math.max(0, STAGES.findIndex(s => s.path === currentPath));

  /* For non-workflow pages (Login, Dashboard) render as transparent passthrough */
  if (!isWorkflow) {
    return (
      <StageNavContext.Provider value={{ currentIdx: 0, goTo: () => {}, goNext: () => {}, goBack: () => {} }}>
        <HeaderActionsCtx.Provider value={{ setActions: () => {} }}>
          <Outlet />
        </HeaderActionsCtx.Provider>
      </StageNavContext.Provider>
    );
  }

  const navCtx: StageNavCtx = {
    currentIdx,
    goTo:   (path) => navigate(`/${path}`),
    goNext: () => { const n = STAGES[currentIdx + 1]; if (n) navigate(`/${n.path}`); },
    goBack: () => { const p = STAGES[currentIdx - 1]; if (p) navigate(`/${p.path}`); },
  };

  return (
    <StageNavContext.Provider value={navCtx}>
      <HeaderActionsCtx.Provider value={{ setActions: setHeaderActions }}>
        <div style={{
          display: "flex", flexDirection: "column",
          height: "100vh", width: "100vw", overflow: "hidden",
          fontFamily: "var(--font-sans)",
          background: "var(--color-bg)",
        }}>

          {/* ══ Shared header ══ */}
          <header style={{
            display: "flex", alignItems: "center",
            padding: "0 var(--space-5)", height: "50px",
            borderBottom: "1px solid var(--color-border)",
            background: "var(--color-surface)", flexShrink: 0,
            gap: "var(--space-4)",
          }}>

            {/* Logo */}
            <div
              onClick={() => navigate("/")}
              style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexShrink: 0, cursor: "pointer" }}
            >
              <div style={{
                width: "26px", height: "26px", borderRadius: "var(--radius-full)",
                background: "var(--color-accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700, fontFamily: "var(--font-sans)" }}>R</span>
              </div>
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "14px", color: "var(--color-text-primary)" }}>
                Ritchy <span style={{ color: "var(--color-accent)", fontWeight: 400 }}>P&amp;D</span>
              </span>
            </div>

            {/* ── Step progress bar ── */}
            <StepBar currentIdx={currentIdx} onGoTo={navCtx.goTo} />

            <div style={{ flex: 1 }} />

            {/* Per-page action buttons (injected via useHeaderActions) */}
            <button
              onClick={() => navigate("/dashboard")}
              className="ds-btn ds-btn-secondary"
              style={{ fontSize: "12px", padding: "7px 10px" }}
              title="Go to dashboard"
            >
              <LayoutDashboard size={13} />
              Dashboard
            </button>

            {headerActions}
          </header>

          {/* ── Page body ── */}
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <Outlet />
          </div>

        </div>
      </HeaderActionsCtx.Provider>
    </StageNavContext.Provider>
  );
}

/* ─────────────────────────────────────────────────────────────
   StepBar
─────────────────────────────────────────────────────────────*/
function StepBar({
  currentIdx,
  onGoTo,
}: {
  currentIdx: number;
  onGoTo: (path: StagePath) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {STAGES.map((stage, idx) => {
        const isActive    = idx === currentIdx;
        const isCompleted = idx < currentIdx;
        const isFuture    = idx > currentIdx;

        return (
          <React.Fragment key={stage.path}>
            <button
              onClick={() => !isFuture && onGoTo(stage.path)}
              disabled={isFuture}
              style={{
                position: "relative",
                background: "none", border: "none",
                cursor: isFuture ? "default" : "pointer",
                padding: "4px 12px",
                fontFamily: "var(--font-sans)",
                fontWeight: isActive ? 600 : 400,
                fontSize: "13px",
                color: isActive
                  ? "var(--color-text-primary)"
                  : isCompleted
                    ? "var(--color-accent)"
                    : "var(--color-text-muted)",
                opacity: isFuture ? 0.55 : 1,
                transition: "color .15s, opacity .15s",
              }}
            >
              {stage.label}
              {isActive && (
                <span style={{
                  position: "absolute", bottom: -1, left: "50%",
                  transform: "translateX(-50%)",
                  width: "65%", height: "2px",
                  background: "var(--color-accent)",
                  borderRadius: "1px", display: "block",
                }} />
              )}
            </button>

            {idx < STAGES.length - 1 && (
              <span style={{
                fontSize: "11px",
                color: isCompleted ? "var(--color-accent)" : "var(--color-border)",
                userSelect: "none",
                transition: "color .3s",
                lineHeight: 1,
              }}>
                →
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
