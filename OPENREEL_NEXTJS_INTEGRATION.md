# OpenReel + Next.js integration

This document is the **canonical integration guide** for embedding the `@openreel/web` SDK (`OpenReelEditor`) in a Next.js application.

The published package is an **ESM React library** built from `apps/web/src/embed.tsx`. It expects **React 18** as a peer and must run **only in the browser** (no server-side render for the editor subtree).

---

## 1. Install the SDK

### From this monorepo (local development)

In your host app’s `package.json`, depend on the workspace package (example: pnpm workspace):

```json
{
  "dependencies": {
    "@openreel/web": "workspace:*"
  }
}
```

Run `pnpm install` from the monorepo root so `apps/web` is linked.

### From GitHub (consumer app)

The SDK ships from `apps/web` with prebuilt `dist/`. Ensure the revision you install includes a committed `apps/web/dist` (or build the package locally before packing).

With **pnpm**, a subdirectory dependency can look like:

```bash
pnpm add "@openreel/web@github:augani/openreel#main:apps/web"
```

Adjust the branch or tag (`#v0.1.0:apps/web`, etc.) to match the release you pin.

**npm** does not support monorepo subpaths as cleanly; cloning the repo, running `pnpm install` and `pnpm build` at the root, then `pnpm pack` inside `apps/web` and installing the tarball is a reliable fallback.

---

## 2. Cross-origin isolation headers (required)

The editor uses browser features (WebAssembly, and in some configurations `SharedArrayBuffer`) that require a **cross-origin isolated** (or compatible) context. Your Next.js app must send:

- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Embedder-Policy: require-corp` **or** `credentialless` (stricter hosts often use `require-corp`; this repo’s Vite dev server uses `credentialless` for local DX)

Example for `next.config.js` / `next.config.mjs` applying to the route that hosts the editor (or globally):

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
    ];
  },
};

export default nextConfig;
```

If you use `require-corp`, third-party iframes or assets without proper CORP/CORS may break on that page—scope the `source` pattern to the editor route when possible.

---

## 3. Client-only entry and dynamic import

Do **not** render `OpenReelEditor` during SSR. Use the App Router with a client file, or `next/dynamic` with `ssr: false`.

### App Router example (`app/editor/page.tsx`)

```tsx
"use client";

import dynamic from "next/dynamic";
import "@openreel/web/style.css";

const Editor = dynamic(
  () => import("@openreel/web").then((m) => m.OpenReelEditor),
  { ssr: false, loading: () => <p>Loading editor…</p> }
);

export default function EditorPage() {
  return (
    <div style={{ width: "100vw", height: "100vh", margin: 0, padding: 0 }}>
      <Editor />
    </div>
  );
}
```

Give the container a defined height (full viewport is typical) so the editor layout can measure correctly.

---

## 4. Styles and static assets

- Import **`@openreel/web/style.css`** once on the client route that mounts the editor (as above).
- The package `exports` field exposes `"./assets/*"` for files emitted next to the bundle. If your bundler resolves assets from the package differently, keep `@openreel/web` on a supported Next.js + bundler version and avoid custom `transpilePackages` rules unless needed.

---

## 5. Rebuild and publish expectations

If you change `apps/web` source in this repo:

1. From the monorepo root: `pnpm build` (builds WASM and the web package).
2. Commit the updated `apps/web/dist` if consumers install from Git without a separate build step.

---

## 6. Optional analytics (source builds only)

`OpenReelEditor` initializes PostHog when `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` are set at **build time** of `@openreel/web`. Prebuilt tarballs from CI typically omit keys; that is normal.

---

## 7. Troubleshooting

| Symptom | Likely cause |
|--------|----------------|
| WASM / worker errors, blank canvas | Missing or wrong COOP/COEP headers on the page serving the editor |
| `window is not defined` / hydration errors | `OpenReelEditor` imported or rendered on the server—use `ssr: false` and a client boundary |
| Stale UI after upgrading SDK | Host lockfile / cache; confirm new `dist` and restart dev server |

For a **checklist-oriented** flow (including for automation), see [OPENREEL_NEXTJS_AGENT_RUNBOOK.md](./OPENREEL_NEXTJS_AGENT_RUNBOOK.md).
