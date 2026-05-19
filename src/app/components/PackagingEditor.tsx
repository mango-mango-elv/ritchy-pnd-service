import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  ChevronLeft, ChevronRight, X, Plus, Check,
  Upload, Trash2, Copy, AlertTriangle, ArrowRight,
} from "lucide-react";
import { FrontView }    from "./FrontView";
import { View3D }       from "./View3D";
import { LayoutView }   from "./LayoutView";
import { RangeView }    from "./RangeView";
import { ZoomableView } from "./ZoomableView";
import {
  DEFAULT_FLAVORS, PACKAGE_COLORS, TITLE_FONTS, STRENGTHS,
  makeFlavor, normalizeFlavor,
} from "./packageTypes";
import { getDraftById, saveDraft } from "../lib/drafts";
import type {
  Flavor, ViewMode, FlavorType, PackageColor, TitleFont, Template, CustomText,
} from "./packageTypes";

/* ── Prop types ── */
export interface PackagingEditorProps {
  /** When provided, editor runs headless (inside AppShell).
   *  Caller receives callbacks for the shared header buttons. */
  onRegisterCallbacks?: (cbs: {
    reset:       () => void;
    save:        () => void;
    togglePanel: () => void;
    isPanelOpen: boolean;
  }) => void;
  /** Advance to the next workflow stage. */
  onGoToNextStage?: () => void;
  /** Optional draft id to load from localStorage */
  initialDraftId?: string;
}

type PanelTab   = "design" | "content" | "layout" | "text";
type WizardStep = "choice" | 1 | 2 | 3 | null;

/* ════════════════════════════════════════════════════════════
   Tiny shared UI helpers
════════════════════════════════════════════════════════════ */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: "10px", fontFamily: "var(--font-sans)", fontWeight: 600,
      color: "var(--color-text-secondary)", textTransform: "uppercase",
      letterSpacing: "0.09em", marginBottom: "var(--space-2)",
    }}>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ borderBottom: "1px solid var(--color-border-light)", margin: "var(--space-4) 0" }} />;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{
      display: "block", fontSize: "11px", fontFamily: "var(--font-sans)",
      color: "var(--color-text-secondary)", marginBottom: "var(--space-1)",
    }}>
      {children}
    </label>
  );
}

function UploadZone({
  image, label, hint, inputRef, onChange, onDrop, previewHeight = 64,
}: {
  image: string | null; label: string; hint: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDrop?: (e: React.DragEvent) => void;
  previewHeight?: number;
}) {
  return (
    <div
      onDragOver={e => e.preventDefault()}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        border: "1.5px dashed var(--color-border)", borderRadius: "var(--radius-md)",
        padding: "var(--space-4) var(--space-3)", textAlign: "center",
        cursor: "pointer", background: "var(--color-surface-raised)",
        marginBottom: "var(--space-3)", transition: "border-color .15s",
      }}
    >
      {image ? (
        <>
          <img src={image} alt={label} style={{ width: "100%", height: previewHeight, objectFit: "contain", borderRadius: "var(--radius-sm)", display: "block" }} />
          <div style={{ fontSize: "10px", color: "var(--color-text-muted)", marginTop: "6px", fontFamily: "var(--font-sans)" }}>click to replace</div>
        </>
      ) : (
        <>
          <Upload size={14} style={{ color: "var(--color-text-muted)", display: "block", margin: "0 auto 6px" }} />
          <div style={{ fontSize: "12px", fontFamily: "var(--font-sans)", color: "var(--color-text-primary)", marginBottom: "2px" }}>{label}</div>
          <div style={{ fontSize: "10px", color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}>{hint}</div>
        </>
      )}
      <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onChange} />
    </div>
  );
}

/* View-mode pills */
const VIEW_BUTTONS: { key: ViewMode; label: string; hint: string }[] = [
  { key: "front",  label: "Front",  hint: "35 × 75 mm" },
  { key: "3d",     label: "3D",     hint: "75 × 35 × 25 mm" },
  { key: "layout", label: "Layout", hint: "dieline" },
  { key: "range",  label: "Range",  hint: "full line" },
];

const PANEL_TABS: { key: PanelTab; label: string }[] = [
  { key: "design",  label: "Design"  },
  { key: "content", label: "Content" },
  { key: "layout",  label: "Layout"  },
  { key: "text",    label: "Text+"   },
];

