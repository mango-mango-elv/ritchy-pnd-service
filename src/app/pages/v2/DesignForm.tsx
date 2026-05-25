import React, { useRef, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import type { DesignState } from "./DesignPageV2";

export interface Background {
  id: string;
  label: string;
  style: string;
}

export const BACKGROUNDS: Background[] = [
  { id: "dark-jungle", label: "Dark Jungle", style: "linear-gradient(135deg, #1a2a1a 0%, #2d4a2d 50%, #1a3a2a 100%)" },
  { id: "neon-city",   label: "Neon City",   style: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" },
  { id: "sunset",      label: "Sunset",      style: "linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #fda085 100%)" },
  { id: "arctic",      label: "Arctic",      style: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"              },
  { id: "marble",      label: "Marble",      style: "linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 40%, #d5d5d5 100%)" },
  { id: "smoke",       label: "Smoke",       style: "linear-gradient(135deg, #2c3e50 0%, #636e72 50%, #bdc3c7 100%)" },
  { id: "geometric",   label: "Geometric",   style: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"              },
  { id: "bokeh",       label: "Bokeh",       style: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)"              },
];

const ACCENT_SWATCHES = [
  { id: "white",  color: "#ffffff", label: "White"      },
  { id: "black",  color: "#111111", label: "Black"      },
  { id: "red",    color: "#c0392b", label: "Deep Red"   },
  { id: "green",  color: "#27ae60", label: "Forest"     },
  { id: "blue",   color: "#1a4a8a", label: "Night Blue" },
  { id: "gold",   color: "#f39c12", label: "Gold"       },
  { id: "coral",  color: "#e74c3c", label: "Coral"      },
  { id: "purple", color: "#8e44ad", label: "Purple"     },
];

interface Props {
  design: DesignState;
  onChange: (patch: Partial<DesignState>) => void;
}

export function DesignForm({ design, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [generatingAI, setGeneratingAI] = useState(false);

  const handleLogoFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => onChange({ logoDataUrl: e.target?.result as string });
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) handleLogoFile(file);
  };

  const handleAIGenerate = () => {
    setGeneratingAI(true);
    setTimeout(() => {
      const pick = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
      onChange({ background: pick });
      setGeneratingAI(false);
    }, 1500);
  };

  return (
    <div style={{ display: "grid", gap: "var(--space-4)" }}>

      {/* Brand & Text */}
      <FormSection title="Brand & Text">
        <Field label="Brand Name">
          <input
            className="ds-input"
            placeholder="Your brand name"
            value={design.brandName}
            onChange={e => onChange({ brandName: e.target.value })}
          />
        </Field>
        <Field label="Flavor Name">
          <input
            className="ds-input"
            placeholder="e.g. Passion Fruit"
            value={design.flavorName}
            onChange={e => onChange({ flavorName: e.target.value })}
          />
        </Field>
        <Field label="Tagline (optional)">
          <input
            className="ds-input"
            placeholder="e.g. Premium Nicotine Salt"
            value={design.tagline}
            onChange={e => onChange({ tagline: e.target.value })}
          />
        </Field>
        <Field label="Logo (optional)">
          <div
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            style={{
              border: "1.5px dashed var(--color-border)",
              borderRadius: "var(--radius-md)",
              padding: "var(--space-4)",
              textAlign: "center",
              cursor: "pointer",
              color: "var(--color-text-muted)",
              fontSize: "12px",
              background: "rgba(0,0,0,0.02)",
              fontFamily: "var(--font-sans)",
            }}
          >
            {design.logoDataUrl
              ? <img src={design.logoDataUrl} alt="logo" style={{ maxHeight: "48px", maxWidth: "100%", objectFit: "contain" }} />
              : <>📷 Drag &amp; Drop or Click to Upload</>
            }
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoFile(f); }}
          />
        </Field>
      </FormSection>

      {/* Colors */}
      <FormSection title="Accent Color">
        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", alignItems: "center" }}>
          {ACCENT_SWATCHES.map(s => (
            <button
              key={s.id}
              title={s.label}
              onClick={() => onChange({ accentColor: s.color })}
              style={{
                width: "28px", height: "28px",
                borderRadius: "50%",
                background: s.color,
                border: design.accentColor === s.color ? "3px solid #2563eb" : "2px solid rgba(0,0,0,0.12)",
                cursor: "pointer", flexShrink: 0,
                outline: s.color === "#ffffff" ? "1px solid rgba(0,0,0,0.08)" : "none",
              }}
            />
          ))}
          <input
            type="color"
            value={design.accentColor ?? "#ffffff"}
            onChange={e => onChange({ accentColor: e.target.value })}
            title="Custom color"
            style={{
              width: "28px", height: "28px",
              borderRadius: "50%",
              border: "2px solid rgba(0,0,0,0.12)",
              cursor: "pointer", padding: 0,
              background: "none",
            }}
          />
        </div>
      </FormSection>

      {/* Background */}
      <FormSection title="Background">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "var(--space-2)",
        }}>
          {BACKGROUNDS.map(bg => (
            <button
              key={bg.id}
              title={bg.label}
              onClick={() => onChange({ background: bg })}
              style={{
                height: "44px",
                borderRadius: "var(--radius-md)",
                background: bg.style,
                border: design.background?.id === bg.id ? "3px solid #2563eb" : "2px solid transparent",
                cursor: "pointer",
                transition: "border-color .15s",
              }}
            />
          ))}
        </div>

        <button
          onClick={handleAIGenerate}
          disabled={generatingAI}
          style={{
            marginTop: "var(--space-3)",
            width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            padding: "9px 16px",
            background: "transparent",
            border: "1.5px dashed #2563eb",
            borderRadius: "var(--radius-md)",
            color: "#2563eb",
            fontSize: "13px", fontFamily: "var(--font-sans)", fontWeight: 500,
            cursor: generatingAI ? "wait" : "pointer",
            opacity: generatingAI ? 0.7 : 1,
          }}
        >
          {generatingAI
            ? <><Loader2 size={13} className="animate-spin" /> Generating…</>
            : <><Sparkles size={13} /> Generate with AI</>
          }
        </button>
      </FormSection>

    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{
      background: "rgba(255,255,255,0.82)",
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      border: "1px solid rgba(0,0,0,0.07)",
      borderRadius: "var(--radius-lg)",
      padding: "var(--space-4)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.90)",
    }}>
      <h3 style={{ margin: "0 0 var(--space-3)", fontSize: "13px", fontWeight: 600, color: "var(--color-text-primary)" }}>
        {title}
      </h3>
      <div style={{ display: "grid", gap: "var(--space-3)" }}>{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", marginBottom: "5px", fontSize: "11px", color: "var(--color-text-secondary)", fontFamily: "var(--font-sans)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
