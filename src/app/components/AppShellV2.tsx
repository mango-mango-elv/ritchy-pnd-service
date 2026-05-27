import React, { createContext, useContext } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router";

const V2_STAGES = [
  { path: "/order",      label: "Order"      },
  { path: "/design",     label: "Design"     },
  { path: "/signup",     label: "Sign Up"    },
  { path: "/compliance", label: "Compliance" },
  { path: "/confirm",    label: "Confirm"    },
] as const;

interface V2NavCtx {
  goNext: () => void;
  goBack: () => void;
}
const V2NavContext = createContext<V2NavCtx>({ goNext: () => {}, goBack: () => {} });
export function useV2Nav() { return useContext(V2NavContext); }

export function AppShellV2() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === "/" || location.pathname === "";
  const currentIdx = V2_STAGES.findIndex(s => s.path === location.pathname);

  const navCtx: V2NavCtx = {
    goNext: () => { const n = V2_STAGES[currentIdx + 1]; if (n) navigate(n.path); },
    goBack: () => {
      if (currentIdx <= 0) navigate("/");
      else { const p = V2_STAGES[currentIdx - 1]; if (p) navigate(p.path); }
    },
  };

  return (
    <V2NavContext.Provider value={navCtx}>
      <div style={{
        display: "flex", flexDirection: "column",
        minHeight: "100vh", width: "100%",
        fontFamily: "var(--font-sans)",
        background: "var(--color-bg)",
      }}>
        {!isLanding && (
          <header style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 var(--space-5)", height: "50px",
            borderBottom: "1px solid rgba(0,0,0,0.07)",
            background: "rgba(245,245,247,0.80)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            boxShadow: "none",
            position: "sticky", top: 0, zIndex: 100,
            flexShrink: 0,
          }}>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", textDecoration: "none" }}>
              <div style={{
                width: "26px", height: "26px", borderRadius: "var(--radius-full)",
                background: "#111111",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700 }}>R</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: "14px", color: "#111111" }}>
                Ritchy <span style={{ color: "#999999", fontWeight: 400 }}>Brand Factory</span>
              </span>
            </Link>

            <V2StepBar currentIdx={currentIdx} />
          </header>
        )}

        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
      </div>
    </V2NavContext.Provider>
  );
}

function V2StepBar({ currentIdx }: { currentIdx: number }) {
  const safeIdx = Math.max(0, currentIdx);
  const total = V2_STAGES.length;
  const pct = ((safeIdx + 1) / total) * 100;
  const current = V2_STAGES[safeIdx];

  return (
    <>
      {/* Desktop: text steps */}
      <div className="v2-stepbar-desktop" style={{ alignItems: "center", gap: 0 }}>
        {V2_STAGES.map((stage, idx) => {
          const isActive    = idx === currentIdx;
          const isCompleted = idx < currentIdx;
          const isFuture    = idx > currentIdx;
          return (
            <React.Fragment key={stage.path}>
              <span style={{
                position: "relative",
                padding: "4px 10px",
                fontFamily: "var(--font-sans)",
                fontWeight: isActive ? 600 : 400,
                fontSize: "13px",
                color: isActive ? "#111111" : isCompleted ? "#666666" : "#aaaaaa",
                opacity: isFuture ? 0.5 : 1,
                whiteSpace: "nowrap",
              }}>
                {stage.label}
                {isActive && (
                  <span style={{
                    position: "absolute", bottom: -1, left: "50%",
                    transform: "translateX(-50%)",
                    width: "65%", height: "2px",
                    background: "#111111",
                    borderRadius: "1px", display: "block",
                  }} />
                )}
              </span>
              {idx < V2_STAGES.length - 1 && (
                <span style={{ fontSize: "11px", color: "rgba(0,0,0,0.20)", userSelect: "none", lineHeight: 1 }}>→</span>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile: compact bar with current step + progress */}
      <div className="v2-stepbar-mobile" style={{
        flexDirection: "column", alignItems: "flex-end", gap: "4px", minWidth: 0,
      }}>
        <span style={{
          fontSize: "12px", fontWeight: 600, color: "#111111",
          fontFamily: "var(--font-sans)", whiteSpace: "nowrap",
        }}>
          {current?.label ?? ""} <span style={{ color: "#999", fontWeight: 400 }}>· {safeIdx + 1}/{total}</span>
        </span>
        <div style={{
          width: "80px", height: "3px",
          background: "rgba(0,0,0,0.08)", borderRadius: "999px", overflow: "hidden",
        }}>
          <div style={{ width: `${pct}%`, height: "100%", background: "#111111", transition: "width .25s" }} />
        </div>
      </div>
    </>
  );
}
