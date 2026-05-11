import { makeFlavor } from "../components/packageTypes";
import type { Flavor } from "../components/packageTypes";

export interface PackagingDraft {
  id: string;
  name: string;
  updatedAt: number;
  activeFlavor: number;
  flavors: Flavor[];
}

const STORAGE_KEY = "ritchy-packaging-drafts-v1";

export const DEMO_DRAFT_ID = "demo-ritchy-mango-line";

export const demoDraft: PackagingDraft = {
  id: DEMO_DRAFT_ID,
  name: "Ritchy Mango Launch Line",
  updatedAt: Date.parse("2026-05-11T10:00:00.000Z"),
  activeFlavor: 0,
  flavors: [
    makeFlavor("demo-mango", "M", {
      name: "Mango Ice",
      tagline: "tropical · cooling",
      strength: 12,
      packageColor: "red",
      type: "salt",
      titleFont: "caveat",
      contentX: 50,
      contentY: 37,
    }),
    makeFlavor("demo-mint", "A", {
      name: "Arctic Mint",
      tagline: "cool · fresh",
      strength: 6,
      packageColor: "teal",
      type: "freebase",
      titleFont: "inter",
      contentX: 50,
      contentY: 38,
    }),
    makeFlavor("demo-berry", "B", {
      name: "Blueberry",
      tagline: "sweet · fruity",
      strength: 3,
      packageColor: "blue",
      type: "salt",
      titleFont: "playfair",
      contentX: 50,
      contentY: 39,
    }),
    makeFlavor("demo-gold", "G", {
      name: "Golden Peach",
      tagline: "soft · mellow",
      strength: 0,
      packageColor: "gold",
      type: "freebase",
      titleFont: "dm-serif",
      contentX: 50,
      contentY: 38,
    }),
  ],
};

export function listDrafts(): PackagingDraft[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PackagingDraft[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((d) => d && Array.isArray(d.flavors))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export function getDraftById(id: string): PackagingDraft | null {
  if (id === DEMO_DRAFT_ID) return demoDraft;
  return listDrafts().find((d) => d.id === id) ?? null;
}

export function saveDraft(input: Omit<PackagingDraft, "updatedAt">): PackagingDraft {
  const now = Date.now();
  const next: PackagingDraft = { ...input, updatedAt: now };
  const existing = listDrafts();
  const withoutCurrent = existing.filter((d) => d.id !== next.id);
  const merged = [next, ...withoutCurrent];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  return next;
}
