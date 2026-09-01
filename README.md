# IMC Construction — Frontend

A static Next.js 16 (App Router) + TypeScript + Tailwind v4 site for IMC Construction, styled
with a hand-built shadcn/ui-style component library (Radix primitives + `class-variance-authority`,
since the shadcn CLI registry wasn't reachable in the build sandbox — the components in
`src/components/ui` follow the same API shadcn generates, so the shadcn CLI can still be used
against this project later if you want to add more components).

## Getting started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## What's here

- **Pages**: Home, About, Services (index + one detail page per service), Landscape, Projects
  (with client-side category filtering), Contact (static form).
- **Layout**: sticky header with a desktop mega-menu for Services and a mobile slide-out sheet,
  footer, a floating social icon rail, and a floating chatbot widget with static keyword-matched
  replies.
- **Design system**: tokens for the blueprint/industrial blue palette live in
  `src/app/globals.css` (`@theme inline` block) — edit those CSS variables to retheme the whole
  site. Fonts (Barlow Condensed for display, Inter for body) are self-hosted via `@fontsource`,
  so there are no external font requests.
- **Data**: `src/data/services.ts`, `src/data/projects.ts`, and `src/data/nav.ts` hold all the
  static content. Swap these for API calls once the backend is live (see below).

## Connecting the Laravel backend later

`src/lib/config.ts` reads `NEXT_PUBLIC_API_URL` from `.env.local`. Nothing fetches from it yet —
every page currently renders from the static data files. When the API is ready, the pattern is:

```ts
import { API_URL } from "@/lib/config";

const res = await fetch(`${API_URL}/projects`, { cache: "no-store" });
const projects = await res.json();
```

Good places to wire this in first:
- `src/app/projects/page.tsx` (and `ProjectsGrid`) → replace the `projects` import with a fetch.
- `src/app/services/page.tsx` and `src/app/services/[slug]/page.tsx` → same pattern for services.
- `src/components/sections/contact-form.tsx` → the `handleSubmit` function already has a
  commented-out `fetch` call ready to uncomment.
- `src/components/shared/chat-widget.tsx` → swap `getReply()` for a real request to a `/chat`
  endpoint.

## Notes

- All content is static/placeholder — service descriptions come from the copy you provided;
  project, timeline, and office details are placeholders to replace with real data.
- Social links in `src/data/nav.ts` point to placeholder URLs — update with your real profiles.
