# OpenTrip — Next.js 15 (App Router)

This is a conversion of the original Vite + React SPA into a production-ready
**Next.js 15** project using the **App Router**. The UI, copy, colors, spacing,
and behavior are preserved exactly — only the underlying routing/framework
changed.

## What changed vs. the original Vite app

- **Real routes instead of in-memory state.** The original app kept a single
  `currentPage` state variable in `App.tsx` and swapped components in place.
  It's now genuine, shareable, bookmarkable, back/forward-button-friendly
  URLs:
  - `/` — Landing page
  - `/search` — Search / listing page
  - `/trip/[id]` — Trip detail page
  - `/booking/[id]` — Booking flow
  - `/dashboard` — User dashboard
- **`onNavigate(page, tripId)` → `useAppNavigate()`.** Every component that
  used to receive an `onNavigate` prop now calls the `useAppNavigate()` hook
  directly (`src/hooks/useAppNavigate.ts`), which maps the same `Page` names
  to real `router.push()` calls. This kept every existing click handler's
  code identical — only the prop plumbing was removed.
- **Dynamic route params.** `/trip/[id]` and `/booking/[id]` are thin async
  Server Component wrappers (`generateMetadata` + `generateStaticParams`
  included) that unwrap Next 15's `params` Promise and hand off to the
  original client components (`src/components/pages/TripDetailPage.tsx`,
  `src/components/pages/BookingPage.tsx`).
- **Tailwind v4** is wired up via `@tailwindcss/postcss` (Next.js doesn't use
  the Vite plugin) — the design tokens in `globals.css` (`@theme`, colors,
  radii, shadows, fonts) are copied over unchanged.
- **Global `<Navbar />`** now lives in `app/layout.tsx` (previously rendered
  once at the top of `App.tsx`), so it persists across all routes exactly as
  before.
- Added `generateMetadata` per route and a matching 404 page — small
  production touches that a client-only SPA doesn't get for free.

## Not changed

- All Tailwind classes, inline styles, copy (Indonesian text), and data in
  `src/data/trips.ts` are byte-for-byte the same as the original.
- `TripCard.tsx` is untouched aside from the `'use client'` directive.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Build for production

```bash
npm run build
npm run start
```

## Notes / suggested follow-ups

- Images are still plain `<img>` tags (pointing at Unsplash), matching the
  original pixel-for-pixel. `next.config.ts` already whitelists
  `images.unsplash.com` in `remotePatterns` if you'd like to switch these to
  `next/image` for automatic optimization later.
- All booking/dashboard data is mocked in-memory, same as the original —
  there's no backend/API wired up yet.
