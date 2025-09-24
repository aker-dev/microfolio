# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

microfolio is a modern static portfolio generator built with SvelteKit 2 and Tailwind CSS 4. It features a file-based content management system using folders and Markdown files, perfect for showcasing creative work. The project is developed by AKER and includes features like multiple view modes, interactive maps, smart tagging, and responsive design.

## Development Commands

### Essential Commands

```bash
# Development server
pnpm dev


# Preview production build
pnpm preview

# Lint code
pnpm lint

# Format code
pnpm format

# Deploy (production build with NODE_ENV=production)
pnpm deploy

# Build only (without image optimization)
pnpm build

# Generate optimized images (AVIF/WebP thumbnails)
pnpm optimize-images

# Full build with image optimization
pnpm build:full
```

### Package Management

- Uses `pnpm` as the package manager (locked to pnpm@9.12.0)
- Node.js LTS 20+ required
- Key dependencies include:
  - SvelteKit 2 (`@sveltejs/kit`, `@sveltejs/adapter-static`)
  - Tailwind CSS 4 with Vite plugin (`tailwindcss`, `@tailwindcss/vite`)
  - Leaflet for interactive maps
  - `marked` for Markdown parsing, `yaml` for frontmatter
  - `@vincjo/datatables` for list view functionality
  - `exifreader` for image metadata extraction
  - Iconify for icon system (`@iconify/svelte`, `unplugin-icons`)

## Architecture Overview

### File-Based Content System

- **Content structure**: `/content/` directory contains Markdown files with YAML frontmatter
- **Projects**: Each project lives in `/content/projects/{project-name}/` with:
  - `index.md` - Project metadata and content
  - `thumbnail.jpg` - Project thumbnail
  - `images/`, `documents/`, `videos/` subdirectories
- **Home page**: `/content/index.md` defines homepage content

### Core Application Structure

**SvelteKit Architecture**:

- `/src/routes/` - File-based routing with server-side data loading
- `/src/lib/components/` - Reusable Svelte components (AkHeader, AkFooter, AkProjectCard, etc.)
- `/src/lib/config.js` - Site configuration including navigation and social links
- Static adapter configuration for GitHub Pages deployment

**Key Routes**:

- `/` - Homepage with featured projects
- `/projects` - Gallery view of all projects
- `/list` - Datatable view with filtering
- `/map` - Interactive Leaflet map view
- `/about` - About page from `/content/about.md`

### Data Loading Pattern

- Server-side data loading in `+page.server.js` files
- Reads Markdown files with YAML frontmatter using `fs/promises`
- Parses YAML metadata with `yaml` library
- Converts Markdown to HTML using `marked`

### Styling & UI

- Tailwind CSS 4 with typography plugin
- Custom components with AK prefix (AkHeader, AkFooter, AkProjectCard, etc.)
- Responsive design with mobile-first approach
- Datatable functionality using `@vincjo/datatables`

### Build & Deployment

- Static site generation using `@sveltejs/adapter-static`
- GitHub Pages deployment support with path configuration
- Vite for bundling with static file copying for content
- Content directory copied to build output for static serving

### Configuration Details

- **Base path**: Configurable for GitHub Pages (`/microfolio`) vs custom domains via environment variables
  - `CUSTOM_DOMAIN=true` removes base path for custom domains
  - Production builds use `/microfolio` base path by default
- **Environment handling**: Different configs for development vs production in `svelte.config.js`
- **Prerendering**: Dynamic entry generation for all project pages in `svelte.config.js`
- **Static assets**: Content, CNAME file for custom domains
- **Site configuration**: Centralized in `/src/lib/config.js` including navigation, social links, and metadata

## Project Metadata Schema

Projects use YAML frontmatter with this structure:

```yaml
title: 'Project Title'
date: '2023-01-01'
location: 'City, Country'
coordinates: [latitude, longitude] # For map display
description: 'Project description'
type: 'architecture|design|art|etc'
tags: ['tag1', 'tag2']
authors:
  - name: 'Author Name'
    role: 'Role'
featured: true # Shows on homepage
```

## Testing & Quality

- ESLint configuration with Svelte plugin
- Prettier for code formatting
- No test framework currently configured

## CLI Tool Integration

This project includes a CLI tool called `microfolio` available via Homebrew:

- `microfolio new <name>` - Create new portfolio from template
- `microfolio dev` - Start development server (equivalent to `pnpm dev`)
- `microfolio build` - Build for production (equivalent to `pnpm build`)

## Deployment Notes

- Builds to `/build` directory
- Supports GitHub Pages and custom domains
- Content files are copied to build output for static serving
- Production builds use `NODE_ENV=production` for path configuration
- Custom build script (`build.js`) handles special production requirements
