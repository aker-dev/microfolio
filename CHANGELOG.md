# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.11.0] - 2026-08-19

### Added

- **A legal notice and a privacy policy**, as `content/legal.md` and `content/privacy.md` — templates to fill in, linked from the footer of every page. A site published in France is required to carry them, and most templates found online still cite article 6 III of the LCEN, which the loi SREN repealed in May 2024
- The landing page becomes a folder of its own, `landing/`, with a bilingual `legals.html` beside it — French and English on one page, since the loi Toubon asks for French to be present rather than exclusive, and one file cannot drift out of step with itself the way two would
- **A smoke pass over the site that actually ships**, `pnpm test:smoke`. Everything the suite tested until now, it tested against `pnpm dev`, and it finished before the build even started — so nothing ever loaded the built artefact. This one serves `build/` and walks its pages, asserting each returns 200, hydrates, throws nothing and asks for no same-origin file it does not have. Cross-origin requests are ignored on purpose: the font CDN and the tile server are somebody else's uptime and have no business failing a deploy. It runs in about seven seconds, and CI runs it after the build and before the artefact is uploaded
- That suite is there because of a bug 0.10.0 shipped: MapLibre builds its worker URL at runtime, Rollup could not see through it, and the production build referenced a chunk it had never emitted — the map came up blank while `pnpm dev` was perfect and every test passed. Reverting that fix now fails the smoke pass with a 404 on the missing chunk, while all 29 end-to-end tests still pass on the same broken build

### Changed

- **The landing page no longer loads Google Fonts.** It sat badly on a page describing a tool that avoids them; it now uses the same provider as the sites microfolio generates
- Both READMEs and the landing page state what the tool does about privacy, and only what can be checked in the code: no cookies, no analytics, **no consent banner because none is required**, no Google Fonts, a map with no API key. The typeface still comes from a third-party CDN, and that is named as a fact rather than dressed up
- They also carry what the pages actually measure — first paint under a second across the site on a throttled phone, and the map named as the exception it is, since a mapping engine costs what it costs
- The footer's **microfolio** link points at microfolio.net rather than at the repository
- `siteConfig.socialLinks` carry AKER's own accounts instead of the `yourusername` placeholders, since the published demo is AKER's site

### Fixed

- **The footer's copyright line wrapped, stranding the version number on a line of its own**, at every width between the `md` breakpoint and about 1000px. The row was three equal thirds, but the side cells hold a 36px button and three icons while the middle holds a sentence: the middle track was 235px at 768px and 278px at 900px, for a line that needs 312px. It is `1fr auto 1fr` now — the middle sizes to its content, the sides split the remainder evenly so the text stays centred. The version and the product name are also kept together, since a break between them was the worst place to break
- **The legal notice ran the publisher's identity into a single line** — share capital, street and town — because a single newline inside a Markdown paragraph is a space, not a break. Every line that has to stand on its own now ends with a backslash, and the template says so, since the file is meant to be rewritten with someone else's details
- **A deploy took 25 minutes instead of two.** `playwright install --with-deps` runs `apt-get`, and the runner image already carries every library Chromium links against — the log reports each as "already the newest version". The only packages it genuinely added were nine font sets for CJK, Thai and Cyrillic, 21.1 MB, which the Ubuntu mirror was serving at 14.8 kB/s. Chromium itself downloads in three seconds. The flag is gone; the step takes ten seconds

## [0.10.0] - 2026-08-17

### Added

- **Pages carry what they need to be shared and found**: Open Graph and Twitter tags on every page rather than on project pages alone, `og:url`, `og:image:alt`, `og:locale`, and a canonical link. A project page announces itself as an `article` and shares its own image
- **`sitemap.xml` and `robots.txt`**, both generated at build from the same project loader the site's own views use — nothing to keep in step by hand
- A 1200×630 sharing image per project, the shape Facebook, LinkedIn and X crop to. Generated alongside the WebP thumbnails
- `siteConfig.images.optimizeOnBuild` — image optimization runs as part of `pnpm build`. It used to be a tip printed _after_ the build, which nothing applied, so the published demo served every thumbnail at full size while a local build served WebP

### Changed

