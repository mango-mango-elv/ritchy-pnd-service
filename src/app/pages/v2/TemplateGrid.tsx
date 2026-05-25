import React from "react";

export interface Template {
  id: string;
  label: string;
  aspectRatio: number;
}

export const TEMPLATES: Template[] = [
  { id: "standard-box", label: "Standard Box", aspectRatio: 3 / 4   },
  { id: "tall-box",     label: "Tall Box",     aspectRatio: 2 / 5   },
  { id: "wide-box",     label: "Wide Box",     aspectRatio: 16 / 9  },
  { id: "bottle",       label: "Bottle",       aspectRatio: 1 / 3   },
  { id: "slim-pouch",   label: "Slim Pouch",   aspectRatio: 1 / 4   },
  { id: "wide-bex",     label: "Wide Bex",     aspectRatio: 4 / 3   },
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
            onClick={() => onSelect(t.id)}
            style={{
              flexShrink: 0,
              display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
              padding: "var(--space-2)",
              background: "transparent",
              border: isSelected ? "2px solid #2563eb" : "2px solid transparent",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
            }}
          >
            <div style={{
              width: `${w}px`, height: `${h}px`,
              background: isSelected ? "rgba(37,99,235,0.15)" : "rgba(0,0,0,0.09)",
              borderRadius: "4px",
              transition: "background .15s",
            }} />
            <span style={{
              fontSize: "10px", fontFamily: "var(--font-sans)",
              color: isSelected ? "#2563eb" : "var(--color-text-muted)",
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
