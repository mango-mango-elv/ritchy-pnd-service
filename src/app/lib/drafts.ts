import type { Flavor } from "../components/packageTypes";

export interface PackagingDraft {
  id: string;
  name: string;
  updatedAt: number;
  activeFlavor: number;
  flavors: Flavor[];
}

const STORAGE_KEY = "ritchy-packaging-drafts-v1";

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

