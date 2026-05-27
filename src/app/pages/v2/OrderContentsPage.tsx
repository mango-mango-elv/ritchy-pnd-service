import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router";

type Category = "All" | "Tobacco" | "Menthol" | "Fruit" | "Dessert" | "Beverage" | "Ice";

interface Flavor { name: string; category: Exclude<Category, "All">; }

const FLAVORS: Flavor[] = [
  { name: "Classic Tobacco",  category: "Tobacco"  },
  { name: "Virginia Tobacco", category: "Tobacco"  },
  { name: "Honey Tobacco",    category: "Tobacco"  },
  { name: "Cream Tobacco",    category: "Tobacco"  },
  { name: "Menthol",          category: "Menthol"  },
  { name: "Spearmint",        category: "Menthol"  },
  { name: "Peppermint",       category: "Menthol"  },
  { name: "Ice Mint",         category: "Ice"      },
  { name: "Dark Berry",       category: "Ice"      },
  { name: "Passion Fruit",    category: "Fruit"    },
  { name: "Mango",            category: "Fruit"    },
  { name: "Watermelon",       category: "Fruit"    },
  { name: "Blueberry",        category: "Fruit"    },
  { name: "Strawberry",       category: "Fruit"    },
  { name: "Peach",            category: "Fruit"    },
  { name: "Grape",            category: "Fruit"    },
  { name: "Raspberry",        category: "Fruit"    },
  { name: "Lemon",            category: "Fruit"    },
  { name: "Vanilla Custard",  category: "Dessert"  },
  { name: "Cheesecake",       category: "Dessert"  },
  { name: "Caramel",          category: "Dessert"  },
  { name: "Hazelnut",         category: "Dessert"  },
  { name: "Coffee",           category: "Beverage" },
  { name: "Cola",             category: "Beverage" },
  { name: "Lemonade",         category: "Beverage" },
  { name: "Energy Drink",     category: "Beverage" },
];

const CATEGORIES: Category[] = ["All", "Tobacco", "Menthol", "Fruit", "Dessert", "Beverage", "Ice"];
const NIC_TYPES = [
  { id: "salt",     label: "Nicotine Salt", note: "Smooth hit, higher nic" },
  { id: "freebase", label: "Free Base",     note: "Classic throat hit"     },
];
const STRENGTHS  = ["0 mg", "3 mg", "6 mg", "12 mg", "20 mg"];
const SIZES      = ["10 ml", "30 ml", "60 ml", "100 ml"];
const QUANTITIES = [500, 1000, 5000, 10000, 20000];

const APPROX_UNIT_PRICE = 2.4;

