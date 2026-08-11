# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
```

Package manager: `pnpm` (pinned to 11.20.0 via `packageManager`). **Node.js 22.13+ required** — pnpm 11 uses `node:sqlite` and crashes on Node 20. Declared in `engines`, which `.npmrc`'s `engine-strict=true` enforces at install time; CI pins the same major.

pnpm 11 no longer reads the `pnpm` field in package.json — its settings live in `pnpm-workspace.yaml`, where `allowBuilds` lists which dependencies may run install scripts (build scripts are blocked by default) and `minimumReleaseAgeExclude` records packages accepted despite being published in the last 24h.

## Testing

- **Unit** — Vitest, co-located `src/**/*.test.js`. `vitest.config.js` deliberately omits the SvelteKit plugin, so these cover plain modules only (currently the content parsing) and run in ~150ms.
- **End-to-end** — Playwright, specs in `e2e/`. It starts its own dev server, or reuses one already running on the port. Set `PLAYWRIGHT_PORT` to exercise the CI path locally without colliding with a dev server on 5173.
- CI (`.github/workflows/deploy.yml`) runs lint, unit tests and e2e before building.

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
- `$lib/config.js` — Site config (title, social links, navigation)
- `$lib/i18n.js` — Internationalization setup with `svelte-i18n` (en/fr active, more commented out)

### Styling

- Tailwind CSS 4 configured in `src/app.css` with `@tailwindcss/typography` plugin
- Custom theme in `src/lib/theme.css`
- Dark mode has two layers: a `prefers-color-scheme` media query for the default, and a `.dark` / `.light` class on `:root` for the explicit toggle in `AkFooter` (persisted in `localStorage`). An inline script in `app.html` applies the stored choice before first paint to avoid a flash
- Font: IBM Plex Sans (loaded from bunny.net CDN)

### Components

All custom components use `Ak` prefix (e.g., `AkHeader`, `AkFooter`, `AkProjectCard`, `AkFilters`, `AkOptimizedImage`). Datatable components (`Datatable`, `Search`, `ThSort`, `ThFilter`, `Pagination`, `RowCount`, `RowsPerPage`) power the `/list` view using `@vincjo/datatables`.

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
