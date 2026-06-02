import React from "react";
import { useNavigate } from "react-router";
import { Plus, Check, CreditCard, Factory, Truck, FileText } from "lucide-react";
import { PackagePreview } from "./PackagePreview";
import { COLOR_PRESETS } from "./design-types";

function readSession<T>(key: string): T | null {
  try { return JSON.parse(sessionStorage.getItem(key) ?? "null"); }
  catch { return null; }
}

/* Built-in sample project — shown when the session has no real order so the
   dashboard never looks empty during a demo. */
const SAMPLE_PROJECT = {
  isSample: true,
  brandName: "NORDIC MIST",
  flavorName: "ARCTIC BERRY",
  templateId: "t1-flavor",
  gradient: COLOR_PRESETS.find(p => p.id === "ocean")?.gradient ?? COLOR_PRESETS[0].gradient,
  logoDataUrl: "",
  logoScale: 1.0,
  strength: "20mg",
  nicType: "salt" as const,
  warning: "This product contains nicotine which is a highly addictive substance. Not for sale to persons under the age of 18.",
  skus: [
    { name: "Arctic Berry",  meta: "Salt · 20mg", qty: 1500, dot: COLOR_PRESETS.find(p => p.id === "ocean")?.gradient },
    { name: "Glacier Mint",  meta: "Salt · 10mg", qty: 1000, dot: COLOR_PRESETS.find(p => p.id === "forest")?.gradient },
    { name: "Cloudberry",    meta: "Salt · 20mg", qty: 500,  dot: COLOR_PRESETS.find(p => p.id === "sunset")?.gradient },
  ],
  totalQty: 3000,
  totalEUR: 4350,
  market: "EU",
  submitted: true,
  orderId: "RB-4217",
};

