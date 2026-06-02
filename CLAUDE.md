# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

**Ritchy P&D** — a web app for designing private-label e-liquid bottle/box packaging. A brand
configures an order (flavors/SKUs), designs labels, signs up, passes regulatory compliance, and
submits the request. There is **no backend**: all state lives in the browser (`sessionStorage` for
the v2 flow, `localStorage` for v1 drafts), and submission is client-side only.

- **Stack**: React 18, Vite 6, TypeScript, React Router 7, Tailwind CSS v4.
- **UI**: `@figma/astraui-kit`, lucide-react icons, sonner toasts; custom glass-morphism styling.
- **Deploy**: Vercel as an SPA (`vercel.json` rewrites all routes to `index.html`).
- **Package manager**: pnpm.

## Commands

```bash
pnpm dev        # Vite dev server (port 5173)
pnpm build      # production build → dist/
pnpm preview    # preview the build
pnpm typecheck  # tsc --noEmit (type-check only; Vite/esbuild does the transpiling)
```

Run `typecheck` before committing — it's the only automated gate. The
`tsconfig.json` is intentionally soft (`strict: false`); tighten it as the
code is cleaned up. There are **no unit-test or lint scripts** configured.

## Versions: v2 is active, v1 is legacy

The codebase contains two parallel UIs. **Work only in v2 unless explicitly asked otherwise.**

- **v2 (ACTIVE)** — routes at `/`, `/order`, `/design`, `/signup`, `/compliance`, `/confirm`,
  `/dashboard`; shell `src/app/components/AppShellV2.tsx`; pages in `src/app/pages/v2/`.
- **v1 (LEGACY — do not modify unless asked)** — routes under `/v1/*` plus `/login`;
  shell `src/app/components/AppShell.tsx`. Its rendering engine (`BoxFace.tsx`, `PackagingEditor.tsx`,
  `View3D.tsx`, `LayoutView.tsx`, `RangeView.tsx`, `FrontView.tsx`, `packageTypes.ts`) is **separate**
  from v2 and is not used by the active flow. Routing lives in `src/app/routes.tsx`.

## v2 flow

5-step wizard, navigated via `useV2Nav()` (`goNext()` / `goBack()`) from `AppShellV2`:

```
Landing (/) → Order (/order) → Design (/design) → SignUp (/signup) → Compliance (/compliance) → Confirm (/confirm)
```

| Step | Route | File |
|------|-------|------|
| Landing | `/` | `src/app/pages/v2/LandingPage.tsx` |
| 1. Order contents | `/order` | `src/app/pages/v2/OrderContentsPage.tsx` |
| 2. Brand & design | `/design` | `src/app/pages/v2/DesignPageV2.tsx` |
| 3. Sign up | `/signup` | `src/app/pages/v2/SignUpPage.tsx` |
| 4. Compliance | `/compliance` | `src/app/pages/v2/CompliancePage.tsx` |
| 5. Confirm | `/confirm` | `src/app/pages/v2/ConfirmPage.tsx` |
| Dashboard (post-submit) | `/dashboard` | `src/app/pages/v2/DashboardPageV2.tsx` |

Supporting v2 files:
- `src/app/pages/v2/design-types.ts` — core types: `SKU`, `DesignState`, `ColorPreset` + `COLOR_PRESETS`.
- `src/app/pages/v2/DesignForm.tsx` — brand/logo, color, background, health-warning form (used by the Design step).
- `src/app/pages/v2/PackagePreview.tsx` — live preview; defines all label/box render components.
- `src/app/pages/v2/TemplateGrid.tsx` — template selector.

## State

No Redux/Zustand/Context store. State is local `useState` per page, persisted across steps in
`sessionStorage` under these keys:

- `ritchy-v2-order` — SKUs, pricing mode, totals
- `ritchy-v2-design` — `DesignState` (templateId, brand, logo, SKUs, health warning)
- `ritchy-v2-user` — email, company, country
- `ritchy-v2-compliance` — selected market and warning text
- `ritchy-v2-design-draft` — full working design state (all SKUs); survives wizard navigation
- `ritchy-v2-submitted` — `{ orderId, submittedAt }`, written on order submission

## Templates & styling

- **5 label templates** (T1-Flavor, T2-Centered, T3-Split, T4-Badge, T5-Vertical) in `PackagePreview.tsx`.
  Each template has a box component (`Box*`) and a bottle-label component (`BottleLabel*`).
- Template typography is tuned for **pixel-perfect Figma alignment** and **auto-scales via container
  queries (`cqw` units)** — the preview root sets `container-type: inline-size`.
- **Tailwind v4** is configured through the Vite plugin — there is **no `tailwind.config` file**.
  Design tokens (CSS variables) and `ds-*` utility classes (`ds-surface`, `ds-btn`, `ds-input`, …)
  live in `src/styles/tailwind.css`. Fonts in `src/styles/fonts.css`. Entry CSS: `src/styles/globals.css`.

## Gotchas

- `@figma/astraui-kit` has required setup — see `Guidelines.md`.
- `src/app/pages/v2/DesignForm_accordions_backup.tsx` is an unused backup, not part of the build.
- When editing template visuals, prefer `cqw`-based sizing to keep Figma alignment intact.
