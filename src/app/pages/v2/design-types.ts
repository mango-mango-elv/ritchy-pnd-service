export interface ColorPreset {
  id: string;
  label: string;
  color: string;
  gradient: string;
}

// Presets render as flat colors — "gradient" is kept as a two-stop
// same-color gradient so every consumer (PackagePreview, swatches) keeps
// working with a background-image value.
export const COLOR_PRESETS: ColorPreset[] = [
  { id: "dark-berry", label: "Dark Berry",      color: "#6b21a8", gradient: "linear-gradient(135deg, #6b21a8 0%, #6b21a8 100%)" },
  { id: "ocean",      label: "Ocean",           color: "#1d4ed8", gradient: "linear-gradient(135deg, #1d4ed8 0%, #1d4ed8 100%)" },
  { id: "sunset",     label: "Sunset",          color: "#ea580c", gradient: "linear-gradient(135deg, #ea580c 0%, #ea580c 100%)" },
  { id: "forest",     label: "Forest",          color: "#166534", gradient: "linear-gradient(135deg, #166534 0%, #166534 100%)" },
  { id: "midnight",   label: "Midnight Black",  color: "#18181b", gradient: "linear-gradient(135deg, #18181b 0%, #18181b 100%)" },
  { id: "gold",       label: "Gold Sunrise",    color: "#ca8a04", gradient: "linear-gradient(135deg, #ca8a04 0%, #ca8a04 100%)" },
  { id: "rose",       label: "Rose Sakura",     color: "#be185d", gradient: "linear-gradient(135deg, #be185d 0%, #be185d 100%)" },
  { id: "alabaster",  label: "Alabaster Cream", color: "#fafaf9", gradient: "linear-gradient(135deg, #fafaf9 0%, #fafaf9 100%)" },
];

export interface SKU {
  id: string;
  displayName: string;
  type: "salt" | "freebase";
  flavor: string;
  strength: "10mg" | "20mg";
  colorTab:      "presets" | "custom" | "ai" | "image";
  colorPresetId: string;
  customColor:   string;
  bgImageDataUrl?: string;
  bgImagePositionBox?: { x: number; y: number; };
  bgImageScaleBox?: number;
  bgImagePositionBottle?: { x: number; y: number; };
  bgImageScaleBottle?: number;
  graphicsColorTab?: "white" | "black" | "custom";
  graphicsCustomColor?: string;
}

export interface DesignState {
  templateId:    string;
  brandName:     string;
  logoDataUrl:   string;
  logoScale?:    number;
  skus:          SKU[];
  selectedSkuId: string;
}