- **Breaking: the site's address is set once, as `siteConfig.url`.** It used to live in three places that had to agree — `static/CNAME`, `CUSTOM_DOMAIN` in `.env`, and `/microfolio` hard-coded in `svelte.config.js`. The base path and every absolute URL now come from it, and `CUSTOM_DOMAIN` is gone
- **`static/CNAME` is removed and not replaced.** Published through an Actions workflow, as this project is, GitHub Pages ignores any CNAME in the build: a custom domain is set in the repository settings. The file did nothing, and the documentation telling you to write it was wrong
- A menu item no longer shoves its neighbours sideways when it goes bold on hover: each one reserves its bold width from the start, so only the weight changes
- The tag controls — `+ n more`, `show less`, `✕ clear` — are set in bold, so they read as controls rather than as two more tags
- The error page is less tall, its centred block having reserved 70% of the viewport
- The map's attribution starts folded, down to its ⓘ button, and reads as a pill instead of a rectangle ending in a circle. Square corners there were ours: MapLibre rounds that container itself
- The video player on a project page is given a surface and a 16/9 box. Since nothing is preloaded it has no still to show, and left alone it was a hole in the page in dark mode — and a 4:1 strip, the browser's 300x150 default stretched to full width
- Map styles and zoom limits live at the top of the map route rather than in `config.js`. That file is what someone opens to set up their own site; a tile provider's URLs are not their business
- **The map draws OpenStreetMap the world over, through OpenFreeMap**, and no longer only France. 0.9.0 capped the zoom at 6 because Plan IGN stops covering the planet past that level; the cap is gone, and a project anywhere now zooms down to its street. Still no API key, and the attribution comes from the tiles themselves
- **The map has a dark mode.** Positron in light, Dark in dark, switching with the rest of the site — the two neutral styles OpenFreeMap publishes, so the map stays in the same black and white as every other page. Markers, controls and the attribution follow the theme with it

### Fixed

- **pnpm 11.20.0 could not be switched to.** Pinning it made every machine with a different global pnpm fail before startup, its own version-switch code being at fault rather than the lockfile. Pinned to 11.22.0, where it is fixed
- The image at the top of a project page held no height open, so the article and the credit block were shoved down as it arrived. Intermittent — 0.100 on two runs out of six, which is how three earlier runs missed it — and fixed by emitting the image's real pixel size rather than imposing a ratio that would crop it
- The map's attribution button carried MapLibre's blue focus glow, and `outline: none` on top, which is what had stopped the site's own focus ring from ever reaching it
- **Shared links showed no image.** `og:image` was written as a relative URL, which Open Graph ignores outright — the tag was there and did nothing, on every project page
- Project videos downloaded in full on page load despite `preload="metadata"`. The example project's video is 3 MB, more than the rest of that page put together, and it arrived whether or not anyone pressed play — the project page goes from 6448 kB to 321 kB
- The webfont was pulled in by an `@import` inside the stylesheet, which put it behind three round trips instead of one. First contentful paint improves by 100 to 288 ms across the home, map and project pages
- The map booted while the page was still hydrating, holding the first paint behind 977 kB of JavaScript. It now waits until the page has painted
- The image that decides the largest contentful paint was lazily loaded like every other

## [0.9.0] - 2026-08-14

### Added

- The lightbox gained an information panel carrying the image title, caption, credit and EXIF metadata. It takes its own column and pushes the image across on wide screens, and overlays it where there is no room for two columns
- Lightbox controls step out of the way once you have been still for a moment and return on any movement. The delay is `siteConfig.lightbox.hideControlsDelay`, in milliseconds, `0` keeping them on screen
- Project titles in the list view, and the type and tag badges on a project page, are now links into the projects view with that filter already applied
- A visible keyboard focus ring across the site
- `aria-expanded` on the mobile menu and the collapsible tag list, `aria-current` on the active pagination button
- On phones the filter panel collapses behind a button that reports how many filters are active
- `pnpm screenshots` regenerates the documentation screenshots, dark-mode set included, so a release no longer has to rediscover the scroll positions
- `.mcp.json` declares the official Svelte MCP server, which brings live documentation and a `svelte-autofixer` to anyone working on the project with an AI assistant
- `.claude/settings.json` lets the project's own scripts run without an approval prompt

### Changed

