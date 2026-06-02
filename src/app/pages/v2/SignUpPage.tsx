import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Save, Lock, X, Loader2 } from "lucide-react";
import { PackagePreview } from "./PackagePreview";
import { COLOR_PRESETS } from "./design-types";

const COUNTRIES = [
  "United Kingdom",
  "Germany",
  "France",
  "Italy",
  "Spain",
  "Czech Republic",
  "Slovakia",
  "Romania",
  "United States",
  "Poland",
  "Netherlands",
  "Belgium",
  "Austria",
  "Canada",
  "Other"
];

function readSession<T>(key: string, fallback: T): T {
  try { return JSON.parse(sessionStorage.getItem(key) ?? "null") ?? fallback; }
  catch { return fallback; }
}

export function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(() => {
    const saved = readSession<{ email?: string; companyName?: string; country?: string }>("ritchy-v2-user", {});
    return {
      email: saved.email ?? "",
      companyName: saved.companyName ?? "",
      country: saved.country ?? "",
    };
  });
  const [showModal, setShowModal] = useState(false);
  const [modalEmail, setModalEmail] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  // Mock OAuth: short "connecting" pause, then store a demo Google profile
  // and continue the wizard — no real backend in this demo shell.
  const handleGoogleSignIn = () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    setTimeout(() => {
      sessionStorage.setItem("ritchy-v2-user", JSON.stringify({
        email: "alex.morgan@brandco.io",
        companyName: "Brand Co.",
        country: form.country || "United Kingdom",
        authProvider: "google",
      }));
      navigate("/compliance");
    }, 900);
  };

  // Retrieve previous designs and order details dynamically to render package preview
  const design = readSession<any>("ritchy-v2-design", {
    templateId: "t1-flavor",
    brandName: "",
    logoDataUrl: "",
    logoScale: 1.0,
    skus: [],
    selectedSkuId: "",
  });

  const order = readSession<any>("ritchy-v2-order", {});

  let skus = design.skus || [];
  if (skus.length === 0) {
    const flavor = String(order.flavor ?? "Passion Fruit");
    skus = [{
      id: "sku-1",
      displayName: flavor,
      type: order.nicType === "freebase" ? "freebase" : "salt",
      flavor,
      strength: "20mg",
      colorTab: "presets",
      colorPresetId: "sunset",
      customColor: "#ea580c"
    }];
  }
  const selectedSkuId = design.selectedSkuId || skus[0]?.id;
  const selectedSku = skus.find((s: any) => s.id === selectedSkuId) || skus[0];

  const selectedPreset = selectedSku
    ? (COLOR_PRESETS.find(p => p.id === selectedSku.colorPresetId) ?? COLOR_PRESETS[0])
    : COLOR_PRESETS[0];

  const activeGradient = selectedSku
    ? (selectedSku.colorTab === "custom"
      ? `linear-gradient(135deg, ${selectedSku.customColor} 0%, ${selectedSku.customColor} 100%)`
      : selectedPreset.gradient)
    : COLOR_PRESETS[0].gradient;

  const getGraphicsDefaultColor = (sku: any) => {
    if (sku.colorPresetId === "alabaster" || sku.colorPresetId === "gold") {
      return "black";
    }
    return "white";
  };
  const activeGraphicsTab = selectedSku
    ? (selectedSku.graphicsColorTab ?? getGraphicsDefaultColor(selectedSku))
    : "white";
  const activeGraphicsColor = activeGraphicsTab === "custom"
    ? (selectedSku?.graphicsCustomColor ?? "#ffffff")
    : (activeGraphicsTab === "black" ? "#252525" : "#ffffff");

  const handleChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [k]: e.target.value }));
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const finalEmail = form.email.trim() || "demo@company.com";
    const finalCompany = form.companyName.trim() || "Demo Inc";
    const finalCountry = form.country || "United Kingdom";

    sessionStorage.setItem("ritchy-v2-user", JSON.stringify({
      email: finalEmail,
      companyName: finalCompany,
      country: finalCountry
    }));

    navigate("/compliance");
  };

  const handleModalSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalEmail = modalEmail.trim() || "demo@company.com";
    
    sessionStorage.setItem("ritchy-v2-user", JSON.stringify({
      email: finalEmail,
      companyName: form.companyName.trim() || "Demo Inc",
      country: form.country || "United Kingdom"
    }));

    setShowModal(false);
    navigate("/compliance");
  };

  const handleBackClick = () => {
    if (!form.email.trim()) {
      setShowModal(true);
    } else {
      navigate("/design");
    }
  };

  return (
    <div className="v2-design-page">
      {/* ── Center: form ── */}
      <main className="v2-design-center" style={{ display: "flex", flexDirection: "column" }}>
        <div className="v2-design-center-scroll" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "24px" }}>
          
          {/* Main Card with Premium Design System Glassmorphism */}
          <form onSubmit={handleSave} style={{
            background: "var(--color-surface)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid var(--color-border)",
            borderRadius: "16px",
            padding: "32px 28px",
            boxShadow: "var(--shadow-box), inset 0 1px 0 rgba(255,255,255,0.90)",
            display: "flex",
            flexDirection: "column",
            gap: "20px"
          }}>
            
            {/* Elegant Floppy Disk Icon Banner with Dynamic Selected Flavor Gradient */}
            <div style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              background: activeGradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: activeGraphicsColor === "#252525" ? "#111111" : "#ffffff",
              margin: "0 auto 4px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}>
              <Save size={24} strokeWidth={2.2} />
            </div>

            {/* Heading */}
            <div style={{ textAlign: "center" }}>
              <h1 style={{ margin: "0 0 8px", fontSize: "24px", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.015em" }}>
                Save your configuration
              </h1>
              <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: "13px", lineHeight: "1.5", padding: "0 8px" }}>
                You've spent time building something great. We'll save your product so you can come back anytime — plus unlock your compliance preview.
              </p>
            </div>

            {/* Google sign-in (mock) */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              style={{
                flex: "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                height: "44px",
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.12)",
                borderRadius: "10px",
                fontSize: "13.5px", fontWeight: 600,
                fontFamily: "var(--font-sans)",
                color: "var(--color-text-primary)",
                cursor: googleLoading ? "default" : "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "all 0.15s ease",
                opacity: googleLoading ? 0.75 : 1,
              }}
            >
              {googleLoading
                ? <><Loader2 size={16} className="animate-spin" /> Connecting…</>
                : <><GoogleGIcon /> Continue with Google</>}
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.08)" }} />
              <span style={{ fontSize: "11px", color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
                or save with email
              </span>
              <div style={{ flex: 1, height: "1px", background: "rgba(0,0,0,0.08)" }} />
            </div>

            {/* Input Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "8px" }}>
              {/* Email Address */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 500, color: "var(--color-text-secondary)" }}>
                  Email address
                </label>
                <input
                  className="v2-signup-input-field"
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={handleChange("email")}
                />
              </div>

              {/* Company Name */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 500, color: "var(--color-text-secondary)" }}>
                  Company name
                </label>
                <input
                  className="v2-signup-input-field"
                  type="text"
                  placeholder="Your company"
                  value={form.companyName}
                  onChange={handleChange("companyName")}
                />
              </div>

              {/* Country Selector */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 500, color: "var(--color-text-secondary)" }}>
                  Country
                </label>
                <select
                  className="v2-signup-input-field"
                  value={form.country}
                  onChange={handleChange("country")}
                  style={{ appearance: "auto" }}
                >
                  <option value="">Select your country</option>
                  {COUNTRIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Privacy text */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              fontSize: "11px",
              color: "var(--color-text-muted)",
              marginTop: "4px"
            }}>
              <Lock size={12} style={{ color: "var(--color-text-muted)" }} />
              <span>No spam. No sharing. Just your product, saved securely.</span>
            </div>

            {/* Premium Design System Primary Button */}
            <button
              type="submit"
              className="v2-footer-btn v2-footer-btn-primary fc-nav-btn"
              style={{
                width: "100%",
                marginTop: "8px",
                // The form is a column flex container — neutralise the
                // .v2-footer-btn `flex: 1 1 0%` or the button collapses.
                flex: "none"
              }}
            >
              Save & Continue
            </button>
          </form>

          {/* Back navigation */}
          <div className="v2-nav-footer" style={{ marginTop: "4px" }}>
            <button onClick={handleBackClick} className="v2-footer-btn v2-footer-btn-secondary fc-nav-btn">
              ← Back to Design
            </button>
          </div>
        </div>
      </main>

      {/* ── Right: Package Preview Sidebar ── */}
      <aside className="v2-design-right">
        <div className="v2-design-right-card" style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
          
          {/* Card Header */}
          <div style={{ flexShrink: 0, paddingBottom: "12px" }}>
            <div style={{ fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--color-text-primary)" }}>
              Your Custom Design
            </div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", marginTop: "2px" }}>
              Active SKU: {selectedSku?.displayName || "Default Flavor"}
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(0,0,0,0.06)", margin: "0 0 16px 0", flexShrink: 0 }} />

          {/* Physical Packaging Preview */}
          <div className="v2-preview-region">
            <div className="v2-preview-sizer">
              <PackagePreview
                templateId={design.templateId}
                brandName={design.brandName}
                flavorName={selectedSku?.displayName ?? ""}
                strength={selectedSku?.strength ?? "20mg"}
                nicType={selectedSku?.type ?? "salt"}
                gradient={activeGradient}
                logoDataUrl={design.logoDataUrl}
                logoScale={design.logoScale ?? 1.0}
                bgImageDataUrl={selectedSku?.bgImageDataUrl}
                bgImagePositionBox={selectedSku?.bgImagePositionBox}
                bgImageScaleBox={selectedSku?.bgImageScaleBox ?? 1.0}
                bgImagePositionBottle={selectedSku?.bgImagePositionBottle}
                bgImageScaleBottle={selectedSku?.bgImageScaleBottle ?? 1.0}
                colorTab={selectedSku?.colorTab}
                graphicsColor={activeGraphicsColor}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* ── GORGEOUS EXIT-INTENT / LEAVE POPUP MODAL ── */}
      {showModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
          padding: "16px",
          animation: "fadeIn 0.2s ease-out"
        }}>
          {/* Modal Container with Premium Glassmorphism */}
          <div style={{
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(24px) saturate(200%)",
            WebkitBackdropFilter: "blur(24px) saturate(200%)",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: "16px",
            maxWidth: "400px",
            width: "100%",
            boxShadow: "0 10px 30px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.95)",
            padding: "32px 24px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "16px",
            boxSizing: "border-box"
          }}>
            
            {/* Close Button X */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                background: "transparent",
                border: "none",
                color: "var(--color-text-muted)",
                cursor: "pointer",
                padding: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <X size={18} />
            </button>

            {/* Floppy Icon with Active Flavor Gradient */}
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: activeGradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: activeGraphicsColor === "#252525" ? "#111111" : "#ffffff",
              marginBottom: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}>
              <Save size={20} strokeWidth={2.2} />
            </div>

            {/* Heading & Subtitle */}
            <div>
              <h2 style={{ margin: "0 0 6px", fontSize: "20px", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.01em" }}>
                Don't lose your configuration
              </h2>
              <p style={{ margin: 0, fontSize: "12.5px", color: "var(--color-text-secondary)", lineHeight: "1.45" }}>
                Enter your email and we'll save everything so you can come back anytime.
              </p>
            </div>

            {/* Form inside modal */}
            <form onSubmit={handleModalSave} style={{ width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
              <input
                className="v2-signup-input-field"
                type="email"
                placeholder="you@company.com"
                value={modalEmail}
                onChange={e => setModalEmail(e.target.value)}
                required
                style={{ width: "100%", boxSizing: "border-box" }}
              />
              
              <button
                type="submit"
                className="v2-footer-btn v2-footer-btn-primary"
                style={{
                  width: "100%",
                  flex: "none"
                }}
              >
                Save My Product
              </button>
            </form>

            {/* Subtext */}
            <div style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
              No spam. Just your saved configuration.
            </div>

            {/* Discard & Back Link */}
            <button
              onClick={() => {
                setShowModal(false);
                navigate("/design");
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--color-text-muted)",
                fontSize: "12px",
                textDecoration: "underline",
                cursor: "pointer",
                marginTop: "2px"
              }}
            >
              No thanks, discard and go back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* Official multicolour Google "G" mark (lucide has no brand logos). */
function GoogleGIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
