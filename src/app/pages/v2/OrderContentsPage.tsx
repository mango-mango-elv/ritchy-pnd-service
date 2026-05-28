import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";

// Types
export interface SKUItem {
  id: string;
  flavor: string;
  flavorName: string;
  flavorGradient: [string, string];
  nicotineType: "salt" | "freebase";
  strength: string;
  quantity: number;
}

interface SubscriptionPlan {
  key: string;
  name: string;
  annualUnits: number;
  pricePerUnit: number;
  spotPrice: number;
  breakeven: number;
  pullsPerYear: number;
  sliderValue: number;
}

// 27 Premium Flavors list from eliquid.ai
const FLAVORS = [
  { id: "classic_tobacco", name: "Classic Tobacco", category: "Tobacco", gradient: ["#8B5E3C", "#5C3D2E"] },
  { id: "virginia_tobacco", name: "Virginia Tobacco", category: "Tobacco", gradient: ["#B8860B", "#8B5E3C"] },
  { id: "cream_tobacco", name: "Cream Tobacco", category: "Tobacco", gradient: ["#D2B48C", "#8B6914"] },
  { id: "honey_tobacco", name: "Honey Tobacco", category: "Tobacco", gradient: ["#DAA520", "#8B5E3C"] },
  { id: "spearmint", name: "Spearmint", category: "Menthol", gradient: ["#00C896", "#00875A"] },
  { id: "peppermint", name: "Peppermint", category: "Menthol", gradient: ["#00B4D8", "#0077B6"] },
  { id: "menthol", name: "Menthol", category: "Menthol", gradient: ["#48CAE4", "#00B4D8"] },
  { id: "ice_mint", name: "Ice Mint", category: "Menthol", gradient: ["#ADE8F4", "#48CAE4"] },
  { id: "strawberry", name: "Strawberry", category: "Fruit", gradient: ["#FF6B8A", "#E63946"] },
  { id: "mango", name: "Mango", category: "Fruit", gradient: ["#FFBE0B", "#FB5607"] },
  { id: "blueberry", name: "Blueberry", category: "Fruit", gradient: ["#4361EE", "#3A0CA3"] },
  { id: "raspberry", name: "Raspberry", category: "Fruit", gradient: ["#F72585", "#B5179E"] },
  { id: "peach", name: "Peach", category: "Fruit", gradient: ["#FFB347", "#FF6B35"] },
  { id: "lemon", name: "Lemon", category: "Fruit", gradient: ["#FFE566", "#FFB700"] },
  { id: "watermelon", name: "Watermelon", category: "Fruit", gradient: ["#F94144", "#43AA8B"] },
  { id: "apple", name: "Apple", category: "Fruit", gradient: ["#90BE6D", "#43AA8B"] },
  { id: "passion_fruit", name: "Passion Fruit", category: "Fruit", gradient: ["#C77DFF", "#7B2FBE"] },
  { id: "grape", name: "Grape", category: "Fruit", gradient: ["#7B2FBE", "#3D0066"] },
  { id: "vanilla_custard", name: "Vanilla Custard", category: "Dessert", gradient: ["#F4E1C0", "#E8C97A"] },
  { id: "caramel", name: "Caramel", category: "Dessert", gradient: ["#C8902E", "#9B6A1B"] },
  { id: "cheesecake", name: "Cheesecake", category: "Dessert", gradient: ["#F7D5AA", "#E8A87C"] },
  { id: "cookie", name: "Cookie", category: "Dessert", gradient: ["#D4A574", "#A0522D"] },
  { id: "hazelnut", name: "Hazelnut", category: "Dessert", gradient: ["#8B6914", "#5C3D2E"] },
  { id: "cola", name: "Cola", category: "Beverage", gradient: ["#3D1C02", "#8B0000"] },
  { id: "energy_drink", name: "Energy Drink", category: "Beverage", gradient: ["#C8FF00", "#7FBF00"] },
  { id: "lemonade", name: "Lemonade", category: "Beverage", gradient: ["#FFE566", "#90BE6D"] },
  { id: "coffee", name: "Coffee", category: "Beverage", gradient: ["#4A2C2A", "#7B4F3A"] }
] as const;

const CATEGORIES = ["All", "Tobacco", "Menthol", "Fruit", "Dessert", "Beverage"] as const;

