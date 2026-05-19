import React, { useState, useCallback, useRef } from "react";
import { RotateCcw, Save, Check, PanelRightClose, PanelRightOpen, ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { PackagingEditor } from "../components/PackagingEditor";
import { useHeaderActions } from "../components/AppShell";

/* ─────────────────────────────────────────────────────────────
   DesignPage — mounts PackagingEditor and wires its action
   callbacks (Reset / Save draft / Panel toggle) into the
   shared AppShell header via useHeaderActions.
─────────────────────────────────────────────────────────────*/

export function DesignPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialDraftId =
    typeof location.state === "object" &&
    location.state !== null &&
    "draftId" in location.state &&
    typeof (location.state as { draftId?: unknown }).draftId === "string"
      ? ((location.state as { draftId: string }).draftId)
      : undefined;

  /* Stable callback refs so PackagingEditor's useEffect fires once */
  const resetFnRef      = useRef<() => void>(() => {});
  const saveFnRef       = useRef<() => void>(() => {});
  const togglePanelRef  = useRef<() => void>(() => {});

  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [savedAt,     setSavedAt]     = useState<number | null>(null);

  /* PackagingEditor calls this whenever its internal state changes */
  const handleRegister = useCallback((cbs: {
    reset:       () => void;
    save:        () => void;
    togglePanel: () => void;
    isPanelOpen: boolean;
  }) => {
    resetFnRef.current     = cbs.reset;
    saveFnRef.current      = cbs.save;
    togglePanelRef.current = cbs.togglePanel;
    setIsPanelOpen(cbs.isPanelOpen);
  }, []);

  const handleSave = useCallback(() => {
    saveFnRef.current();
    setSavedAt(Date.now());
    setTimeout(() => setSavedAt(null), 2000);
  }, []);

  const handleContinue = useCallback(() => {
    navigate("/legal");
  }, [navigate]);

  /* Inject right-side header buttons into AppShell */
  useHeaderActions(
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
      <button
        type="button"
        onClick={() => resetFnRef.current()}
        className="ds-btn ds-btn-ghost"
        style={{ fontSize: "12px" }}
        title="Reset to defaults"
      >
        <RotateCcw size={12} /> Reset
      </button>

      <button
        type="button"
        onClick={handleSave}
        className="ds-btn ds-btn-secondary"
        style={{ fontSize: "12px", minWidth: 90, transition: "all .15s" }}
      >
        {savedAt ? <><Check size={12} /> Saved!</> : <><Save size={12} /> Save draft</>}
      </button>

      <button
        type="button"
        onClick={() => togglePanelRef.current()}
        className="ds-btn ds-btn-ghost"
        style={{ fontSize: "12px" }}
        title={isPanelOpen ? "Collapse panel" : "Expand panel"}
      >
        {isPanelOpen ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
      </button>

      <div style={{ width: "1px", height: "20px", background: "var(--color-border)", margin: "0 var(--space-1)" }} />

      <button
        type="button"
        onClick={handleContinue}
        className="ds-btn ds-btn-primary"
        style={{ fontSize: "12px", gap: "var(--space-1)" }}
      >
        Continue to Legal <ArrowRight size={12} />
      </button>
    </div>
  );

  return (
    <PackagingEditor
      onRegisterCallbacks={handleRegister}
      onGoToNextStage={handleContinue}
      initialDraftId={initialDraftId}
    />
  );
}
