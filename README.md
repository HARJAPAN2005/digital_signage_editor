# Digital Signage Editor SDK

> **A professional, browser-based video and digital signage editor packaged as a Next.js-compatible SDK.**

This repository contains the source code for a fully-featured, client-side digital signage editor. Built with React, TypeScript, WebCodecs, and WebGPU, it allows users to edit video, add tickers, clocks, and charts entirely in the browser without server-side processing.

---

## Features

- **Digital Signage Widgets**: Built-in support for clocks, tickers, countdowns, calendars, live charts, iframes, and PDFs.
- **100% Client-Side**: No video uploads required. Everything renders locally utilizing WebGPU and WebCodecs.
- **Multi-track Timeline**: Layer videos, audio, images, text, and graphics effortlessly.
- **Natively Embeddable**: Bundled as a React component SDK for seamless integration into host applications (like Next.js).

---

## SDK Integration Testing Guide

To test this SDK in a new Next.js project (or your main application), follow these exact steps:

### 1. Installation

Install the editor directly from this GitHub repository into your Next.js project. Ensure you use the exact workspace fragment syntax.

**If using NPM:**
```bash
npm install git+https://github.com/HARJAPAN2005/digital_signage_editor.git
```

**If using PNPM (Recommended):**
```bash
pnpm add github:HARJAPAN2005/digital_signage_editor.git#workspace=@openreel/web
```
*(Note: Ensure this repository's `apps/web/dist` folder is fully committed to GitHub before running the install!)*

### 2. Next.js Security Headers (CRITICAL)

Because this editor utilizes high-performance browser features like WebAssembly and `SharedArrayBuffer` for video processing, your Next.js server **MUST** send specific security headers. If these headers are missing, the WebAssembly engine will crash.

Update your `next.config.js` (or `.mjs`) file in your testing project:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Apply headers to all routes, or specifically the route hosting the editor
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### 3. Rendering the Editor Component

Since the editor relies heavily on browser-only APIs (`window`, WebGL, WebCodecs), it **cannot be rendered on the server**. You must use Next.js's dynamic imports with `ssr: false`.

Create a testing page (e.g., `app/editor/page.tsx` or `pages/editor.tsx`):

```tsx
'use client'; // Required if using Next.js App Router

import dynamic from 'next/dynamic';
// Import the compiled CSS for the editor UI
import '@openreel/web/style.css'; 

// Dynamically load the SDK and disable Server-Side Rendering
const Editor = dynamic(
  () => import('@openreel/web').then((mod) => mod.OpenReelEditor),
  { ssr: false, loading: () => <div style={{ padding: '2rem' }}>Loading Editor Engine...</div> }
);

export default function EditorTestingPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>
      <Editor />
    </div>
  );
}
```

### 4. Run the Testing Server

Start your Next.js host application:
```bash
npm run dev
```
Navigate to your testing route (e.g., `http://localhost:3000/editor`). You should see the fully functional Digital Signage Editor embedded inside your application!

---

## Local Development & Modification

If you need to make changes to the editor's source code here rather than just embedding it:

1. Clone this repository locally.
2. Install dependencies via `pnpm install` (requires Node.js 18+).
3. Start the development server using `pnpm dev`.
4. Once your modifications are complete, you **must rebuild the SDK** so your host application receives the updates. Run `pnpm build` and commit the modified `apps/web/dist` folder to GitHub.
