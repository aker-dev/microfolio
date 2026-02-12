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
```

Package manager: `pnpm` (locked to 9.12.0). Node.js 20+ required. No test framework configured.

## Architecture

### Content System

Projects live in `/content/projects/{slug}/` with:
- `index.md` — YAML frontmatter (title, date, location, coordinates, type, tags, featured, authors) + Markdown body
- `thumbnail.jpg` — Project thumbnail (optional `thumbnail.webp` for optimized version)
- `images/`, `videos/`, `documents/` — Resource subdirectories

Homepage content: `/content/index.md`. About page: `/content/about.md`.

### Data Loading

All routes use server-side loading (`+page.server.js`) that reads content from the filesystem at build time:
- `src/routes/+page.server.js` — Loads homepage + featured projects (filtered by `featured: true`)
- `src/routes/projects/+page.server.js` — Delegates to `$lib/utils/projects.js` shared loader
- `src/routes/projects/[slug]/+page.server.js` — Loads single project with resources and EXIF metadata extraction
- `src/routes/list/`, `map/`, `about/` — Each has its own `+page.server.js`

Content parsing pattern: split on `---`, parse YAML with `yaml`, convert Markdown with `marked`.

### Key Utilities

- `$lib/utils/paths.js` — `getBasePath()`: returns `/microfolio` in production, empty string otherwise (mirrors `svelte.config.js` logic)
- `$lib/utils/projects.js` — `loadProjects()`: shared project loading used by `/projects`, `/list`, `/map`
- `$lib/utils/imageMetadata.js` — EXIF/IPTC extraction via `exifreader` (credit, camera, GPS, etc.)
- `$lib/config.js` — Site config (title, social links, navigation)
- `$lib/i18n.js` — Internationalization setup with `svelte-i18n` (en/fr active, more commented out)

### Styling

- Tailwind CSS 4 configured in `src/app.css` with `@tailwindcss/typography` plugin
- Custom theme in `src/lib/theme.css`
- Dark mode via `prefers-color-scheme` media query with CSS custom properties
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

### Internationalization

- Locale strings in `src/lib/locales/{lang}.json`
- Default locale set in `$lib/config.js` (`siteConfig.locale`)
- RTL support in `+layout.svelte` (auto-detects and sets `dir` attribute)

## Project Metadata Schema

```yaml
title: 'Project Title'
date: '2023-01-01'
location: 'City, Country'
coordinates: [latitude, longitude]  # For map display
description: 'Project description'
type: 'architecture'                # Used for filtering
tags: ['tag1', 'tag2']
authors:
  - name: 'Author Name'
    role: 'Role'
featured: true                      # Shows on homepage
```
