# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Mentora LMS — Compliance Training Portal for MoMo. Vanilla-stack web app (no framework, no build step). Two surfaces: the learner portal (`index.html`) and the admin dashboard (`admin/index.html`), deployed on Vercel and backed by Supabase + Google Sheets.

Production: `https://mentora-lms-tau.vercel.app`

## Commands

```bash
npm start         # node server/server.js — local Express, port 3000
npm run dev       # same with --watch (auto-reload on file changes)
```

There is **no build, lint, test, or bundler step** — files are served as-is. Editing HTML/CSS/JS = refresh browser to see changes. The `package.json` exists only because `api/modules.js` (Vercel serverless) imports `googleapis`.

Local dev requires `.env` (copy `.env.example`) with `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `JWT_SECRET`, `PORT`. The Express server reads these; the deployed Vercel build does not (it uses the serverless function in `api/` and Supabase for everything else).

## Architecture — the dual-backend split

This repo has **two parallel backends** that handle different concerns. Knowing which one a piece of data flows through is the most important thing to grok before editing:

### 1. Vercel-side (production)
- `api/modules.js` — single serverless function that reads modules from a Google Sheet via service account. Triggered by `GET /api/modules`.
- `vercel.json` rewrites: `/admin` → `admin/index.html`, anything else → `index.html` (SPA fallback). Static assets (`.css/.js/.png/.otf`) bypass rewrites.
- **Supabase** is called *directly from the browser* (not via the server) using the JS SDK. Both `script.js` (line ~263, `SB_URL` + anon key) and `admin/admin.js` (lines 6–11) hard-code the Supabase URL + anon key. Tables: `page_views`, `quiz_attempts`, `quiz_answers`, `announcements` (DDL in `supabase/setup.sql`).

### 2. Express-side (`server/`, local dev only)
- `server/server.js` serves the same static files + mounts `/api/*` routes from `server/routes/api.js`.
- `server/db.js` is a **JSON-file database** (`data/lms-db.json`) — atomic writes via tmp+rename, no schema. Tables: `page_views`, `quiz_attempts`, `modules_cms`.
- `server/middleware/auth.js` does JWT verification for admin routes.
- This Express layer is **not deployed to Vercel** — it's a parallel implementation for offline/local work. The browser code talks to Supabase, not to these Express endpoints, when running on Vercel.

When asked to add a feature involving analytics or data, decide first: does it go through Supabase (production path) or `server/db.js` (Express path)? They are not synced.

## Frontend architecture

Three large files do almost everything. None is modular — they're long single files with section comment banners:

| File | LOC | Role |
|------|-----|------|
| `script.js` | ~1900 | Learner portal: page routing (list/detail/map), module rendering, quiz logic, hotspots, certificate, knowledge map SVG, Supabase tracking |
| `styles.css` | ~1500 | Learner portal styles. Uses CSS custom properties (`--accent`, `--bg-app`, etc.) — change tokens at the top of the file rather than overriding individual rules |
| `admin/admin.js` | ~2200 | Admin dashboard: Supabase client, login, stats/sparklines/funnel charts (Chart.js v4), CRUD for modules, drilldown panel |
| `admin/admin.css` | ~1250 | Admin dashboard styles |

**Routing is fake-SPA**: `script.js` has `showPage('list' | 'detail' | 'map')` that toggles `display:none` on `#page-list / #page-detail / #page-map`. There is no real router; deep links work via the Vercel SPA fallback returning `index.html`.

**Module data has two sources**: 
- Static fallback: `data/modules.json` (committed)
- Live: `GET /api/modules` (Google Sheets) — `script.js` fetches this and falls back to the JSON file on failure

## Brand & design system (important — recently overhauled)

The visual design is **MoMo brandbook-inspired** (modeled after `momo.m-n.associates`). Key tokens defined in `styles.css`:

- Fonts (self-hosted from `/fonts/`): **MoMo Trust Display** (headings, weight 800), **MoMo Trust Sans** (body, 300/400/500), **MoMo Signature** (decorative — used via `.sig` class)
- Primary accent: `#a50064` (PANTONE 234 C, MoMo pink) — exposed as `--accent`, `--primary`
- Pink scale: `--pink-50` through `--pink-600`
- Status colors come from MoMo's official palette (`--green #5ea12a`, `--red #e5303f`, etc.) — do not substitute Tailwind/standard colors

**Navigation pattern**: Single pill-shaped "MENU" button (`.nav-toggle-pill`) at the **left** of the navbar opens a full-screen overlay (`.menu-overlay`) with 2 columns (Tổng Quan, Modules). Inline nav links have been removed — the hamburger overlay is the primary nav. When editing nav, preserve this pattern.

**Typography rule**: Headings use Trust Display 800; only 1–2 words in a heading may be styled `.sig` (Signature font, accent color). Don't put whole headings in Signature.

## Conventions

- All UI strings are **Vietnamese**. New code should follow.
- File comments use `══════` banners as visual section separators.
- No frameworks, no JSX, no TypeScript. Vanilla DOM (`document.querySelector`, `addEventListener`) only. Don't introduce React/Vue/Svelte.
- Chart.js v4 is loaded via CDN in admin only. **Always wrap canvases in a fixed-height `<div>`** (e.g. `.stat-spark` is 32px tall) when using `maintainAspectRatio: false`, otherwise the chart triggers an infinite resize loop and grows the page indefinitely. This bug bit before — see the sparkline pattern in `admin/admin.js` for the correct setup.
- Light/dark mode was removed; do not reintroduce theme toggles unless asked.
- Supabase URL + anon key are intentionally committed (anon key is public-safe by design with RLS). Don't move them to `.env` for the browser-side code — that breaks the Vercel-only deployment which has no env injection step for static files.

## Auto-commit policy (from user memory)

After completing edits, **automatically commit and push to GitHub** without asking. The user has confirmed they want this default. Use a concise commit message describing the change. Do not run `git add -A` blindly — stage specific files (`git add index.html styles.css ...`) to avoid pulling in scratch files from the working directory (this has happened before; junk like `##`, `Fetch`, `Welcome`, `.server.pid` got committed and had to be removed).

## Reference docs in repo

- `PRD.md` — full product spec (Vietnamese), personas, KPIs, feature list
- `HANDOVER.md` — operational handover guide for HR/non-technical successors (Vietnamese)
- `supabase/setup.sql` — DDL to recreate the Supabase tables from scratch
