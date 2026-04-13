# Agent runbook: embed OpenReel in Next.js

Use this document when **automating** or **step-by-step implementing** a Next.js integration of `@openreel/web`. It complements [OPENREEL_NEXTJS_INTEGRATION.md](./OPENREEL_NEXTJS_INTEGRATION.md), which explains the same topics in more narrative form.

---

## Objective

Mount `OpenReelEditor` from `@openreel/web` on a dedicated Next.js route with correct security headers and **no SSR** for the editor.

---

## Preconditions

- [ ] Host app uses **Next.js 13+** (App Router assumed below; adapt for Pages Router if needed).
- [ ] **React 18** is installed (peer of `@openreel/web`).
- [ ] `@openreel/web` is resolvable (workspace link, git subdirectory dependency, or packed tarball).

---

## Execution checklist

1. **Dependency**
   - Add `@openreel/web` per [OPENREEL_NEXTJS_INTEGRATION.md §1](./OPENREEL_NEXTJS_INTEGRATION.md#1-install-the-sdk).
   - Run the host package manager’s install command.

2. **Headers**
   - Open `next.config.ts` / `next.config.mjs` / `next.config.js`.
   - Add `headers()` returning COOP `same-origin` and COEP `require-corp` (or `credentialless` if you intentionally standardize on that and understand CORP implications).
   - Prefer scoping `source` to the editor path (e.g. `/editor/:path*`) if you cannot tolerate global COEP.

3. **Client page**
   - Create a route file, e.g. `app/editor/page.tsx`.
   - First line: `'use client';` (App Router).
   - `import '@openreel/web/style.css';`
   - `const Editor = dynamic(() => import('@openreel/web').then(m => m.OpenReelEditor), { ssr: false, loading: ... })`
   - Default export renders `<Editor />` inside a full-size container (`100vw` / `100vh` or equivalent).

4. **Verify**
   - Start `next dev`, open the editor URL.
   - In DevTools → **Application** (Chrome), confirm the document is cross-origin isolated if your feature set requires it, or at minimum that no COOP/COEP console errors appear on load.
   - Confirm the editor UI appears (not infinite loading spinner from the dynamic `loading` fallback).

---

## Files the agent should typically touch

| File | Action |
|------|--------|
| `next.config.*` | Add `headers()` for COOP/COEP |
| `app/<segment>/page.tsx` (or `pages/<segment>.tsx`) | Client boundary + dynamic import + CSS import |
| `package.json` | Add `@openreel/web` dependency |

Do **not** import `@openreel/web` from server components without splitting; the editor must stay behind `ssr: false` or an equivalent client-only boundary.

---

## Failure modes and responses

| Error / behavior | Response |
|------------------|----------|
| Hydration mismatch involving editor | Ensure editor route is client-only and dynamically imported with `ssr: false`. |
| WASM crash / SAB-related errors | Fix COOP/COEP on the **HTML document** that loads the editor; middleware alone is insufficient if misconfigured. |
| Module not found `@openreel/web` | Fix install path / workspace; confirm `apps/web/dist` exists for git installs. |
| Styles missing | Add `import '@openreel/web/style.css'` in the same client module tree as `OpenReelEditor`. |

---

## Done criteria

- [ ] Editor route loads without console errors related to isolation or SSR.
- [ ] User can interact with the editor shell (not stuck on loading).
- [ ] Headers are documented in the host repo for future maintainers (comment in `next.config` is enough).

---

## Reference in this repository

- SDK entry: `apps/web/src/embed.tsx` → exports `OpenReelEditor`
- Library build: `apps/web/vite.config.ts` (`build.lib.entry`)

When changing the SDK surface, update **OPENREEL_NEXTJS_INTEGRATION.md** and this runbook together so humans and agents stay aligned.