- **Homebrew installation now needs `brew trust aker-dev/tap` first.** Recent Homebrew versions will not load a third-party tap until it is trusted, so the command precedes the install everywhere the Homebrew route is documented
- The lightbox image fills the height of the viewport instead of stopping at 60% of it, and its controls no longer sit on top of it
- `/list` and `/projects` render their content on the server: it is in the static HTML rather than conjured at hydration
- Below `md`, list rows become cards instead of a seven-column table scrolling sideways
- Filter controls are inert until the page hydrates, and say so, rather than swallowing a click
- Select inputs show a pointer cursor
- The README screenshots were retaken — the previous set dated from August 2025 and showed 0.1.0-beta.3 — and moved to the end of the file, so what a reader needs comes first, and each is now framed in a browser window
- Selecting a project on the map shows a text-first summary rather than the thumbnail-led card used by the grids, whose 4:3 image took over the callout and most of the screen on a phone. The list view uses the same summary below `md`, and the whole block is the link rather than the title alone
- The veil behind that summary lost its blur and most of its opacity: the map stays legible behind it, and it was the last blurred, translucent surface in a site that is otherwise flat
- Below `md`, the list cards are parted by a rule, the same one that runs between the table's rows above `md`
- Image keywords in the lightbox read as plain text instead of borrowing the look of project tags, which are links and these are not
- Gallery images keep their own colours. They were desaturated until hovered, which hid whatever the photograph was actually about
- **The map runs on MapLibre GL and draws Plan IGN**, published by the Géoplateforme: French public data, no API key, and grey by design rather than by filter. Leaflet and the five marker images are gone. **Zoom is capped at 6, which is the last level Plan IGN covers worldwide** — a project anywhere on the planet still appears in its right place, but the map no longer reaches street scale. `siteConfig.map` holds the style, the cap and the attribution for anyone who wants another basemap
- Map markers are buttons, so the keyboard reaches them and they announce the project they stand for
- A featured project is marked on the map by the star, the same one the cards and the list use, rather than by a marker that changed colour. Every marker is white, and they are larger so the star reads among a hundred of them
- `pnpm dev` serves on port 5555 and `pnpm preview` on 2001, in place of Vite's defaults — Interstella 5555, and Discovery, the album it sets to pictures. Both are nominal: a busy port still sends Vite to the next one

### Fixed

- `/list` shipped nothing but a "Loading projects…" placeholder: invisible to search engines, blank without JavaScript, and a flash before hydration
- `/projects` rendered all 101 cards and then dropped to 20 on hydration
- A click on a filter before hydration was lost with no feedback at all
- Four `focus:outline-none` with no replacement left keyboard users with no idea where they were
- The map was frozen for as long as a project was selected: the veil covered it entirely and captured every event, so it could not be panned or zoomed, and no other marker could be reached without closing first
- The map had no keyboard exit — the close button was the only way out. Escape now closes the selected project
- On the map, the close button sat on top of the project title

### Removed

- The unused `loading_projects` string
- `svelte-complete.txt`, 810 KB of Svelte documentation frozen since July 2025, together with the `.vscode/settings.json` whose only purpose was feeding it to Copilot. The Svelte MCP server replaces it with documentation that stays current

## [0.8.2] - 2026-08-11

### Fixed

- Both READMEs still listed "Node.js LTS 20+" as the prerequisite, which since the pnpm 11 migration leads straight to the crash that 0.8.1 fixed in CI; they now name 22.13, and `LISEZMOI.md` no longer announces 0.7.0 features
- `__MACOSX` — the resource-fork folder macOS adds to archives, and therefore present whenever the bundled example projects are unpacked — was reported as a broken project on every build
- The end-to-end suite raced page hydration: filter controls are prerendered and clickable before Svelte attaches their listeners, so a click could be silently lost. It passed locally and failed on the slower CI runner. The tests now wait for the filters to be interactive
- Every workflow action still targeted the Node 20 runtime GitHub deprecated on its runners, warning on each build. They were several majors behind and are now current; `pnpm/action-setup` v6 also brings explicit pnpm 11 support

## [0.8.1] - 2026-08-11

### Fixed

- The deploy workflow still pinned Node.js 20, which pnpm 11 cannot run on — it loads `node:sqlite` — so 0.8.0 failed to build in CI before reaching any step. The workflow now uses Node 22, the requirement is declared in `engines` so an unsupported version fails at install with a clear message, and the installation guides name 22.13 as the floor instead of suggesting v20.11.0

## [0.8.0] - 2026-08-11

### Added

- Project frontmatter is validated on load: a project missing `title` or `date`, or carrying invalid YAML, is skipped and named in a summary at the end of the build instead of producing a broken page
- Projects without a `thumbnail.jpg` now render a labelled placeholder rather than a broken image, and no longer advertise a missing `og:image`
- Unit tests with Vitest covering the content parsing (`pnpm test`)
- End-to-end tests with Playwright covering navigation and URL state (`pnpm test:e2e`)
- Continuous integration now runs lint, unit tests and the end-to-end suite before building
- `aria-current="page"` on the active pagination button

### Changed