export function DashboardPageV2() {
  const navigate = useNavigate();

  const order      = readSession<any>("ritchy-v2-order");
  const design     = readSession<any>("ritchy-v2-design");
  const userData   = readSession<any>("ritchy-v2-user");
  const compliance = readSession<any>("ritchy-v2-compliance");
  const submitted  = readSession<any>("ritchy-v2-submitted");

  const hasRealProject = !!(order && Array.isArray(order.skus) && order.skus.length > 0);

  const project = hasRealProject
    ? (() => {
        const skus = order.skus as any[];
        const first = skus[0];
        const totalQty = skus.reduce((s, x) => s + (Number(x.quantity) || 0), 0);
        return {
          isSample: false,
          brandName: String(design?.brandName ?? "") || "YOUR BRAND",
          flavorName: String(design?.flavorName ?? first?.flavorName ?? ""),
          templateId: String(design?.templateId ?? "t1-flavor"),
          gradient: design?.background?.style
            ?? (first?.flavorGradient
              ? `linear-gradient(135deg, ${first.flavorGradient[0]} 0%, ${first.flavorGradient[1]} 100%)`
              : COLOR_PRESETS[0].gradient),
          logoDataUrl: String(design?.logoDataUrl ?? ""),
          logoScale: Number(design?.logoScale ?? 1.0),
          strength: `${first?.strength ?? "20"}mg`,
          nicType: (first?.nicotineType === "freebase" ? "freebase" : "salt") as "salt" | "freebase",
          warning: compliance?.warning,
          skus: skus.map(s => ({
            name: s.flavorName,
            meta: `${s.nicotineType === "freebase" ? "Freebase" : "Salt"} · ${s.strength}mg`,
            qty: Number(s.quantity) || 0,
            dot: s.flavorGradient
              ? `linear-gradient(135deg, ${s.flavorGradient[0]} 0%, ${s.flavorGradient[1]} 100%)`
              : COLOR_PRESETS[0].gradient,
          })),
          totalQty,
          totalEUR: typeof order.estTotal === "number" && order.estTotal > 0 ? order.estTotal : null,
          market: String(compliance?.market ?? "eu").toUpperCase(),
          submitted: !!submitted,
          orderId: submitted?.orderId ?? null,
        };
      })()
    : SAMPLE_PROJECT;

  const isGoogle = userData?.authProvider === "google";

  const timeline = [
    {
      icon: <FileText size={14} />, label: "Order submitted",
      detail: project.submitted ? (project.orderId ? `Order ${project.orderId}` : "Pro-forma invoice sent") : "Finish the wizard to submit",
      state: project.submitted ? "done" : "muted",
    },
    {
      icon: <CreditCard size={14} />, label: "Payment",
      detail: project.submitted ? "Awaiting wire transfer" : "—",
      state: project.submitted ? "active" : "muted",
    },
    { icon: <Factory size={14} />, label: "Production", detail: "Starts after payment", state: "muted" },
    { icon: <Truck size={14} />, label: "Shipping", detail: "2–3 weeks", state: "muted" },
  ] as const;

  return (
    <div className="v2-page-container">
      <div style={{ maxWidth: "980px", margin: "0 auto", display: "grid", gap: "var(--space-4)" }}>

        {/* Page header */}
        <div>
          <h1 className="v2-step-title">Your projects</h1>
          {userData?.email ? (
            <p className="v2-step-subtitle">
              Signed in as <strong style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>{userData.email}</strong>
              {userData.companyName ? ` · ${userData.companyName}` : ""}
              {isGoogle ? " · via Google" : ""}
            </p>
          ) : hasRealProject ? (
            <p className="v2-step-subtitle" style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              Guest — sign up to save your progress
              <button
                onClick={() => navigate("/signup")}
                className="ds-btn ds-btn-primary"
                style={{ fontSize: "12px", padding: "5px 12px" }}
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="v2-step-subtitle">Sample workspace — start a project to make it yours</p>
          )}
        </div>

        <div className="v2-dash-grid">
          {/* ── Project card ── */}
          <GlassCard style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "17px", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "0.01em" }}>
                  {project.brandName}
                </div>
                <div style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "2px" }}>
                  {project.orderId ? `Order ${project.orderId} · ` : ""}{project.market} market
                </div>
              </div>
              <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                {project.isSample && (
                  <span style={{
                    fontSize: "10px", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase",
                    padding: "4px 8px", borderRadius: "999px",
                    background: "rgba(0,0,0,0.05)", color: "var(--color-text-muted)",
                  }}>
                    Sample
                  </span>
                )}
                <span style={{
                  fontSize: "11px", fontWeight: 600,
                  padding: "4px 10px", borderRadius: "999px",
                  background: project.submitted ? "rgba(212,160,26,0.12)" : "rgba(0,0,0,0.05)",
                  border: project.submitted ? "1px solid rgba(212,160,26,0.30)" : "1px solid rgba(0,0,0,0.06)",
                  color: project.submitted ? "#946d0c" : "var(--color-text-secondary)",
                  whiteSpace: "nowrap",
                }}>
                  {project.submitted ? "Awaiting payment" : "Draft"}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "18px", alignItems: "flex-start", flexWrap: "wrap" }}>
              {/* Mini package preview — fixed 300×347 render scaled down */}
              <div style={{
                width: "150px", height: "174px", flexShrink: 0,
                overflow: "hidden", borderRadius: "10px",
                background: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{ width: "300px", height: "347px", flexShrink: 0, transform: "scale(0.5)", transformOrigin: "center center" }}>
                  <PackagePreview
                    templateId={project.templateId}
                    brandName={project.brandName}
                    flavorName={project.flavorName}
                    strength={project.strength}
                    nicType={project.nicType}
                    gradient={project.gradient}
                    logoDataUrl={project.logoDataUrl}
                    logoScale={project.logoScale}
                    healthWarningText={project.warning}
                  />
                </div>
              </div>

              {/* SKU list + totals — min-width makes it wrap under the thumb on mobile */}
              <div style={{ flex: 1, minWidth: "200px", display: "flex", flexDirection: "column" }}>
                {project.skus.map((s, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "7px 0",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                    fontSize: "13px",
                  }}>
                    <span style={{ width: "14px", height: "14px", borderRadius: "4px", background: s.dot, flexShrink: 0 }} />
                    <span style={{ fontWeight: 500, color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {s.name}
                    </span>
                    <span style={{ color: "var(--color-text-muted)", fontSize: "12px", whiteSpace: "nowrap" }}>{s.meta}</span>
                    <span style={{ marginLeft: "auto", color: "var(--color-text-secondary)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
                      ×{s.qty.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: "10px" }}>
                  <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                    {project.totalQty.toLocaleString()} bottles total
                  </span>
                  <span style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-text-primary)" }}>
                    {project.totalEUR != null
                      ? `€${project.totalEUR.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            {!project.submitted && (
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => navigate("/design")} className="ds-btn ds-btn-primary" style={{ fontSize: "13px" }}>
                  Continue design →
                </button>
              </div>
            )}
          </GlassCard>

          {/* ── Right column: timeline + account ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", minWidth: 0 }}>
            <GlassCard>
              <CardLabel>Status</CardLabel>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {timeline.map((step, i) => {
                  const color = step.state === "done" ? "#16a34a" : step.state === "active" ? "#b45309" : "var(--color-text-muted)";
                  return (
                    <div key={step.label} style={{ display: "flex", gap: "12px" }}>
                      {/* Icon + connector */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div className={step.state === "active" ? "v2-dash-pulse" : undefined} style={{
                          width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: step.state === "done" ? "rgba(22,163,74,0.10)" : step.state === "active" ? "rgba(212,160,26,0.14)" : "rgba(0,0,0,0.04)",
                          color,
                        }}>
                          {step.state === "done" ? <Check size={14} /> : step.icon}
                        </div>
                        {i < timeline.length - 1 && (
                          <div style={{ width: "2px", flex: 1, minHeight: "14px", background: "rgba(0,0,0,0.07)", margin: "3px 0" }} />
                        )}
                      </div>
                      <div style={{ paddingBottom: i < timeline.length - 1 ? "14px" : 0, minWidth: 0 }}>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: step.state === "muted" ? "var(--color-text-muted)" : "var(--color-text-primary)", lineHeight: "28px" }}>
                          {step.label}
                        </div>
                        <div style={{ fontSize: "11.5px", color: "var(--color-text-muted)", marginTop: "-4px" }}>
                          {step.detail}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

          </div>
        </div>

        {/* ── Start new project ── */}
        <button
          onClick={() => navigate("/order")}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            padding: "18px",
            background: "transparent",
            border: "1.5px dashed rgba(0,0,0,0.14)",
            borderRadius: "var(--radius-lg)",
            color: "var(--color-text-secondary)",
            fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-sans)",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
        >
          <Plus size={15} /> Start new project
        </button>
      </div>
    </div>
  );
}

function GlassCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <section style={{
      background: "rgba(255,255,255,0.82)",
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      border: "1px solid rgba(0,0,0,0.07)",
      borderRadius: "var(--radius-lg)",
      padding: "var(--space-4) var(--space-5)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.90)",
      ...style,
    }}>
      {children}
    </section>
  );
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      margin: "0 0 var(--space-3)", fontSize: "12px", fontWeight: 600,
      color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em",
    }}>
      {children}
    </h2>
  );
}
