/* ── Shared types & constants ────────────────────────────────── */

export type ViewMode   = "front" | "3d" | "layout" | "range";
export type FlavorType = "freebase" | "salt";
export type PackageColor = "red" | "gold" | "teal" | "blue" | "black" | "cream";
export type TitleFont  = "caveat" | "playfair" | "inter" | "dm-serif";
export type Template   = "own-art" | "illustration";

export interface CustomText {
  id:         string;
  text:       string;
  x:          number;       // % relative to front face
  y:          number;       // % relative to front face
  fontSize:   number;       // px
  color:      string;       // hex
  fontFamily: TitleFont;
}

export interface Flavor {
  id:             string;
  letter:         string;
  name:           string;
  tagline:        string;
  strength:       number;
  type:           FlavorType;
  packageColor:   PackageColor;
  titleFont:      TitleFont;
  template:       Template;
  artImage:       string | null;
  logoImage:      string | null;
  skullIconImage: string | null;
  // Health warning text (shown on front + back panels)
  healthWarningText: string;
  // Art transform (pan/zoom) — shared across all views
  artOffsetX:     number;
  artOffsetY:     number;
  artScale:       number;
  // Custom text overlays
  customTexts:    CustomText[];
  // Unified content cluster position (% of front panel) — single source of truth
  contentX:       number;
  contentY:       number;
  // Logo dimensions (native px at 1× scale)
  logoWidth:      number;
  logoHeight:     number;
  // Skull icon position on back panel (%)
  skullIconX:     number;
  skullIconY:     number;
}

/* Physical box dimensions in mm */
export const BOX_W_MM = 35;
export const BOX_H_MM = 75;
export const BOX_D_MM = 25;

/* Color palette */
export const COLOR_MAP: Record<PackageColor, { face: string; side: string; top: string; text: string; border: string }> = {
  red:   { face: "#C94B2A", side: "#9E3618", top: "#B84025",  text: "#fff",    border: "rgba(255,255,255,0.15)" },
  gold:  { face: "#D4A01A", side: "#A87D10", top: "#C49218",  text: "#fff",    border: "rgba(255,255,255,0.2)"  },
  teal:  { face: "#1A7A5E", side: "#115E47", top: "#176E53",  text: "#fff",    border: "rgba(255,255,255,0.18)" },
  blue:  { face: "#1A4D8F", side: "#0F3468", top: "#153F7A",  text: "#fff",    border: "rgba(255,255,255,0.18)" },
  black: { face: "#1C1917", side: "#0A0908", top: "#141211",  text: "#fff",    border: "rgba(255,255,255,0.12)" },
  cream: { face: "#F5F2EB", side: "#DED9CE", top: "#ECE8DF",  text: "#1C1917", border: "rgba(0,0,0,0.18)"       },
};

export const PACKAGE_COLORS: { key: PackageColor; hex: string; label: string }[] = [
  { key: "red",   hex: "#C94B2A", label: "Red"   },
  { key: "gold",  hex: "#D4A01A", label: "Gold"  },
  { key: "teal",  hex: "#1A7A5E", label: "Teal"  },
  { key: "blue",  hex: "#1A4D8F", label: "Blue"  },
  { key: "black", hex: "#1C1917", label: "Black" },
  { key: "cream", hex: "#F5F2EB", label: "Cream" },
];

export const TITLE_FONTS: { key: TitleFont; label: string; css: string }[] = [
  { key: "caveat",   label: "Caveat — handwritten",     css: "'Caveat', cursive"                  },
  { key: "playfair", label: "Playfair Display — serif", css: "'Playfair Display', Georgia, serif" },
  { key: "inter",    label: "Inter — modern sans",      css: "'Inter', Arial, sans-serif"         },
  { key: "dm-serif", label: "DM Serif — editorial",     css: "'DM Serif Display', Georgia, serif" },
];

export const STRENGTHS = [0, 3, 6, 12, 18];

export const DEFAULT_HEALTH_WARNING =
  "ПРЕДУПРЕЖДЕНИЕ: Данный продукт содержит никотин.\nНикотин вызывает сильную зависимость.";

/** Fills any missing fields with safe defaults. */
export const normalizeFlavor = (f: Flavor): Flavor => ({
  ...f,
  healthWarningText: f.healthWarningText ?? DEFAULT_HEALTH_WARNING,
  contentX:    f.contentX    ?? 50,
  contentY:    f.contentY    ?? 40,
  logoWidth:   f.logoWidth   ?? 80,
  logoHeight:  f.logoHeight  ?? 48,
  skullIconX:  f.skullIconX  ?? 50,
  skullIconY:  f.skullIconY  ?? 20,
  artScale:    f.artScale    ?? 1,
  artOffsetX:  f.artOffsetX  ?? 0,
  artOffsetY:  f.artOffsetY  ?? 0,
  customTexts: f.customTexts ?? [],
});

export const makeFlavor = (id: string, letter: string, overrides: Partial<Flavor> = {}): Flavor => ({
  id, letter,
  name: "", tagline: "", strength: 6,
  type: "salt", packageColor: "cream",
  titleFont: "caveat", template: "own-art",
  artImage: null, logoImage: null, skullIconImage: null,
  healthWarningText: DEFAULT_HEALTH_WARNING,
  artOffsetX: 0, artOffsetY: 0, artScale: 1,
  customTexts: [],
  contentX: 50, contentY: 40,
  logoWidth: 80, logoHeight: 48,
  skullIconX: 50, skullIconY: 20,
  ...overrides,
});

export const DEFAULT_FLAVORS: Flavor[] = [
  makeFlavor("1", "M", { name: "Mango Ice",   tagline: "tropical · cooling", strength: 12, packageColor: "red",   type: "salt"     }),
  makeFlavor("2", "A", { name: "Arctic Mint", tagline: "cool · fresh",       strength: 6,  packageColor: "teal",  type: "freebase" }),
  makeFlavor("3", "B", { name: "Blueberry",   tagline: "sweet · fruity",     strength: 3,  packageColor: "blue",  type: "salt"     }),
];