/* ════════════════════════════════════════════════════════════
   PackagingEditor — body only (no header).
   The header (logo + step bar + action buttons) lives in
   AppShell and DesignPage when used inside the routing shell.
════════════════════════════════════════════════════════════ */
export function PackagingEditor({ onRegisterCallbacks, onGoToNextStage, initialDraftId }: PackagingEditorProps) {
  const [viewMode,      setViewMode]      = useState<ViewMode>("3d");
  const [flavors,       setFlavors]       = useState<Flavor[]>(DEFAULT_FLAVORS);
  const [activeFlavor,  setActiveFlavor]  = useState(0);
  const [currentDraftId, setCurrentDraftId] = useState<string | undefined>(initialDraftId);
  const [panelTab,      setPanelTab]      = useState<PanelTab>("content");
  const [isPanelOpen,   setIsPanelOpen]   = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [wizardStep,    setWizardStep]    = useState<WizardStep>("choice");

  const totalSlots = 10;

  const fileInputRef      = useRef<HTMLInputElement>(null);
  const logoInputRef      = useRef<HTMLInputElement>(null);
  const skullIconInputRef = useRef<HTMLInputElement>(null);

  const flavor = normalizeFlavor(flavors[activeFlavor]);

  /* ── Flavor update helpers ── */
  const updateFlavor = useCallback((updates: Partial<Flavor>) => {
    setFlavors(prev => prev.map((f, i) => i === activeFlavor ? { ...f, ...updates } : f));
  }, [activeFlavor]);

  const updateArtTransform = useCallback(
    (u: { artOffsetX?: number; artOffsetY?: number; artScale?: number }) => updateFlavor(u),
    [updateFlavor],
  );

  /* ── Flavor management ── */
  const addFlavor = () => {
    if (flavors.length >= totalSlots) return;
    const letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[flavors.length] ?? "+";
    const nf = makeFlavor(String(Date.now()), letter);
    setFlavors(prev => [...prev, nf]);
    setActiveFlavor(flavors.length);
  };

  const duplicateFlavor = () => {
    if (flavors.length >= totalSlots) return;
    const copy: Flavor = { ...flavor, id: String(Date.now()), letter: flavor.letter + "'", name: flavor.name ? flavor.name + " (copy)" : "" };
    const idx = activeFlavor + 1;
    setFlavors(prev => [...prev.slice(0, idx), copy, ...prev.slice(idx)]);
    setActiveFlavor(idx);
  };

  const deleteFlavor = () => {
    if (!deleteConfirm) { setDeleteConfirm(true); setTimeout(() => setDeleteConfirm(false), 2500); return; }
    if (flavors.length <= 1) return;
    setFlavors(prev => prev.filter((_, i) => i !== activeFlavor));
    setActiveFlavor(Math.max(0, activeFlavor - 1));
    setDeleteConfirm(false);
  };

  const handleReset = useCallback(() => { setFlavors(DEFAULT_FLAVORS); setActiveFlavor(0); }, []);
  const handleSave  = useCallback(() => {
    const id =
      currentDraftId && currentDraftId.trim().length > 0
        ? currentDraftId
        : `draft-${Date.now()}`;
    const active = normalizeFlavor(flavors[activeFlavor]);
    const draftName = active.name?.trim() || `Project ${new Date().toLocaleDateString()}`;
    saveDraft({
      id,
      name: draftName,
      activeFlavor,
      flavors: flavors.map((f) => normalizeFlavor(f)),
    });
    if (!currentDraftId) setCurrentDraftId(id);
  }, [activeFlavor, currentDraftId, flavors]);
  const togglePanel = useCallback(() => setIsPanelOpen(v => !v), []);

  useEffect(() => {
    if (!initialDraftId) return;
    setCurrentDraftId(initialDraftId);
    const draft = getDraftById(initialDraftId);
    if (!draft) return;
    if (!draft.flavors.length) return;
    setFlavors(draft.flavors.map((f) => normalizeFlavor(f)));
    setActiveFlavor(Math.max(0, Math.min(draft.activeFlavor ?? 0, draft.flavors.length - 1)));
  }, [initialDraftId]);

  /* ── Register callbacks for header buttons (DesignPage → AppShell) ── */
  useEffect(() => {
    onRegisterCallbacks?.({ reset: handleReset, save: handleSave, togglePanel, isPanelOpen });
  }, [onRegisterCallbacks, handleReset, handleSave, togglePanel, isPanelOpen]);

  /* ── Uploads ── */
  const handleArtUpload      = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) updateFlavor({ artImage: URL.createObjectURL(f) }); };
  const handleDropArt        = (e: React.DragEvent) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) updateFlavor({ artImage: URL.createObjectURL(f) }); };
  const handleLogoUpload     = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) updateFlavor({ logoImage: URL.createObjectURL(f) }); };
  const handleSkullIconUpload= (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) updateFlavor({ skullIconImage: URL.createObjectURL(f) }); };

  /* ── Custom texts ── */
  const addCustomText    = () => updateFlavor({ customTexts: [...flavor.customTexts, { id: `txt-${Date.now()}`, text: "Your text", x: 50, y: 50, fontSize: 16, color: "#FFFFFF", fontFamily: "inter" }] });
  const updateCustomText = (id: string, u: Partial<CustomText>) => updateFlavor({ customTexts: flavor.customTexts.map(t => t.id === id ? { ...t, ...u } : t) });
  const removeCustomText = (id: string) => updateFlavor({ customTexts: flavor.customTexts.filter(t => t.id !== id) });

  /* ════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════ */
  return (
    <div style={{
      display: "flex", flex: 1,
      fontFamily: "var(--font-sans)",
      overflow: "hidden",
    }}>

      {/* ════════════ CANVAS AREA ════════════ */}
      <div
        className="ds-canvas"
        style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}
      >
        {/* ── Active view ── */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {viewMode === "front"  && <ZoomableView minZoom={0.5} maxZoom={4}><FrontView flavor={flavor} maxH={400} /></ZoomableView>}
          {viewMode === "3d"     && <View3D flavor={flavor} />}
          {viewMode === "layout" && <ZoomableView minZoom={0.5} maxZoom={5}><LayoutView flavor={flavor} onUpdateArtTransform={updateArtTransform} onUpdateFlavor={updateFlavor} /></ZoomableView>}
          {viewMode === "range"  && <ZoomableView minZoom={0.5} maxZoom={2.5}><RangeView flavors={flavors} activeFlavor={activeFlavor} onSelect={setActiveFlavor} /></ZoomableView>}
        </div>

        {/* ── Onboarding choice overlay ── */}
        {wizardStep === "choice" && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 10,
            background: "rgba(237,233,223,0.90)",
            backdropFilter: "blur(3px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "var(--space-8)",
          }}>
            <div style={{
              background: "var(--color-surface)", borderRadius: "var(--radius-xl)",
              border: "1px solid var(--color-border)",
              padding: "var(--space-8)", maxWidth: 400, width: "100%",
              boxShadow: "var(--shadow-md)", textAlign: "center",
            }}>
              <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "var(--space-2)", fontFamily: "var(--font-sans)" }}>
                How would you like to start?
              </div>
              <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", margin: "0 0 var(--space-6)", fontFamily: "var(--font-sans)", lineHeight: 1.5 }}>
                We can walk you through the essentials, or you can dive in on your own.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <button
                  onClick={() => setWizardStep(1)}
                  className="ds-btn ds-btn-primary"
                  style={{ width: "100%", justifyContent: "space-between", padding: "14px 20px", fontSize: "14px", height: "auto" }}
                >
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 600 }}>Walk me through it</div>
                    <div style={{ fontSize: "12px", opacity: 0.8, marginTop: 2, fontWeight: 400 }}>Logo · color · flavor name — one at a time</div>
                  </div>
                  <ArrowRight size={16} style={{ flexShrink: 0 }} />
                </button>
                <button
                  onClick={() => setWizardStep(null)}
                  className="ds-btn ds-btn-secondary"
                  style={{ width: "100%", justifyContent: "space-between", padding: "14px 20px", fontSize: "14px", height: "auto" }}
                >
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontWeight: 600 }}>I'll explore on my own</div>
                    <div style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: 2, fontWeight: 400 }}>Open the full editor</div>
                  </div>
                  <ArrowRight size={16} style={{ flexShrink: 0 }} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── View-mode tab bar (matches Figma bottom position) ── */}
        <div style={{
          display: "flex", justifyContent: "center",
          padding: "var(--space-2) var(--space-5)",
          background: "var(--color-bg)", gap: "var(--space-1)",
          borderTop: "1px solid var(--color-border)",
        }}>
          {VIEW_BUTTONS.map(btn => (
            <button
              key={btn.key}
              onClick={() => setViewMode(btn.key)}
              title={btn.hint}
              style={{
                padding: "5px 18px", fontSize: "12px",
                fontFamily: "var(--font-sans)", fontWeight: 500,
                background: viewMode === btn.key ? "var(--color-text-primary)" : "var(--color-surface-raised)",
                color: viewMode === btn.key ? "#fff" : "var(--color-text-primary)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-sm)",
                cursor: "pointer", transition: "background .13s, color .13s",
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* ── Flavor strip ── */}
        <div style={{
          borderTop: "1px dashed var(--color-border)",
          padding: "var(--space-2) var(--space-5)",
          display: "flex", alignItems: "center", gap: "var(--space-3)",
          background: "var(--color-surface)", flexShrink: 0,
        }}>
          <span style={{ fontSize: "11px", color: "var(--color-text-secondary)", fontFamily: "var(--font-sans)", minWidth: 40 }}>
            Line:
          </span>

          <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", flex: 1, flexWrap: "wrap" }}>
            {flavors.map((f, i) => {
              const hex      = PACKAGE_COLORS.find(c => c.key === f.packageColor)?.hex ?? "#F5F2EB";
              const isActive = i === activeFlavor;
              const light    = ["teal","blue","black"].includes(f.packageColor);
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFlavor(i)}
                  title={f.name || f.letter}
                  style={{
                    width: "30px", height: "38px",
                    borderRadius: "var(--radius-sm)",
                    background: hex,
                    border: isActive ? "2px solid var(--color-text-primary)" : "1px solid var(--color-border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", flexShrink: 0,
                    transform: isActive ? "translateY(-2px)" : "none",
                    transition: "border .12s, transform .12s",
                  }}
                >
                  <span style={{ fontSize: "10px", fontWeight: 700, fontFamily: "var(--font-sans)", color: light ? "#fff" : "#1C1917" }}>
                    {f.letter}
                  </span>
                </button>
              );
            })}

            {flavors.length < totalSlots && (
              <button
                onClick={addFlavor}
                title="Add flavor"
                style={{
                  width: "30px", height: "38px", borderRadius: "var(--radius-sm)",
                  background: "transparent", border: "1px dashed var(--color-border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", flexShrink: 0,
                }}
              >
                <Plus size={11} style={{ color: "var(--color-text-muted)" }} />
              </button>
            )}

            <span style={{ fontSize: "11px", color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}>
              {flavors.length}/{totalSlots}
            </span>
          </div>

          {/* Flavor prev / next */}
          <button
            onClick={() => setActiveFlavor(v => Math.max(0, v - 1))}
            className="ds-btn ds-btn-secondary"
            style={{ fontSize: "11px", padding: "3px 10px" }}
            disabled={activeFlavor === 0}
          >
            <ChevronLeft size={12} /> Prev
          </button>
          <button
            onClick={() => setActiveFlavor(v => Math.min(flavors.length - 1, v + 1))}
            className="ds-btn ds-btn-secondary"
            style={{ fontSize: "11px", padding: "3px 10px" }}
            disabled={activeFlavor === flavors.length - 1}
          >
            Next <ChevronRight size={12} />
          </button>

        </div>
      </div>

      {/* ════════════ WIZARD PANEL (steps 1–3) ════════════ */}
      {(wizardStep === 1 || wizardStep === 2 || wizardStep === 3) && (
        <div style={{
          width: "288px", flexShrink: 0,
          borderLeft: "1px solid rgba(0,0,0,0.07)",
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          boxShadow: "-2px 0 16px rgba(0,0,0,0.04)",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>

            {/* Progress dots */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {([1, 2, 3] as const).map(n => (
                <div key={n} style={{
                  width: n === wizardStep ? 20 : 8, height: 8,
                  borderRadius: 4,
                  background: n <= (wizardStep as number) ? "var(--color-accent)" : "var(--color-border)",
                  transition: "width .2s, background .2s",
                  flexShrink: 0,
                }} />
              ))}
              <span style={{ fontSize: 11, color: "var(--color-text-muted)", marginLeft: 4, fontFamily: "var(--font-sans)" }}>
                Step {wizardStep} of 3
              </span>
            </div>

            {/* Step 1: Logo */}
            {wizardStep === 1 && (
              <>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "var(--font-sans)", marginBottom: "var(--space-1)" }}>
                    Upload your logo
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--color-text-secondary)", fontFamily: "var(--font-sans)", lineHeight: 1.5 }}>
                    It will appear on the front of your packaging.
                  </div>
                </div>
                <UploadZone
                  image={flavor.logoImage}
                  label="Drop logo here"
                  hint="PNG · SVG · transparent background"
                  inputRef={logoInputRef}
                  onChange={handleLogoUpload}
                  previewHeight={140}
                />
              </>
            )}

            {/* Step 2: Color */}
            {wizardStep === 2 && (
              <>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "var(--font-sans)", marginBottom: "var(--space-1)" }}>
                    Choose a package color
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--color-text-secondary)", fontFamily: "var(--font-sans)", lineHeight: 1.5 }}>
                    Pick the base color for your packaging line.
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "var(--space-3)" }}>
                  {PACKAGE_COLORS.map(c => (
                    <button
                      key={c.key}
                      onClick={() => updateFlavor({ packageColor: c.key as PackageColor })}
                      title={c.label}
                      style={{
                        aspectRatio: "1", borderRadius: "var(--radius-md)",
                        background: c.hex,
                        border: flavor.packageColor === c.key
                          ? "3px solid var(--color-text-primary)"
                          : "2px solid var(--color-border-light)",
                        cursor: "pointer", position: "relative",
                        transition: "border .12s, transform .1s",
                        transform: flavor.packageColor === c.key ? "scale(1.06)" : "scale(1)",
                        display: "flex", alignItems: "flex-end", justifyContent: "center",
                        paddingBottom: "var(--space-2)",
                      }}
                    >
                      {flavor.packageColor === c.key && (
                        <Check size={14} style={{ color: c.key === "cream" ? "#1C1917" : "#fff", position: "absolute", top: 6, right: 6 }} />
                      )}
                      <span style={{ fontSize: "10px", fontFamily: "var(--font-sans)", fontWeight: 600, color: c.key === "cream" ? "#1C1917" : "#fff", opacity: 0.9 }}>
                        {c.label}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Step 3: Name */}
            {wizardStep === 3 && (
              <>
                <div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "var(--font-sans)", marginBottom: "var(--space-1)" }}>
                    Name your flavor
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--color-text-secondary)", fontFamily: "var(--font-sans)", lineHeight: 1.5 }}>
                    Give this variant a name and a short tagline.
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontFamily: "var(--font-sans)", color: "var(--color-text-secondary)", marginBottom: "var(--space-1)" }}>Flavor name</label>
                    <input
                      className="ds-input"
                      value={flavor.name}
                      onChange={e => updateFlavor({ name: e.target.value })}
                      placeholder="e.g. Mango Ice"
                      style={{ fontSize: "15px", padding: "10px 12px" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontFamily: "var(--font-sans)", color: "var(--color-text-secondary)", marginBottom: "var(--space-1)" }}>Tagline</label>
                    <input
                      className="ds-input"
                      value={flavor.tagline}
                      onChange={e => updateFlavor({ tagline: e.target.value })}
                      placeholder="tropical · cooling"
                    />
                  </div>
                </div>
              </>
            )}

            <div style={{ flex: 1 }} />

            {/* Navigation */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "var(--space-3)", borderTop: "1px solid var(--color-border-light)" }}>
              <button
                onClick={() => setWizardStep(null)}
                style={{ fontSize: "12px", fontFamily: "var(--font-sans)", color: "var(--color-text-muted)", background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}
              >
                Skip all
              </button>
              <button
                onClick={() => setWizardStep(wizardStep === 3 ? null : (wizardStep + 1) as 2 | 3)}
                className="ds-btn ds-btn-primary"
                style={{ fontSize: "13px", gap: "var(--space-1)" }}
              >
                {wizardStep === 3 ? "Open full editor" : "Next"} <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════ RIGHT PANEL ════════════ */}
      {wizardStep === null && isPanelOpen && (
        <div style={{
          width: "288px", flexShrink: 0,
          borderLeft: "1px solid rgba(0,0,0,0.07)",
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          boxShadow: "-2px 0 16px rgba(0,0,0,0.04)",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}>

          {/* Panel header */}
          <div style={{
            padding: "var(--space-3) var(--space-4)",
            borderBottom: "1px solid var(--color-border)",
            display: "flex", alignItems: "center", gap: "var(--space-2)",
            flexShrink: 0,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "13px", fontFamily: "var(--font-sans)", fontWeight: 500, color: "var(--color-text-primary)" }}>
                {flavor.name || <span style={{ color: "var(--color-text-muted)" }}>Unnamed</span>}
              </div>
              <div style={{ fontSize: "10px", fontFamily: "var(--font-sans)", color: "var(--color-text-muted)", marginTop: "1px" }}>
                Flavor {activeFlavor + 1} of {flavors.length}
              </div>
            </div>

            {/* Duplicate */}
            <button
              onClick={duplicateFlavor}
              disabled={flavors.length >= totalSlots}
              title="Duplicate"
              style={{
                width: "28px", height: "28px", borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)", background: "var(--color-surface-raised)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: flavors.length >= totalSlots ? "not-allowed" : "pointer",
                opacity: flavors.length >= totalSlots ? 0.4 : 1,
              }}
            >
              <Copy size={12} style={{ color: "var(--color-text-secondary)" }} />
            </button>

            {/* Delete */}
            <button
              onClick={deleteFlavor}
              disabled={flavors.length <= 1}
              title={deleteConfirm ? "Click again to confirm" : "Delete flavor"}
              style={{
                width: "28px", height: "28px", borderRadius: "var(--radius-sm)",
                border: `1px solid ${deleteConfirm ? "var(--color-destructive, #ef4444)" : "var(--color-border)"}`,
                background: deleteConfirm ? "rgba(239,68,68,0.08)" : "var(--color-surface-raised)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: flavors.length <= 1 ? "not-allowed" : "pointer",
                opacity: flavors.length <= 1 ? 0.4 : 1,
                transition: "border-color .15s, background .15s",
              }}
            >
              <Trash2 size={12} style={{ color: deleteConfirm ? "#ef4444" : "var(--color-text-secondary)" }} />
            </button>

            {/* Collapse */}
            <button
              onClick={togglePanel}
              title="Collapse panel"
              style={{
                width: "20px", height: "20px", borderRadius: "var(--radius-full)",
                border: "1px solid var(--color-border)", background: "var(--color-surface-raised)",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}
            >
              <X size={11} />
            </button>
          </div>

          {deleteConfirm && (
            <div style={{
              padding: "var(--space-2) var(--space-4)",
              background: "rgba(212, 160, 26, 0.1)",
              borderBottom: "1px solid rgba(212, 160, 26, 0.2)",
              fontSize: "11px", fontFamily: "var(--font-sans)", color: "#8a6200",
              display: "flex", alignItems: "center", gap: "6px",
            }}>
              <AlertTriangle size={12} style={{ flexShrink: 0 }} />
              <span>Click the trash icon again to confirm deletion.</span>
            </div>
          )}

          {/* Panel tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg)", flexShrink: 0 }}>
            {PANEL_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setPanelTab(tab.key)}
                style={{
                  flex: 1, padding: "8px 4px",
                  fontSize: "11px", fontFamily: "var(--font-sans)", fontWeight: panelTab === tab.key ? 600 : 500,
                  background: panelTab === tab.key ? "var(--color-surface)" : "transparent",
                  color: panelTab === tab.key ? "var(--color-text-primary)" : "var(--color-text-muted)",
                  border: "none",
                  borderBottom: panelTab === tab.key ? "2px solid var(--color-accent)" : "2px solid transparent",
                  cursor: "pointer", transition: "color .13s, border-color .13s, background .13s",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Scrollable tab body ── */}
          <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-4)" }}>

            {/* ══ Design ══ */}
            {panelTab === "design" && (
              <>
                <SectionLabel>Template</SectionLabel>
                <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
                  {(["own-art", "illustration"] as Template[]).map(t => (
                    <button
                      key={t}
                      onClick={() => updateFlavor({ template: t })}
                      style={{
                        flex: 1, padding: "var(--space-3)",
                        border: flavor.template === t ? "2px solid var(--color-selected-ring)" : "1px solid var(--color-border)",
                        borderRadius: "var(--radius-md)", background: "var(--color-surface-raised)",
                        cursor: "pointer", transition: "border-color .15s",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
                      }}
                    >
                      <div style={{ width: "100%", height: "44px", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                        {t === "own-art"
                          ? <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #C94B2A 40%, #D4A01A 100%)" }} />
                          : <div style={{ width: "100%", height: "100%", background: "#F5E9E4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#E8C4C0" }} />
                            </div>
                        }
                      </div>
                      <span style={{ fontSize: "11px", fontFamily: "var(--font-sans)", color: "var(--color-text-primary)" }}>
                        {t === "own-art" ? "Own art" : "Illustration"}
                      </span>
                    </button>
                  ))}
                </div>

                {flavor.template === "own-art" && (
                  <>
                    <Divider />
                    <SectionLabel>Art file</SectionLabel>
                    <UploadZone image={flavor.artImage} label="Drop or click to upload" hint="PNG · JPG · SVG · up to 20 MB" inputRef={fileInputRef} onChange={handleArtUpload} onDrop={handleDropArt} previewHeight={72} />
                  </>
                )}

                <Divider />

                <SectionLabel>Package color</SectionLabel>
                <div style={{ display: "flex", gap: "6px", marginBottom: "var(--space-3)" }}>
                  {PACKAGE_COLORS.map(c => (
                    <button
                      key={c.key}
                      onClick={() => updateFlavor({ packageColor: c.key as PackageColor })}
                      title={c.label}
                      style={{
                        width: "24px", height: "24px", borderRadius: "var(--radius-full)",
                        background: c.hex,
                        border: flavor.packageColor === c.key ? "2px solid var(--color-text-primary)" : "1.5px solid var(--color-border-light)",
                        cursor: "pointer", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      {flavor.packageColor === c.key && <Check size={10} style={{ color: c.key === "cream" ? "#1C1917" : "#fff" }} />}
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: "10px", fontFamily: "var(--font-sans)", color: "var(--color-text-muted)", marginBottom: "var(--space-4)" }}>
                  {PACKAGE_COLORS.find(c => c.key === flavor.packageColor)?.label ?? "—"}
                </div>

                <SectionLabel>Title font</SectionLabel>
                <select
                  className="ds-input"
                  value={flavor.titleFont}
                  onChange={e => updateFlavor({ titleFont: e.target.value as TitleFont })}
                  style={{ appearance: "auto" }}
                >
                  {TITLE_FONTS.map(f => <option key={f.key} value={f.key}>{f.label}</option>)}
                </select>
              </>
            )}

            {/* ══ Content ══ */}
            {panelTab === "content" && (
              <>
                <div style={{ marginBottom: "var(--space-3)" }}>
                  <FieldLabel>Flavor name</FieldLabel>
                  <input className="ds-input" value={flavor.name} onChange={e => updateFlavor({ name: e.target.value })} placeholder="e.g. Mango Ice" />
                </div>
                <div style={{ marginBottom: "var(--space-3)" }}>
                  <FieldLabel>Tagline</FieldLabel>
                  <input className="ds-input" value={flavor.tagline} onChange={e => updateFlavor({ tagline: e.target.value })} placeholder="tropical · cooling" />
                </div>

                <Divider />
                <SectionLabel>Formulation</SectionLabel>
                <div style={{ marginBottom: "var(--space-3)" }}>
                  <FieldLabel>Strength (mg)</FieldLabel>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {STRENGTHS.map(s => (
                      <button
                        key={s}
                        onClick={() => updateFlavor({ strength: s })}
                        style={{
                          width: "34px", height: "34px", borderRadius: "var(--radius-full)",
                          border: flavor.strength === s ? "2px solid var(--color-text-primary)" : "1px solid var(--color-border)",
                          background: flavor.strength === s ? "var(--color-text-primary)" : "var(--color-surface-raised)",
                          color: flavor.strength === s ? "#fff" : "var(--color-text-primary)",
                          fontSize: "11px", fontFamily: "var(--font-sans)", fontWeight: 500,
                          cursor: "pointer", transition: "background .13s, border .13s, color .13s",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "var(--space-4)" }}>
                  <FieldLabel>Type</FieldLabel>
                  <div style={{ display: "flex", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--color-surface-raised)" }}>
                    {(["freebase", "salt"] as FlavorType[]).map(t => (
                      <button
                        key={t}
                        onClick={() => updateFlavor({ type: t })}
                        style={{
                          flex: 1, padding: "6px", fontSize: "12px", fontFamily: "var(--font-sans)", fontWeight: 500,
                          background: flavor.type === t ? "var(--color-text-primary)" : "transparent",
                          color: flavor.type === t ? "#fff" : "var(--color-text-primary)",
                          border: "none", cursor: "pointer", transition: "background .13s, color .13s",
                        }}
                      >
                        {t === "freebase" ? "Freebase" : "Salt Nic"}
                      </button>
                    ))}
                  </div>
                </div>

                <Divider />
                <SectionLabel>Branding</SectionLabel>
                <UploadZone image={flavor.logoImage} label="Upload logo" hint="PNG · SVG · transparent background" inputRef={logoInputRef} onChange={handleLogoUpload} previewHeight={52} />
                {flavor.logoImage && (
                  <button
                    onClick={() => updateFlavor({ logoImage: null })}
                    style={{
                      width: "100%", padding: "4px", marginTop: "-8px", marginBottom: "var(--space-3)",
                      fontSize: "10px", fontFamily: "var(--font-sans)", color: "var(--color-text-muted)",
                      background: "transparent", border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-sm)", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "4px",
                    }}
                  >
                    <Trash2 size={9} /> Remove logo
                  </button>
                )}

                <Divider />
                <SectionLabel>Compliance</SectionLabel>
                <div style={{ fontSize: "10px", fontFamily: "var(--font-sans)", color: "var(--color-text-muted)", marginBottom: "var(--space-2)", lineHeight: 1.4 }}>
                  Shown on front &amp; back panels. Use ↵ for a line break.
                </div>
                <textarea
                  className="ds-input"
                  value={flavor.healthWarningText}
                  onChange={e => updateFlavor({ healthWarningText: e.target.value })}
                  rows={4}
                  style={{ resize: "vertical", fontFamily: "var(--font-sans)", lineHeight: 1.5, width: "100%" }}
                  placeholder="WARNING: …"
                />
              </>
            )}

            {/* ══ Layout ══ */}
            {panelTab === "layout" && (
              <>
                {/* Content cluster */}
                <div style={{ marginBottom: "var(--space-4)", padding: "var(--space-3)", background: "var(--color-surface-raised)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-light)" }}>
                  <SectionLabel>Content cluster</SectionLabel>
                  <div style={{ fontSize: "10px", fontFamily: "var(--font-sans)", color: "var(--color-text-muted)", marginBottom: "var(--space-3)", lineHeight: 1.4 }}>
                    Moves logo, name, and tagline together. Also draggable in Layout view.
                  </div>
                  <div style={{ marginBottom: "var(--space-2)" }}>
                    <FieldLabel>Horizontal: {flavor.contentX}%</FieldLabel>
                    <input type="range" min="0" max="100" value={flavor.contentX} onChange={e => updateFlavor({ contentX: Number(e.target.value) })} style={{ width: "100%" }} />
                  </div>
                  <div>
                    <FieldLabel>Vertical: {flavor.contentY}%</FieldLabel>
                    <input type="range" min="0" max="100" value={flavor.contentY} onChange={e => updateFlavor({ contentY: Number(e.target.value) })} style={{ width: "100%" }} />
                  </div>
                </div>

                {/* Logo size */}
                <div style={{ marginBottom: "var(--space-4)", padding: "var(--space-3)", background: "var(--color-surface-raised)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-light)" }}>
                  <SectionLabel>Logo size</SectionLabel>
                  <div style={{ marginBottom: "var(--space-2)" }}>
                    <FieldLabel>Width: {flavor.logoWidth}px</FieldLabel>
                    <input type="range" min="20" max="150" value={flavor.logoWidth} onChange={e => updateFlavor({ logoWidth: Number(e.target.value) })} style={{ width: "100%" }} />
                  </div>
                  <div>
                    <FieldLabel>Height: {flavor.logoHeight}px</FieldLabel>
                    <input type="range" min="20" max="150" value={flavor.logoHeight} onChange={e => updateFlavor({ logoHeight: Number(e.target.value) })} style={{ width: "100%" }} />
                  </div>
                </div>

                {/* Skull icon */}
                <div style={{ padding: "var(--space-3)", background: "var(--color-surface-raised)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border-light)" }}>
                  <SectionLabel>Skull hazard icon · back panel</SectionLabel>
                  <div
                    onClick={() => skullIconInputRef.current?.click()}
                    style={{
                      border: "1px dashed var(--color-border)", borderRadius: "var(--radius-sm)",
                      padding: "var(--space-2)", textAlign: "center", cursor: "pointer",
                      background: "var(--color-surface)", marginBottom: "var(--space-3)",
                    }}
                  >
                    {flavor.skullIconImage ? (
                      <><img src={flavor.skullIconImage} alt="" style={{ width: "100%", maxHeight: "36px", objectFit: "contain" }} />
                        <div style={{ fontSize: "9px", color: "var(--color-text-muted)", marginTop: "4px", fontFamily: "var(--font-sans)" }}>click to replace</div></>
                    ) : (
                      <><Upload size={12} style={{ color: "var(--color-text-muted)", display: "block", margin: "0 auto 4px" }} />
                        <div style={{ fontSize: "10px", fontFamily: "var(--font-sans)", color: "var(--color-text-primary)" }}>Custom icon</div>
                        <div style={{ fontSize: "9px", color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}>or use default skull</div></>
                    )}
                    <input ref={skullIconInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleSkullIconUpload} />
                  </div>
                  {flavor.skullIconImage && (
                    <button onClick={() => updateFlavor({ skullIconImage: null })} style={{ width: "100%", padding: "3px", marginBottom: "var(--space-3)", fontSize: "10px", fontFamily: "var(--font-sans)", color: "var(--color-text-muted)", background: "transparent", border: "1px solid var(--color-border)", borderRadius: "var(--radius-sm)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                      <Trash2 size={9} /> Use default icon
                    </button>
                  )}
                  <div style={{ marginBottom: "var(--space-2)" }}>
                    <FieldLabel>Horizontal: {Math.round(flavor.skullIconX)}%</FieldLabel>
                    <input type="range" min="0" max="100" value={flavor.skullIconX} onChange={e => updateFlavor({ skullIconX: Number(e.target.value) })} style={{ width: "100%" }} />
                  </div>
                  <div>
                    <FieldLabel>Vertical: {Math.round(flavor.skullIconY)}%</FieldLabel>
                    <input type="range" min="0" max="100" value={flavor.skullIconY} onChange={e => updateFlavor({ skullIconY: Number(e.target.value) })} style={{ width: "100%" }} />
                  </div>
                </div>
              </>
            )}

            {/* ══ Text+ ══ */}
            {panelTab === "text" && (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
                  <SectionLabel>Custom text overlays</SectionLabel>
                  <button
                    onClick={addCustomText}
                    style={{
                      padding: "3px 8px", fontSize: "10px", fontFamily: "var(--font-sans)", fontWeight: 500,
                      background: "var(--color-surface-raised)", border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-sm)", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: "4px", color: "var(--color-text-primary)",
                    }}
                  >
                    <Plus size={10} /> Add
                  </button>
                </div>

                {flavor.customTexts.length === 0 ? (
                  <div style={{ padding: "var(--space-5)", textAlign: "center", fontSize: "11px", fontFamily: "var(--font-sans)", color: "var(--color-text-muted)", border: "1px dashed var(--color-border)", borderRadius: "var(--radius-md)", background: "var(--color-surface-raised)", lineHeight: 1.5 }}>
                    No custom text yet.<br /><span style={{ fontSize: "10px" }}>Position is % of front panel.</span>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                    {flavor.customTexts.map((txt, idx) => (
                      <div key={txt.id} style={{ padding: "var(--space-3)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", background: "var(--color-surface-raised)" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                          <span style={{ fontSize: "10px", fontFamily: "var(--font-sans)", color: "var(--color-text-muted)", fontWeight: 600 }}>Text {idx + 1}</span>
                          <button onClick={() => removeCustomText(txt.id)} style={{ width: "18px", height: "18px", borderRadius: "var(--radius-full)", border: "1px solid var(--color-border)", background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                            <X size={9} />
                          </button>
                        </div>
                        <div style={{ marginBottom: "var(--space-2)" }}>
                          <input className="ds-input" value={txt.text} onChange={e => updateCustomText(txt.id, { text: e.target.value })} placeholder="Text content…" />
                        </div>
                        <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-2)" }}>
                          <div style={{ flex: 1 }}>
                            <FieldLabel>Font</FieldLabel>
                            <select className="ds-input" value={txt.fontFamily} onChange={e => updateCustomText(txt.id, { fontFamily: e.target.value as TitleFont })} style={{ appearance: "auto", fontSize: "10px" }}>
                              {TITLE_FONTS.map(f => <option key={f.key} value={f.key}>{f.label.split("—")[0].trim()}</option>)}
                            </select>
                          </div>
                          <div style={{ width: "64px" }}>
                            <FieldLabel>Size</FieldLabel>
                            <input className="ds-input" type="number" value={txt.fontSize} min={8} max={72} onChange={e => updateCustomText(txt.id, { fontSize: Number(e.target.value) })} style={{ textAlign: "center" }} />
                          </div>
                          <div style={{ width: "44px" }}>
                            <FieldLabel>Color</FieldLabel>
                            <input className="ds-input" type="color" value={txt.color} onChange={e => updateCustomText(txt.id, { color: e.target.value })} style={{ height: "32px", padding: "2px" }} />
                          </div>
                        </div>
                        <div style={{ marginBottom: "var(--space-1)" }}>
                          <FieldLabel>X: {txt.x}%</FieldLabel>
                          <input type="range" min="0" max="100" value={txt.x} onChange={e => updateCustomText(txt.id, { x: Number(e.target.value) })} style={{ width: "100%" }} />
                        </div>
                        <div>
                          <FieldLabel>Y: {txt.y}%</FieldLabel>
                          <input type="range" min="0" max="100" value={txt.y} onChange={e => updateCustomText(txt.id, { y: Number(e.target.value) })} style={{ width: "100%" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
