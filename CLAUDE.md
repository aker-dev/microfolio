# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

`.mcp.json` declares the official Svelte MCP server (`@sveltejs/mcp`): live documentation and a `svelte-autofixer` that validates Svelte source. Prefer it over recalling Svelte 5 semantics from memory. It replaced `svelte-complete.txt`, an 810 KB documentation dump that had been frozen since July 2025.

`.claude/settings.json` allowlists this project's own scripts so `pnpm lint`, `pnpm build` and friends run without a prompt.

## Project Overview

microfolio is a static portfolio generator built with SvelteKit 2, Svelte 5, and Tailwind CSS 4. It uses a file-based CMS (Markdown + YAML frontmatter) for content. Developed by AKER.

## Development Commands

```bash
pnpm dev              # Development server
pnpm build            # Production build (via build.js → vite build)
pnpm deploy           # Build with NODE_ENV=production (sets /microfolio base path)
pnpm preview          # Preview production build
pnpm lint             # Prettier check + ESLint
pnpm format           # Prettier auto-fix
pnpm optimize-images  # Generate WebP thumbnails via sharp
pnpm clean-images     # Remove generated optimized images
pnpm test             # Unit tests (Vitest, single run)
pnpm test:watch       # Unit tests in watch mode
pnpm test:e2e         # End-to-end tests (Playwright)
pnpm screenshots      # Regenerate doc/screenshots (needs a dev server; PORT=…)
```

`pnpm screenshots` drives `scripts/screenshots.js`. The footer renders the version from `package.json`, so bump before regenerating for a release. Dark-mode shots go through `prefers-color-scheme`, not the footer toggle.

Package manager: `pnpm` (pinned to 11.20.0 via `packageManager`). **Node.js 22.13+ required** — pnpm 11 uses `node:sqlite` and crashes on Node 20. Declared in `engines`, which `.npmrc`'s `engine-strict=true` enforces at install time; CI pins the same major.

pnpm 11 no longer reads the `pnpm` field in package.json — its settings live in `pnpm-workspace.yaml`, where `allowBuilds` lists which dependencies may run install scripts (build scripts are blocked by default) and `minimumReleaseAgeExclude` records packages accepted despite being published in the last 24h.

## Testing

- **Unit** — Vitest, co-located `src/**/*.test.js`. `vitest.config.js` deliberately omits the SvelteKit plugin, so these cover plain modules only (currently the content parsing) and run in ~150ms.
- **End-to-end** — Playwright, specs in `e2e/`. It starts its own dev server, or reuses one already running on the port. Set `PLAYWRIGHT_PORT` to exercise the CI path locally without colliding with a dev server on 5173.
- CI (`.github/workflows/deploy.yml`) runs lint, unit tests and e2e before building.
- Some specs run with `javaScriptEnabled: false` to assert that `/list` and `/projects` really do ship their content in the HTML, and others under a phone viewport. Everything else waits on `data-hydrated`, an attribute `+layout.svelte` sets on `<html>` once the tree is interactive: the whole page is prerendered, so a click can otherwise land on markup with no listener attached and be lost. That failure only ever showed on the slower CI runner.

### Two things a green suite will not tell you

**Look at anything visual.** The rebuilt lightbox shipped with its panel translucent, the page showing through the metadata, and every test passed — they asserted presence, not legibility. Take a screenshot and read it.

**Compare checksums on anything generated.** Two of the documentation screenshots were byte-identical for a while because a scroll silently did nothing; the images looked plausible individually. `md5 -q doc/screenshots/*.png | sort | uniq -d` catches it in a second.

**Do not trust a long-running dev server.** One left running on 5173 served stale code twice in a single session, once nearly leading to the conclusion that a working feature was broken. Verify against a fresh server: `CI=true PLAYWRIGHT_PORT=5199 pnpm test:e2e`.

## Architecture

### Content System

Projects live in `/content/projects/{slug}/` with:

- `index.md` — YAML frontmatter (title, date, location, coordinates, type, tags, featured, authors) + Markdown body
- `thumbnail.jpg` — Project thumbnail (optional `thumbnail.webp` for optimized version)
- `images/`, `videos/`, `documents/` — Resource subdirectories

Homepage content: `/content/index.md`. About page: `/content/about.md`.

### Data Loading

All routes use server-side loading (`+page.server.js`) that reads content from the filesystem at build time:

- `src/routes/+page.server.js` — Loads the homepage via `loadMarkdownPage()`, then filters `loadProjects()` on `featured: true`
- `src/routes/projects/+page.server.js` — Delegates to `$lib/utils/projects.js` shared loader
- `src/routes/projects/[slug]/+page.server.js` — Validates the frontmatter, then loads resources and EXIF metadata; a project that fails validation 404s rather than half-rendering
- `src/routes/list/`, `map/`, `about/` — Each has its own `+page.server.js`

Content parsing goes through `$lib/utils/markdown.js`, never an ad-hoc `split('---')`: its regex stops at the first closing delimiter, so a `---` horizontal rule in the body stays in the body.

