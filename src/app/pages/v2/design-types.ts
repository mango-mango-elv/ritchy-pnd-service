export interface ColorPreset {
  id: string;
  label: string;
  color: string;
  gradient: string;
}

export const COLOR_PRESETS: ColorPreset[] = [
  { id: "dark-berry", label: "Dark Berry", color: "#6b21a8", gradient: "linear-gradient(135deg, #6b21a8 0%, #be185d 100%)" },
  { id: "ocean",      label: "Ocean",      color: "#1d4ed8", gradient: "linear-gradient(135deg, #1d4ed8 0%, #0891b2 100%)" },
  { id: "sunset",     label: "Sunset",     color: "#ea580c", gradient: "linear-gradient(135deg, #ea580c 0%, #eab308 100%)" },
  { id: "forest",     label: "Forest",     color: "#166534", gradient: "linear-gradient(135deg, #166534 0%, #15803d 100%)" },
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
  skus:          SKU[];
  selectedSkuId: string;
}