- **Node.js 22.13 or later is now required**, because pnpm 11 depends on `node:sqlite`. This is enforced at install time via `engines`, so an unsupported version fails with a message naming the requirement
- The project page's "Back to Projects" link is now "Back" and returns to the page you came from, restoring its filters, page number and scroll position; it falls back to the projects index when you arrived directly
- Migrated to pnpm 11, with its settings moved to `pnpm-workspace.yaml` and each dependency's build scripts explicitly allowed or refused
- Content loading is shared: the home page uses the same loader as the other views, and reading a Markdown page goes through a single helper
- Updated dependencies

### Fixed

- The browser's back button changed the URL without re-rendering the page, leaving the previous view on screen — a regression introduced in 0.7.0 by the shareable filtered URLs
- A `page` query parameter was ignored when a list was loaded, so a shared or bookmarked link always landed on page one
- An invalid date in a project failed the whole build with an opaque `RangeError` instead of reporting which project was at fault
- 45 ESLint errors, and a `prettier-plugin-tailwindcss` incompatible with prettier 3.9 that broke `pnpm lint` entirely

## [0.7.0] - 2026-02-12

### Added

- Dark mode toggle in footer with persistent user preference (localStorage)
- Reactive tag filters with automatic cleanup on category change
- Filter state synchronization with URL query parameters for shareable/bookmarkable links
- Rows-per-page setting synchronization with URL query parameters
- Counters on filters and collapsible tag list for improved UX
- Clear button and filled background on search input

### Changed

- Updated project tags display layout
- Streamlined CLAUDE.md project overview and development commands
- Updated packages to latest versions

### Fixed

- Corrected border class definitions in multiple components
- Applied code review improvements for client-side quality and performance

### Removed

- Unused authors section from project display
- Image optimization system and SEO accessibility audit documentation (redundant)
- Code review recommendations document (superseded)

## [0.6.0-beta.5] - 2025-12-07

### Added

- Version handling system with dedicated version.js module for centralized version management

### Changed

- Refactored version handling in components to use centralized version module
- Updated font weights to bold (weight 600) for improved emphasis across multiple components
- Improved font import strategy for better loading performance
- Updated IBM Plex Sans font loading to use CSS imports instead of local font files
- Updated packages to latest versions

### Fixed

- Improved accessibility across multiple pages and components
- Enhanced accessibility labels and ARIA attributes in filters and rows per page components
- Fixed IBM Plex Sans font-bold weight consistency (set to 600)

### Removed

- IBM Plex Sans font files (migrated to CSS imports)
- Unused index.js file from lib directory

## [0.5.0-beta.8] - 2025-10-06

### Added

- Featured project indicator with star icon in project list
- Featured projects filter option
- Bidirectional sort controls with dropdown and table headers
- Sorting functionality to project filters with localization for sort options
- Error handling component to display status messages
- Custom 404 error page with improved user experience
- Internationalization infrastructure with locale configuration (ready for multi-language support)

### Changed

- Integrated datatables into all project views with unified filtering
- Updated button styles for sort order toggle and header sorting for better UX
- Enhanced sort dropdown and toggle button styles for consistency

### Fixed

- Select-none class on error page container for improved user experience
- Prevent pointer events on sort icons in AkFilters component
- Set fallback to 404.html in Svelte configuration
- Conditional rendering for author role
- Vite configuration to only run static-copy during build to prevent file locking issues on Windows

## [0.4.0-beta.6] - 2025-09-25

### Added

- WebP thumbnail generation command (`pnpm optimize-images`)
- Image cleanup script (`pnpm run clean-images`) to remove optimized thumbnails when needed
- AkOptimizedImage component for improved image loading with WebP support
- Open Graph metadata for improved social sharing on project pages
- SEO and accessibility audit documentation

### Changed

- Enhanced build process with optional image optimization step
- Improved image loading performance with optimized WebP thumbnails
- Updated packages to latest versions

### Fixed

- Enhanced button hover effects and accessibility attributes across components
- Improved map height calculation for better responsiveness
- Standardized header elements across pages for consistency and accessibility
- Updated page titles to include siteConfig.title for consistency across routes
- Improved font loading by using local IBM Plex Sans file

## [0.3.0-beta.2] - 2025-09-22

### Added

- Custom featured marker icons for map display
- Marker source file (Affinity Designer) for design reference

### Fixed

- Updated marker icon URLs to use local assets instead of external sources
- Enhanced marker display with custom featured project markers
- Improved lightbox navigation button styles for better visibility and consistency

### Changed

- Optimized marker asset loading for improved performance

## [0.3.0-beta.1] - 2025-09-22

### Added