### Key Utilities

- `$lib/utils/paths.js` — `getBasePath()`: returns `/microfolio` in production, empty string otherwise (mirrors `svelte.config.js` logic). Server-only: it reads `process.env`, so client code uses `base` from `$app/paths` instead
- `$lib/utils/projects.js` — `loadProjects()`: shared project loading used by the homepage, `/projects`, `/list`, `/map`. Validates each project, sorts by date, and reports skipped ones once per build
- `$lib/utils/markdown.js` — `splitFrontmatter()`, `renderMarkdownBody()`, `loadMarkdownPage()`
- `$lib/utils/projectFrontmatter.js` — `parseProjectFrontmatter()`: returns `{ metadata }` or `{ problem }` with a plain-language reason
- `$lib/utils/locale.js` — `getTextDirection()`, shared by `hooks.server.js` (prerender) and `+layout.svelte` (client)
- `$lib/utils/imageMetadata.js` — EXIF/IPTC extraction via `exifreader` (credit, camera, GPS, etc.)
- `$lib/config.js` — Site config (title, social links, navigation, `lightbox.hideControlsDelay`)
- `$lib/i18n.js` — Internationalization setup with `svelte-i18n` (en/fr active, more commented out)

### Styling

- Tailwind CSS 4 configured in `src/app.css` with `@tailwindcss/typography` plugin
- Custom theme in `src/lib/theme.css`
- Dark mode has two layers: a `prefers-color-scheme` media query for the default, and a `.dark` / `.light` class on `:root` for the explicit toggle in `AkFooter` (persisted in `localStorage`). An inline script in `app.html` applies the stored choice before first paint to avoid a flash
- Font: IBM Plex Sans (loaded from bunny.net CDN)
- `src/app.css` also holds two cross-cutting rules: a global `:focus-visible` outline so keyboard focus is never invisible, and `.ak-filters :disabled` for the pre-hydration state described under Components

### Components

All custom components use `Ak` prefix (e.g., `AkHeader`, `AkFooter`, `AkProjectCard`, `AkFilters`, `AkLightbox`, `AkOptimizedImage`). Datatable components (`Datatable`, `Search`, `ThSort`, `ThFilter`, `Pagination`, `RowCount`, `RowsPerPage`) power the `/list` view using `@vincjo/datatables`.

`AkFilters` builds its `TableHandler` in the component body rather than in an `$effect`, because effects never run on the server — that is what puts the rows of `/list` and the cards of `/projects` in the prerendered HTML. Only restoring state from the query string still waits for the browser. Its controls carry `disabled` until `onMount`, so a click landing before hydration cannot be silently lost. Below `md` its whole panel collapses behind a button that counts the active filters.

**`/list` renders its rows twice.** A card list below `md`, the seven-column table from `md` up — the table needed 840px inside 311px on a phone. Both live in `src/routes/list/+page.svelte` and iterate the same `handler.rows`. Add a column to one and you have to add it to the other; nothing in the markup says so.

### Build & Deployment

- Static site generation via `@sveltejs/adapter-static` (output: `/build`)
- `svelte.config.js` dynamically generates prerender entries by scanning `/content/projects/`
- `vite.config.js` copies the `content/` directory to build output via `vite-plugin-static-copy` (build only, not dev)
- Icons via `unplugin-icons` with Iconify JSON
- Base path: `/microfolio` in production, empty in dev. Set `CUSTOM_DOMAIN=true` env var to remove base path for custom domains
- Layout (`+layout.js`): `prerender = true`, `trailingSlash = 'always'`
- Deployment to GitHub Pages is triggered by a push to **`preview`**, not to `main` or `dev` — `.github/workflows/deploy.yml`. Work happens on `dev`; publishing means merging `dev` into `preview`
- That workflow unzips `content/projects/example_projects.zip` before installing, so the demo content CI builds and tests against comes from the zip, not from the working copy (only `example-project/` and the zip itself are tracked). It then runs lint, unit tests and e2e before the build

### Internationalization

- Locale strings in `src/lib/locales/{lang}.json`
- Default locale set in `$lib/config.js` (`siteConfig.locale`)
- RTL support via `getTextDirection()`: `hooks.server.js` fills the `lang` and `dir` placeholders in `app.html` at prerender, and `+layout.svelte` updates them when the locale changes client-side

## Project Metadata Schema

`title` and `date` are required. A project missing either, or whose YAML does not parse, is skipped from every view and named in a summary at the end of the build — it never fails the build. A missing `thumbnail.jpg` does not disqualify a project: it sets `hasThumbnail: false` and the UI shows a placeholder. Validation lives in `$lib/utils/projectFrontmatter.js`.

```yaml
title: 'Project Title' # required
date: '2023-01-01' # required, must be parseable by new Date()
location: 'City, Country'
coordinates: [latitude, longitude] # For map display
description: 'Project description'
type: 'architecture' # Used for filtering
tags: ['tag1', 'tag2']
authors:
  - name: 'Author Name'
    role: 'Role'
featured: true # Shows on homepage
```