// Nicotine strengths definitions
const SALT_STRENGTHS = ["10", "20"] as const;
const FREEBASE_STRENGTHS = ["0", "3", "6", "12", "18"] as const;

// Spot pricing tiers definition (uc function)
const PRICE_TIERS = [
  { name: "STARTER", color: "#fef3c7", textColor: "#92400e", range: [500, 4999], breakpoints: [{ units: 500, price: 2.45 }, { units: 1000, price: 1.80 }, { units: 2500, price: 1.45 }] },
  { name: "GROWTH", color: "#dbeafe", textColor: "#1e40af", range: [5000, 49999], breakpoints: [{ units: 5000, price: 1.30 }, { units: 10000, price: 1.15 }, { units: 25000, price: 0.95 }] },
  { name: "SCALE", color: "#dcfce7", textColor: "#166534", range: [50000, 499999], breakpoints: [{ units: 50000, price: 0.80 }, { units: 100000, price: 0.68 }, { units: 250000, price: 0.58 }] },
  { name: "ENTERPRISE", color: "#fee2e2", textColor: "#991b1b", range: [500000, Infinity], breakpoints: [{ units: 500000, price: 0.52 }, { units: 1000000, price: 0.48 }] }
] as const;

function getSpotUnitPrice(qty: number): number {
  if (qty >= 1000000) return 0.48;
  if (qty >= 500000) return 0.52;
  if (qty >= 250000) return 0.58;
  if (qty >= 100000) return 0.68;
  if (qty >= 50000) return 0.80;
  if (qty >= 25000) return 0.95;
  if (qty >= 10000) return 1.15;
  if (qty >= 5000) return 1.30;
  if (qty >= 2500) return 1.45;
  if (qty >= 1000) return 1.80;
  return 2.45;
}

function getActiveTier(qty: number) {
  return PRICE_TIERS.find(t => qty >= t.range[0] && qty <= t.range[1]) || PRICE_TIERS[0];
}

function getNextTierBreakpoint(qty: number) {
  const allBreakpoints = PRICE_TIERS.flatMap(t => t.breakpoints);
  return allBreakpoints.find(bp => bp.units > qty) || null;
}

// Subscription Tiers
const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  { key: "growth_50k", name: "Growth Subscription", annualUnits: 50000, pricePerUnit: 0.80, spotPrice: 0.95, breakeven: 1.4, pullsPerYear: 4, sliderValue: 50000 },
  { key: "scale_100k", name: "Scale Subscription", annualUnits: 100000, pricePerUnit: 0.68, spotPrice: 0.95, breakeven: 1.5, pullsPerYear: 4, sliderValue: 100000 },
  { key: "scale_250k", name: "Scale Subscription", annualUnits: 250000, pricePerUnit: 0.58, spotPrice: 0.80, breakeven: 1.6, pullsPerYear: 4, sliderValue: 250000 },
  { key: "scale_500k", name: "Scale Subscription", annualUnits: 500000, pricePerUnit: 0.52, spotPrice: 0.80, breakeven: 2.0, pullsPerYear: 4, sliderValue: 500005 },
  { key: "enterprise_1m", name: "Enterprise Subscription", annualUnits: 1000000, pricePerUnit: 0.48, spotPrice: 0.68, breakeven: 2.9, pullsPerYear: 4, sliderValue: 1000000 }
];

const SUBSCRIPTION_TERMS = [
  "Annual commit: 12 months from first pull",
  "Payment: each pull 100% prepaid via wire (pro-forma invoice in UI)",
  "Deposit: 15% of annual contract, held as collateral",
  "Commit met: deposit refunded",
  "Cancel anytime: future pulls revert to spot pricing, deposit forfeit",
  "Schedule adjustable: change pull sizes in UI, total must match annual commit",
  "No negotiation: pricing, deposit %, and terms are the same for every customer"
];

const MOQ_MIN_TOTAL = 500;
const MOQ_MIN_SKU = 50;