- Navigation arrows for image lightbox for better gallery navigation
- Toggle for displaying technical information in image lightbox
- Image metadata display in project gallery with EXIF/IPTC data
- Thumbnail metadata loading and display in project view
- Server-side image metadata loading for improved performance
- GitHub Sponsors funding configuration
- Initial landing page with Tailwind CSS styling for microfolio.net

### Changed

- Migrated image metadata loading to server-side for better performance
- Enhanced project display with improved title, description, and metadata styling
- Replaced exifr with ExifReader for improved metadata extraction
- Moved formatCreditLine processing to server-side
- Updated packages to latest versions
- Moved loadProjects function to utils and updated imports

### Fixed

- Enhanced lightbox display functionality
- Improved thumbnail and image metadata rendering with optional chaining
- Added custom color for list item markers in prose styles
- Corrected shutter speed formatting for fractional values
- Improved technical metadata formatting consistency
- Simplified metadata extraction for location fields
- Fixed GPS coordinates display
- Adjusted spacing and layout for project description and thumbnail
- Improved layout and styling of project details and sidebar
- Adjusted featured project icon placement and improved layout consistency
- Optimized image metadata loading and display formatting
- Streamlined credit line formatting by prioritizing credit over byline

### Refactored

- Simplified imageMetadata to only handle local files
- Simplified image metadata extraction and removed unused functions

## [0.2.0-beta.2] - 2025-08-24

### Added

- Dark mode theme support
- EXIF/IPTC metadata extraction and display for project images
- Project details including owner, status, surface area, and cost display
- Image hover effect utility class
- New favicon design

### Changed

- Updated example project images with demo metadata
- Streamlined theme color variables and removed redundant styles

### Fixed

- Updated map link to use OpenStreetMap instead of Google Maps
- Enhanced copyright notice formatting and added keyword parsing utility
- Fixed absolute Windows paths in URL handling

## [0.2.0-beta.1] - 2025-08-17

### Fixed

- **Critical**: Fixed static site generation issue where non-featured projects were not being prerendered, causing 404 errors for projects like residential-renovation
- Added explicit prerender entries generation to svelte.config.js to ensure all 101+ projects are properly built and accessible
- Fixed zip file filtering in project loading functions to prevent build errors with example_projects.zip

### Changed

- Enhanced svelte.config.js to dynamically generate all project routes for static site generation
- Improved error handling for zip files in content/projects directory

## [0.1.0-beta.4] - 2025-08-13

### Added

- AkFilters component for project filtering and searching functionality
- Comprehensive project audit report (French) covering architecture, security, code quality, performance, and testing strategy
- Screenshots to README and LISEZMOI documentation
- CLAUDE.md with project overview, development commands, and architecture details
- Installation instructions for microfolio via Homebrew and manual methods
- Enhanced Quick Start section with Homebrew installation instructions

### Changed

- Consolidated project loading logic into loadProjects function
- Updated installation instructions to emphasize restarting terminal/PowerShell for changes to take effect
- Updated configuration guide with detailed instructions for customizing config.js and personal information
- Cleaned and updated documentation (FR/EN)
- Updated Windows terminal instructions to use PowerShell instead of CMD

### Fixed

- Map display bug when scrolling or resizing (#3)
- Updated pnpm packages to latest versions
- Updated branch name in deploy workflow from main to preview
- Added captions track to video element in project page
- Ignore DS_Store files (#2)
- Include version in footer for better testing

### Removed

- Removed deploy-content.sh script as it is no longer needed

## [0.1.0-beta.3] - 2025-07-16

### Added

- Email template for beta testers in French
- Comprehensive beta tester guide for microfolio in French

## [0.1.0-beta.2] - 2025-07-15

### Added

- Example project files for the Sacred Aligot & Saucisse Cathedral of Rodez
- Custom domain configuration example to .env file
- Comprehensive bilingual documentation

### Fixed

- Excluded example project from gitignore to ensure proper version control

## [0.1.0-beta.1] - 2025-07-15

### Added

- Project listing page with filtering, sorting, and pagination features
- Location filter and display functionality for projects
- Comprehensive Svelte 5 documentation and VSCode settings for GitHub Copilot integration
- Support for @vincjo/datatables dependency for enhanced data table functionality

### Changed

- Updated README to clarify project view modes and add content customization instructions
- Streamlined deployment workflow by removing redundant content checkout and generation steps

### Fixed

- Updated project link to use base path for correct routing
- Improved example_projects_generator.sh to work on macOS & Linux/Ubuntu

### Removed

- Removed mdsvex integration and cleaned up configuration