export function OrderContentsPage() {
  const navigate = useNavigate();
  const [category, setCategory]   = useState<Category>("All");
  const [flavor, setFlavor]       = useState("Passion Fruit");
  const [customFlavor, setCustom] = useState("");
  const [nicType, setNicType]     = useState("salt");
  const [strength, setStrength]   = useState("20 mg");
  const [size, setSize]           = useState("10 ml");
  const [qty, setQty]             = useState(1000);

  const filtered = useMemo(
    () => category === "All" ? FLAVORS : FLAVORS.filter(f => f.category === category),
    [category],
  );

  const estTotal = qty * APPROX_UNIT_PRICE;

  const handleContinue = () => {
    sessionStorage.setItem("ritchy-v2-order", JSON.stringify({
      flavor:   flavor === "Custom" ? customFlavor : flavor,
      nicType, strength, size, qty,
      estTotal,
    }));
    navigate("/design");
  };

  return (
    <div className="v2-page-container">
      <div style={{ maxWidth: "640px", margin: "0 auto", display: "grid", gap: "var(--space-4)" }}>

        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
            Step 1 of 5
          </div>
          <h1 style={{ margin: "6px 0 0", fontSize: "26px", color: "var(--color-text-primary)" }}>Order Contents</h1>
          <p style={{ margin: "6px 0 0", color: "var(--color-text-secondary)", fontSize: "14px" }}>
            Choose your format, flavors, and nicotine options.
          </p>
        </div>

        {/* Nicotine type */}
        <Card title="Nicotine Type">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-2)" }}>
            {NIC_TYPES.map(t => {
              const active = nicType === t.id;
              return (
                <button key={t.id} onClick={() => setNicType(t.id)} style={{
                  padding: "12px 14px",
                  border: active ? "2px solid #2563eb" : "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  background: active ? "rgba(37,99,235,0.06)" : "rgba(255,255,255,0.5)",
                  cursor: "pointer", textAlign: "left",
                  display: "flex", flexDirection: "column", gap: "2px",
                  fontFamily: "var(--font-sans)",
                }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: active ? "#2563eb" : "var(--color-text-primary)" }}>
                    {t.label}
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>
                    {t.note}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Flavor with categories */}
        <Card title="Flavor">
          <div style={{
            display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "6px",
            marginBottom: "var(--space-3)",
          }}>
            {CATEGORIES.map(c => {
              const active = category === c;
              return (
                <button key={c} onClick={() => setCategory(c)} style={{
                  padding: "4px 12px",
                  background: active ? "#111111" : "transparent",
                  color: active ? "#fff" : "var(--color-text-secondary)",
                  border: active ? "1px solid #111111" : "1px solid var(--color-border)",
                  borderRadius: "var(--radius-full)",
                  fontSize: "12px", fontFamily: "var(--font-sans)", cursor: "pointer",
                  whiteSpace: "nowrap", flexShrink: 0,
                  fontWeight: active ? 600 : 400,
                }}>
                  {c}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
            {filtered.map(f => (
              <PillBtn key={f.name} label={f.name} active={flavor === f.name} onClick={() => setFlavor(f.name)} />
            ))}
            <PillBtn label="+ Custom" active={flavor === "Custom"} onClick={() => setFlavor("Custom")} />
          </div>
          {flavor === "Custom" && (
            <input
              className="ds-input"
              style={{ marginTop: "var(--space-3)", width: "100%" }}
              placeholder="Enter your flavor name…"
              value={customFlavor}
              onChange={e => setCustom(e.target.value)}
            />
          )}
        </Card>

        <Card title="Nicotine Strength">
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {STRENGTHS.map(s => <OptionBtn key={s} label={s} active={strength === s} onClick={() => setStrength(s)} />)}
          </div>
        </Card>

        <Card title="Bottle Size">
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {SIZES.map(s => <OptionBtn key={s} label={s} active={size === s} onClick={() => setSize(s)} />)}
          </div>
        </Card>

        <Card title="Quantity">
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            {QUANTITIES.map(q => (
              <OptionBtn key={q} label={q.toLocaleString()} active={qty === q} onClick={() => setQty(q)} />
            ))}
          </div>
          <p style={{ margin: "var(--space-3) 0 0", fontSize: "11px", color: "var(--color-text-muted)" }}>
            Per-unit price drops with volume. Minimum order: 500 units.
          </p>
        </Card>

        {/* Estimated total */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          padding: "var(--space-4) var(--space-5)",
          background: "rgba(17,17,17,0.04)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}>
          <div>
            <div style={{ fontSize: "11px", color: "var(--color-text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Estimated total
            </div>
            <div style={{ fontSize: "10px", color: "var(--color-text-muted)", marginTop: "2px" }}>
              excl. delivery &amp; taxes
            </div>
          </div>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--color-text-primary)" }}>
            €{estTotal.toLocaleString()}
          </div>
        </div>

        <div className="v2-nav-footer">
          <button onClick={() => navigate("/")} className="v2-footer-btn v2-footer-btn-secondary">← Back</button>
          <button onClick={handleContinue} className="v2-footer-btn v2-footer-btn-primary">Continue to Design →</button>
        </div>

      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{
      background: "rgba(255,255,255,0.82)",
      backdropFilter: "blur(20px) saturate(180%)",
      WebkitBackdropFilter: "blur(20px) saturate(180%)",
      border: "1px solid rgba(0,0,0,0.07)",
      borderRadius: "var(--radius-lg)",
      padding: "var(--space-5)",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.90)",
    }}>
      <h2 style={{ margin: "0 0 var(--space-3)", fontSize: "13px", fontWeight: 600, color: "var(--color-text-primary)" }}>{title}</h2>
      {children}
    </section>
  );
}

function PillBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: "6px 12px",
      border: active ? "2px solid #2563eb" : "1px solid var(--color-border)",
      borderRadius: "var(--radius-full)",
      background: active ? "rgba(37,99,235,0.08)" : "transparent",
      color: active ? "#2563eb" : "var(--color-text-secondary)",
      fontSize: "12px", fontFamily: "var(--font-sans)", cursor: "pointer",
      fontWeight: active ? 600 : 400,
    }}>
      {label}
    </button>
  );
}

function OptionBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 16px",
      border: active ? "2px solid #2563eb" : "1px solid var(--color-border)",
      borderRadius: "var(--radius-md)",
      background: active ? "rgba(37,99,235,0.08)" : "transparent",
      color: active ? "#2563eb" : "var(--color-text-secondary)",
      fontSize: "13px", fontFamily: "var(--font-sans)", cursor: "pointer",
      fontWeight: active ? 600 : 400,
    }}>
      {label}
    </button>
  );
}
