export interface ColorPreset {
  id: string;
  label: string;
  color: string;
  gradient: string;
}

export const COLOR_PRESETS: ColorPreset[] = [
  { id: "dark-berry", label: "Dark Berry",      color: "#6b21a8", gradient: "linear-gradient(135deg, #6b21a8 0%, #be185d 100%)" },
  { id: "ocean",      label: "Ocean",           color: "#1d4ed8", gradient: "linear-gradient(135deg, #1d4ed8 0%, #0891b2 100%)" },
  { id: "sunset",     label: "Sunset",          color: "#ea580c", gradient: "linear-gradient(135deg, #ea580c 0%, #eab308 100%)" },
  { id: "forest",     label: "Forest",          color: "#166534", gradient: "linear-gradient(135deg, #166534 0%, #15803d 100%)" },
  { id: "midnight",   label: "Midnight Black",  color: "#18181b", gradient: "linear-gradient(135deg, #09090b 0%, #27272a 100%)" },
  { id: "gold",       label: "Gold Sunrise",    color: "#ca8a04", gradient: "linear-gradient(135deg, #ca8a04 0%, #facc15 100%)" },
  { id: "rose",       label: "Rose Sakura",     color: "#be185d", gradient: "linear-gradient(135deg, #be185d 0%, #f472b6 100%)" },
  { id: "alabaster",  label: "Alabaster Cream", color: "#fafaf9", gradient: "linear-gradient(135deg, #f5f5f4 0%, #e7e5e4 100%)" },
];

export interface SKU {
  id: string;
  displayName: string;
  type: "salt" | "freebase";
  flavor: string;
  strength: "10mg" | "20mg";
  colorTab:      "presets" | "custom" | "ai";
  colorPresetId: string;
  customColor:   string;
}

export interface DesignState {
  templateId:    string;
  brandName:     string;
  logoDataUrl:   string;
  logoScale?:    number;
  skus:          SKU[];
  selectedSkuId: string;
}

