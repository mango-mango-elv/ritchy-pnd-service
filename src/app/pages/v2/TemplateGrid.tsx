import React from "react";

export interface Template {
  id: string;
  label: string;
  aspectRatio: number;
  comingSoon?: boolean;
}

export const TEMPLATES: Template[] = [
  { id: "t1-flavor",   label: "Flavor",   aspectRatio: 164 / 363 },
  { id: "t2-centered", label: "Centered", aspectRatio: 164 / 363 },
  { id: "t3-split",    label: "Split",    aspectRatio: 164 / 363 },
  { id: "t4-badge",    label: "Badge",    aspectRatio: 164 / 363 },
  { id: "t5-vertical", label: "Vertical", aspectRatio: 164 / 363 },
];

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

export function TemplateGrid({ selected, onSelect }: Props) {
  return (
    <div style={{
      display: "flex", gap: "var(--space-3)",
      overflowX: "auto", paddingBottom: "4px",
    }}>
      {TEMPLATES.map(t => {
        const isSelected = selected === t.id;
        const w = 56;
        const h = Math.min(Math.round(w / t.aspectRatio), 88);
        return (
          <button
            key={t.id}
            onClick={() => !t.comingSoon && onSelect(t.id)}
            title={t.comingSoon ? "Coming soon" : t.label}
            style={{
              flexShrink: 0,
              display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
              padding: "var(--space-2)",
              background: "transparent",
              border: isSelected ? "2px solid #111111" : "2px solid transparent",
              borderRadius: "var(--radius-md)",
              cursor: t.comingSoon ? "default" : "pointer",
              opacity: t.comingSoon ? 0.4 : 1,
            }}
          >
            <div style={{
              width: `${w}px`, height: `${h}px`,
              background: isSelected ? "rgba(17,17,17,0.10)" : "rgba(0,0,0,0.07)",
              borderRadius: "4px",
              transition: "background .15s",
            }} />
            <span style={{
              fontSize: "10px", fontFamily: "var(--font-sans)",
              color: isSelected ? "#111111" : "var(--color-text-muted)",
              fontWeight: isSelected ? 600 : 400,
              whiteSpace: "nowrap",
            }}>
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
