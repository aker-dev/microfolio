# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

microfolio is a modern static portfolio generator built with SvelteKit 2 and Tailwind CSS 4. It features a file-based content management system using folders and Markdown files, perfect for showcasing creative work. The project is developed by AKER and includes features like multiple view modes, interactive maps, smart tagging, and responsive design.

## Development Commands

### Essential Commands
```bash
# Development server
pnpm dev

# Production build
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint

# Format code
pnpm format

# Deploy (production build with NODE_ENV=production)
pnpm deploy
```

### Package Management
- Uses `pnpm` as the package manager
- Node.js LTS 20+ required
- Dependencies include SvelteKit, Tailwind CSS, Leaflet for maps, marked for Markdown parsing

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
- **Base path**: Configurable for GitHub Pages (`/microfolio`) vs custom domains
- **Environment handling**: Different configs for development vs production
- **Static assets**: Content, CNAME file for custom domains

## Project Metadata Schema

Projects use YAML frontmatter with this structure:
```yaml
title: 'Project Title'
date: '2023-01-01'
location: 'City, Country'
coordinates: [latitude, longitude]  # For map display
description: 'Project description'
type: 'architecture|design|art|etc'
tags: ['tag1', 'tag2']
authors:
  - name: 'Author Name'
    role: 'Role'
featured: true  # Shows on homepage
```

## Testing & Quality

- ESLint configuration with Svelte plugin
- Prettier for code formatting
- No test framework currently configured

## Deployment Notes

- Builds to `/build` directory
- Supports GitHub Pages and custom domains
- Content files are copied to build output for static serving
- Production builds use `NODE_ENV=production` for path configuration