export function OrderContentsPage() {
  const navigate = useNavigate();

  // Primary State
  const [skus, setSkus] = useState<SKUItem[]>(() => {
    try {
      const saved = sessionStorage.getItem("ritchy-v2-order");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.skus && Array.isArray(parsed.skus)) {
          return parsed.skus;
        }
      }
    } catch (e) {
      console.error("Error reading saved order contents:", e);
    }
    return [];
  });

  const [pricingMode, setPricingMode] = useState<"spot" | "subscribe">(() => {
    try {
      const saved = sessionStorage.getItem("ritchy-v2-order");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.pricingMode === "subscribe") return "subscribe";
      }
    } catch {}
    return "spot";
  });

  const [subscriptionPlan, setSubPlan] = useState<SubscriptionPlan>(() => {
    try {
      const saved = sessionStorage.getItem("ritchy-v2-order");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.subscriptionPlan) {
          const found = SUBSCRIPTION_PLANS.find(p => p.key === parsed.subscriptionPlan.key);
          if (found) return found;
        }
      }
    } catch {}
    return SUBSCRIPTION_PLANS[1]; // Scale 100k default
  });

  // SKU Builder Form State
  const [nicotineType, setNicotineType] = useState<"salt" | "freebase">("salt");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedFlavorId, setSelectedFlavorId] = useState<string>("");
  const [strength, setStrength] = useState<string>("20");
  const [quantity, setQuantity] = useState<number>(50);
  const [termsExpanded, setTermsExpanded] = useState<boolean>(false);
  const [priceListExpanded, setPriceListExpanded] = useState<boolean>(false);

  // Sync Nicotine Type strengths
  useEffect(() => {
    setStrength(nicotineType === "salt" ? "20" : "6");
  }, [nicotineType]);

  // Derived Values
  const filteredFlavors = useMemo(() => {
    if (selectedCategory === "All") return FLAVORS;
    return FLAVORS.filter(f => f.category === selectedCategory);
  }, [selectedCategory]);

  const totalQuantity = useMemo(() => {
    return skus.reduce((sum, item) => sum + item.quantity, 0);
  }, [skus]);

  // Unit price logic based on spot / subscribe
  const unitPrice = useMemo(() => {
    if (pricingMode === "subscribe") {
      return subscriptionPlan.pricePerUnit;
    }
    return getSpotUnitPrice(totalQuantity);
  }, [pricingMode, totalQuantity, subscriptionPlan]);

  const estTotal = useMemo(() => {
    return totalQuantity * unitPrice;
  }, [totalQuantity, unitPrice]);

  // Handlers
  const handleAddSku = () => {
    if (!selectedFlavorId) return;
    const flavorObj = FLAVORS.find(f => f.id === selectedFlavorId);
    if (!flavorObj) return;

    // Check if matching SKU already exists (flavor, nic type, strength)
    const existingIndex = skus.findIndex(
      s => s.flavor === selectedFlavorId && s.nicotineType === nicotineType && s.strength === strength
    );

    if (existingIndex > -1) {
      // Add quantity to existing SKU
      const updated = [...skus];
      updated[existingIndex].quantity += quantity;
      setSkus(updated);
    } else {
      // Add new SKU
      const newSku: SKUItem = {
        id: crypto.randomUUID(),
        flavor: selectedFlavorId,
        flavorName: flavorObj.name,
        flavorGradient: flavorObj.gradient as [string, string],
        nicotineType,
        strength,
        quantity
      };
      setSkus([...skus, newSku]);
    }

    // Reset selection and quantity
    setSelectedFlavorId("");
    setQuantity(50);
  };

  const handleRemoveSku = (id: string) => {
    setSkus(skus.filter(s => s.id !== id));
  };

  const handleContinue = () => {
    if (totalQuantity < MOQ_MIN_TOTAL) return;
    
    // Save to sessionStorage
    sessionStorage.setItem(
      "ritchy-v2-order",
      JSON.stringify({
        pricingMode,
        subscriptionPlan: pricingMode === "subscribe" ? subscriptionPlan : null,
        skus,
        flavor: skus[0]?.flavorName || "Passion Fruit",
        nicType: skus[0]?.nicotineType || "salt",
        qty: totalQuantity,
        estTotal
      })
    );
    navigate("/design");
  };

  // Nudge calculations
  const activeTier = getActiveTier(totalQuantity);
  const nextBreakpoint = getNextTierBreakpoint(totalQuantity);
  const unitsToNextBreakpoint = nextBreakpoint ? nextBreakpoint.units - totalQuantity : 0;

  // Subscription Calculations
  const subAnnualContractValue = subscriptionPlan.annualUnits * subscriptionPlan.pricePerUnit;
  const subDeposit = subAnnualContractValue * 0.15;
  const subQuarterlyPull = subscriptionPlan.annualUnits / subscriptionPlan.pullsPerYear;
  const subSavingsPerPull = subQuarterlyPull * (subscriptionPlan.spotPrice - subscriptionPlan.pricePerUnit);
  const subDiscountPercent = Math.round((1 - subscriptionPlan.pricePerUnit / subscriptionPlan.spotPrice) * 100);
  const subBreakevenPull = Math.ceil(subscriptionPlan.breakeven);

  return (
    <div className="v2-design-page" style={{ gap: "10px" }}>
      
      {/* LEFT COLUMN: Product Selection / SKU Form */}
      <main className="v2-design-center v2-configurator-center" style={{ flex: "1 1 auto", maxWidth: "none", background: "#ffffff", borderRadius: "14px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div
          className="v2-design-center-scroll"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedFlavorId("");
          }}
          style={{ flex: 1, overflowY: "auto", padding: "20px 24px 90px" }}
        >
          
          {/* Header */}
          <div
            style={{ marginBottom: "28px", paddingTop: "2px" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedFlavorId("");
            }}
          >
            <div style={{ fontSize: "var(--text-xs)", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
              Step 1 of 5
            </div>
            <h1 style={{ margin: "4px 0 0", fontSize: "var(--text-xl)", fontWeight: 700, color: "var(--color-text-primary)" }}>
              Configure Order Contents
            </h1>
            <p style={{ margin: "2px 0 0", color: "var(--color-text-secondary)", fontSize: "13px" }}>
              Build your product catalog with multiple flavors and nicotine strengths.
            </p>
          </div>

          <div
            className="sku-builder"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedFlavorId("");
            }}
            style={{ display: "flex", flexDirection: "column", gap: "32px", width: "100%", alignItems: "stretch" }}
          >
            
            {/* 1. Nicotine Type */}
            <div className="sku-form-section">
              <div className="sku-section-label">1 · Nicotine Type</div>
              <div className="nic-type-cards">
                <button
                  className={`nic-type-card ${nicotineType === "salt" ? "selected" : ""}`}
                  onClick={() => setNicotineType("salt")}
                >
                  <span className="nic-type-name">Nicotine Salt</span>
                  <span className="nic-type-desc">Smooth hit, higher nic</span>
                  {nicotineType === "salt" && (
                    <div className="nic-type-check">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </button>
                <button
                  className={`nic-type-card ${nicotineType === "freebase" ? "selected" : ""}`}
                  onClick={() => setNicotineType("freebase")}
                >
                  <span className="nic-type-name">Free Base</span>
                  <span className="nic-type-desc">Classic throat hit</span>
                  {nicotineType === "freebase" && (
                    <div className="nic-type-check">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* 2. Flavor Catalog */}
            <div className="sku-form-section">
              <div className="sku-section-label">2 · Flavor</div>
              
              {/* Category tabs */}
              <div className="fc-category-tabs">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={`fc-cat-tab ${selectedCategory === cat ? "active" : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Flavor Cards grid */}
              <div className="fc-flavor-grid sku-flavor-grid">
                {filteredFlavors.map(flavorItem => {
                  const active = selectedFlavorId === flavorItem.id;
                  return (
                    <button
                      key={flavorItem.id}
                      className={`fc-flavor-card ${active ? "selected" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFlavorId(selectedFlavorId === flavorItem.id ? "" : flavorItem.id);
                      }}
                      style={{
                        background: `linear-gradient(to bottom, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.2)), linear-gradient(135deg, ${flavorItem.gradient[0]}, ${flavorItem.gradient[1]})`,
                        border: "none",
                        boxShadow: active ? "0 0 0 3px #111111, 0 6px 16px rgba(0,0,0,0.15), inset 0 0 0 1px rgba(255,255,255,0.25)" : "0 2px 4px rgba(0,0,0,0.03)",
                        transform: active ? "translateY(-1.5px) scale(1.01)" : "none",
                        padding: "10px 12px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        minHeight: "75px",
                        textAlign: "left",
                        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
                      }}
                    >
                      {active && (
                        <div className="fc-flavor-check" style={{ background: "#111111", border: "1.5px solid #ffffff", boxShadow: "0 2px 4px rgba(0,0,0,0.2)", top: "6px", right: "6px" }}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      )}
                      <span
                        className="fc-flavor-name"
                        style={{
                          color: "#ffffff",
                          fontWeight: 700,
                          fontSize: "14px",
                          letterSpacing: "-0.01em",
                          lineHeight: "1.2",
                          wordBreak: "break-word"
                        }}
                      >
                        {flavorItem.name}
                      </span>
                      <span
                        className="fc-flavor-cat"
                        style={{
                          color: "rgba(255,255,255,0.5)",
                          fontSize: "8px",
                          fontWeight: 600,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase"
                        }}
                      >
                        {flavorItem.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* Floating Add to Order button footer (Only shown when a flavor is selected) */}
        {selectedFlavorId && (
          <div
            className="v2-sticky-add-footer"
            style={{
              position: "sticky",
              bottom: 0,
              padding: "12px 20px",
              background: "#ffffff",
              borderTop: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 -6px 20px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              zIndex: 10
            }}
          >
            {/* Inline selectors row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
              {/* Strength selector */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: "1 1 auto" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Nicotine Strength
                </span>
                <div style={{ display: "flex", gap: "6px" }}>
                  {(nicotineType === "salt" ? SALT_STRENGTHS : FREEBASE_STRENGTHS).map(s => (
                    <button
                      key={s}
                      onClick={() => setStrength(s)}
                      style={{
                        padding: "5px 10px",
                        fontSize: "11px",
                        fontWeight: 600,
                        borderRadius: "6px",
                        border: "1.5px solid",
                        borderColor: strength === s ? "#111111" : "rgba(0,0,0,0.08)",
                        background: strength === s ? "#111111" : "#ffffff",
                        color: strength === s ? "#ffffff" : "#111111",
                        cursor: "pointer",
                        transition: "all 0.15s"
                      }}
                    >
                      {s} mg
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity selector */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: "0 0 auto", alignItems: "flex-end" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Quantity
                </span>
                <div className="fc-qty-input-wrap" style={{ margin: 0, height: "30px", background: "#f3f4f6", border: "1px solid rgba(0,0,0,0.05)", borderRadius: "6px", overflow: "hidden", display: "flex", alignItems: "center" }}>
                  <button
                    className="fc-qty-btn"
                    style={{ width: "30px", height: "30px", border: "none", background: "transparent", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}
                    onClick={() => setQuantity(prev => Math.max(MOQ_MIN_SKU, prev - 50))}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={MOQ_MIN_SKU}
                    value={quantity}
                    onChange={e => setQuantity(Math.max(MOQ_MIN_SKU, parseInt(e.target.value) || MOQ_MIN_SKU))}
                    className="fc-qty-input"
                    style={{ width: "45px", height: "30px", fontSize: "12px", border: "none", background: "transparent", textAlign: "center", fontWeight: 600 }}
                  />
                  <button
                    className="fc-qty-btn"
                    style={{ width: "30px", height: "30px", border: "none", background: "transparent", cursor: "pointer", fontSize: "14px", fontWeight: "bold" }}
                    onClick={() => setQuantity(prev => prev + 50)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <button
              className="sku-add-btn"
              onClick={handleAddSku}
              style={{ margin: 0, width: "100%", height: "42px" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add to Order
            </button>
          </div>
        )}
      </main>

      {/* RIGHT COLUMN: Order Calculations & Added SKUs */}
      <aside className="v2-design-right v2-configurator-right" style={{ flex: "0 0 460px", maxWidth: "460px", background: "#ffffff", borderRadius: "14px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div className="v2-design-right-card" style={{ display: "flex", flexDirection: "column", height: "100%", padding: "20px", boxSizing: "border-box", minHeight: 0 }}>
          
          {/* FIXED HEADER: Pricing Mode Toggle (Always Pinned at Top) */}
          <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
            <div className="pricing-mode-toggle" style={{ margin: 0 }}>
              <button
                className={`pricing-mode-tab ${pricingMode === "spot" ? "active" : ""}`}
                onClick={() => setPricingMode("spot")}
              >
                Spot (one-time)
              </button>
              <button
                className={`pricing-mode-tab ${pricingMode === "subscribe" ? "active" : ""}`}
                onClick={() => setPricingMode("subscribe")}
              >
                Subscribe
                <span className="pricing-mode-badge">−17% to −30%</span>
              </button>
            </div>

            {pricingMode === "subscribe" && (
              <div style={{ fontSize: "11px", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "6px", paddingLeft: "4px" }}>
                <span>💡</span>
                <span>Not ready to commit? Start with spot, upgrade later.</span>
              </div>
            )}
          </div>

          {/* Scrollable Catalog & Configuration settings */}
          <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px", paddingRight: "4px" }}>

            {/* Combined Header & MOQ Indicator */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "12px",
              borderBottom: "1px solid rgba(0,0,0,0.06)",
              marginBottom: "4px",
              flexShrink: 0
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--color-text-primary)" }}>
                  Your Order
                </span>
                {totalQuantity > 0 && (
                  <span style={{ fontSize: "11px", color: "var(--color-text-secondary)" }}>
                    {skus.length} SKU{skus.length === 1 ? "" : "s"} · <strong>{totalQuantity.toLocaleString()}</strong> bottle{totalQuantity === 1 ? "" : "s"}
                  </span>
                )}
              </div>

              {/* MOQ Status Pill */}
              {totalQuantity === 0 ? (
                <div style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "var(--color-text-muted)",
                  background: "rgba(0,0,0,0.04)",
                  padding: "4px 10px",
                  borderRadius: "100px"
                }}>
                  Min 500 bottles
                </div>
              ) : totalQuantity >= MOQ_MIN_TOTAL ? (
                <div style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#15803d",
                  background: "#dcfce7",
                  padding: "4px 10px",
                  borderRadius: "100px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  MOQ Met
                </div>
              ) : (
                <div style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#b45309",
                  background: "#fef3c7",
                  padding: "4px 10px",
                  borderRadius: "100px"
                }}>
                  +{(MOQ_MIN_TOTAL - totalQuantity).toLocaleString()} bottles
                </div>
              )}
            </div>

            {/* SKUs List */}
            {skus.length === 0 ? (
              <div className="sku-order-empty" style={{ padding: "30px 10px" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--color-text-muted)" }}>
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <p style={{ margin: "8px 0 0", fontWeight: 600, fontSize: "13px" }}>No SKUs added yet</p>
                <p className="sku-order-empty-hint" style={{ margin: "2px 0 0", fontSize: "11px" }}>
                  Configure products on the left and click Add
                </p>
              </div>
            ) : (
              <div className="sku-list" style={{ flexShrink: 0, borderBottom: "1px solid rgba(0,0,0,0.04)", paddingBottom: "8px" }}>
                {skus.map(sku => {
                  const skuPrice = sku.quantity * unitPrice;
                  return (
                    <div key={sku.id} className="sku-row">
                      <div
                        className="sku-row-orb"
                        style={{ background: `linear-gradient(135deg, ${sku.flavorGradient[0]}, ${sku.flavorGradient[1]})` }}
                      />
                      <div className="sku-row-info">
                        <span className="sku-row-name">{sku.flavorName}</span>
                        <span className="sku-row-meta">
                          {sku.nicotineType === "salt" ? "Salt" : "FB"} · {sku.strength} mg
                        </span>
                      </div>
                      <div className="sku-row-right">
                        <span className="sku-row-qty">×{sku.quantity.toLocaleString()}</span>
                        <span className="sku-row-price">€{skuPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <button
                        className="sku-row-remove"
                        onClick={() => handleRemoveSku(sku.id)}
                        title="Remove"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Dynamic Interactive Pricing Options */}
            {pricingMode === "subscribe" ? (
              
              /* Subscribe mode interactive panel */
              <div className="sub-panel">

                {/* 1. Slider controls */}
                <div className="sub-slider-section">
                  <div className="sub-slider-label">
                    <span>Annual volume commit</span>
                    <span className="sub-slider-value">
                      {subscriptionPlan.annualUnits.toLocaleString()} / yr
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={SUBSCRIPTION_PLANS.length - 1}
                    step={1}
                    value={SUBSCRIPTION_PLANS.findIndex(p => p.key === subscriptionPlan.key)}
                    onChange={e => setSubPlan(SUBSCRIPTION_PLANS[parseInt(e.target.value)])}
                    className="sub-slider"
                  />
                  <div className="sub-slider-stops">
                    {SUBSCRIPTION_PLANS.map(plan => (
                      <button
                        key={plan.key}
                        className={`sub-slider-stop ${plan.key === subscriptionPlan.key ? "active" : ""}`}
                        onClick={() => setSubPlan(plan)}
                      >
                        {plan.annualUnits >= 1000000
                          ? `${(plan.annualUnits / 1000000).toFixed(0)}M`
                          : `${(plan.annualUnits / 1000).toFixed(0)}k`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Plan Card */}
                <div className="sub-plan-card">
                  <div className="sub-plan-header">
                    <div className="sub-plan-name">{subscriptionPlan.name}</div>
                    <div className="sub-plan-discount">−{subDiscountPercent}%</div>
                  </div>

                  <div className="sub-plan-grid">
                    <div className="sub-plan-row">
                      <span className="sub-plan-row-label">Annual commit</span>
                      <span className="sub-plan-row-value">{subscriptionPlan.annualUnits.toLocaleString()} bottles</span>
                    </div>
                    <div className="sub-plan-row sub-plan-row-highlight">
                      <span className="sub-plan-row-label">Subscription price</span>
                      <span className="sub-plan-row-value">
                        <strong>€{subscriptionPlan.pricePerUnit.toFixed(2)}/btl</strong>
                        <span className="sub-plan-was">was €{subscriptionPlan.spotPrice.toFixed(2)}</span>
                      </span>
                    </div>
                    <div className="sub-plan-row">
                      <span className="sub-plan-row-label">Deposit (15% refundable)</span>
                      <span className="sub-plan-row-value">€{subDeposit.toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="sub-plan-row">
                      <span className="sub-plan-row-label">Quarterly batch</span>
                      <span className="sub-plan-row-value">{subQuarterlyPull.toLocaleString()} btl</span>
                    </div>
                  </div>

                  {/* 3. Breakeven */}
                  <div className="sub-breakeven">
                    <div className="sub-breakeven-header">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                        <polyline points="17 6 23 6 23 12" />
                      </svg>
                      Breakeven
                    </div>
                    <div className="sub-breakeven-bar-wrap">
                      <div className="sub-breakeven-bar">
                        <div
                          className="sub-breakeven-fill"
                          style={{ width: `${Math.min(100, (subscriptionPlan.breakeven / 4) * 100)}%` }}
                        />
                        <div
                          className="sub-breakeven-marker"
                          style={{ left: `${Math.min(100, (subscriptionPlan.breakeven / 4) * 100)}%` }}
                        />
                      </div>
                      <div className="sub-breakeven-axis">
                        <span>P1</span>
                        <span>P2</span>
                        <span>P3</span>
                        <span>P4</span>
                      </div>
                    </div>
                    <p className="sub-breakeven-text">
                      Payback by pull #{subBreakevenPull}. From #{subBreakevenPull + 1} you save{" "}
                      <strong>€{subSavingsPerPull.toLocaleString("en-US", { maximumFractionDigits: 0 })}/quarter</strong>.
                    </p>
                  </div>
                </div>

                {/* 4. Terms accordion */}
                <div className="sub-terms-accordion">
                  <button className="sub-terms-toggle" onClick={() => setTermsExpanded(prev => !prev)}>
                    <span>Published terms</span>
                    <svg
                      width="11" height="11" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="2"
                      style={{ transform: termsExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {termsExpanded && (
                    <ul className="sub-terms-list">
                      {SUBSCRIPTION_TERMS.map((term, t) => (
                        <li key={t}>{term}</li>
                      ))}
                    </ul>
                  )}
                </div>

              </div>

            ) : (
              
              /* Spot mode pricing tiers list */
              skus.length > 0 && (
                <div className="sku-order-footer" style={{ padding: 0, background: "transparent" }}>
                  <div className="sku-tier-badge" style={{ background: "rgba(17, 17, 17, 0.04)", border: "1px solid rgba(0, 0, 0, 0.06)", padding: "6px 12px", borderRadius: "8px", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                    <span className="sku-tier-badge-label" style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>You are in:</span>
                    <span className="sku-tier-badge-name" style={{ color: "#111111", fontSize: "11px", fontWeight: 700 }}>
                      {activeTier.name} Tier
                    </span>
                  </div>

                  <div className="price-tiers-grouped" style={{ gap: "4px" }}>
                    {PRICE_TIERS.map(tier => {
                      const isCurrent = activeTier.name === tier.name;
                      if (!priceListExpanded && !isCurrent) return null;
                      return (
                        <div key={tier.name} className={`tier-group ${isCurrent ? "tier-group-active" : ""}`} style={{ borderRadius: "6px", borderColor: isCurrent ? "#111111" : "rgba(0,0,0,0.08)" }}>
                          <div
                            className="tier-group-header"
                            style={{
                              background: isCurrent ? "#111111" : "#f4f4f5",
                              color: isCurrent ? "#ffffff" : "#71717a",
                              padding: "4px 10px",
                              fontSize: "9px",
                              fontWeight: 700,
                              letterSpacing: "0.05em",
                              textTransform: "uppercase"
                            }}
                          >
                            {tier.name}
                          </div>
                          {tier.breakpoints.map(bp => {
                            const activeBp = totalQuantity >= bp.units;
                            return (
                              <div
                                key={bp.units}
                                className="price-tier"
                                style={{
                                  background: activeBp ? "#ffffff" : "#f9fafb",
                                  fontWeight: activeBp ? 600 : 400,
                                  opacity: activeBp ? 1 : 0.65,
                                  padding: "4px 8px",
                                  fontSize: "11px"
                                }}
                              >
                                <span>{bp.units.toLocaleString()} units</span>
                                <span>€{bp.price.toFixed(2)}/unit</span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setPriceListExpanded(!priceListExpanded)}
                    style={{
                      width: "100%",
                      background: "none",
                      border: "none",
                      color: "var(--color-text-secondary)",
                      fontSize: "11px",
                      fontWeight: 600,
                      cursor: "pointer",
                      padding: "6px 0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                      marginTop: "6px",
                      textDecoration: "underline",
                      transition: "color 0.2s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--color-text-primary)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-secondary)"}
                  >
                    {priceListExpanded ? "Hide full rate card ↑" : "Show full rate card ↓"}
                  </button>

                  {/* Nudge Alert to next tier */}
                  {unitsToNextBreakpoint > 0 && nextBreakpoint && (
                    <div
                      style={{
                        padding: "8px",
                        background: "rgba(17,17,17,0.04)",
                        border: "1px solid rgba(17,17,17,0.08)",
                        borderRadius: "8px",
                        color: "#111111",
                        fontSize: "11px",
                        fontWeight: 500,
                        textAlign: "center",
                        marginTop: "8px"
                      }}
                    >
                      Add <strong>{unitsToNextBreakpoint.toLocaleString()}</strong> bottles to drop price to{" "}
                      <strong>€{nextBreakpoint.price.toFixed(2)}</strong>!
                    </div>
                  )}
                </div>
              )

            )}

          </div>

          {/* Sticky/Fixed bottom summary & footer inside card */}
          <div style={{ flexShrink: 0, borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "12px", marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
            
            {/* Totals Summary */}
            {skus.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  padding: "10px 14px",
                  background: "rgba(17,17,17,0.03)",
                  borderRadius: "10px",
                  border: "1px solid rgba(0,0,0,0.04)"
                }}
              >
                <div>
                  <div style={{ fontSize: "10px", color: "var(--color-text-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    {pricingMode === "subscribe" ? "Quarterly Pull Total" : "Estimated total"}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--color-text-primary)" }}>
                    €{estTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div style={{ fontSize: "9px", color: "var(--color-text-muted)" }}>
                    {totalQuantity.toLocaleString()} units × €{unitPrice.toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="v2-nav-footer" style={{ margin: 0, padding: 0, position: "static", boxShadow: "none", zIndex: "auto", background: "transparent" }}>
              <button
                onClick={() => navigate("/")}
                className="v2-footer-btn v2-footer-btn-secondary"
                style={{ height: "40px", fontSize: "13px", borderRadius: "10px" }}
              >
                ← Back
              </button>
              <button
                onClick={handleContinue}
                disabled={totalQuantity < MOQ_MIN_TOTAL}
                className="v2-footer-btn v2-footer-btn-primary"
                style={{
                  height: "40px",
                  fontSize: "13px",
                  borderRadius: "10px",
                  opacity: totalQuantity >= MOQ_MIN_TOTAL ? 1 : 0.5,
                  cursor: totalQuantity >= MOQ_MIN_TOTAL ? "pointer" : "not-allowed"
                }}
              >
                Continue to Design →
              </button>
            </div>

          </div>

        </div>
      </aside>

    </div>
  );
}
