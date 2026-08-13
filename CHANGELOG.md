# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.9.0] - 2026-08-13

### Added

- The lightbox gained an information panel carrying the image title, caption, credit and EXIF metadata. It takes its own column and pushes the image across on wide screens, and overlays it where there is no room for two columns
- Lightbox controls step out of the way once you have been still for a moment and return on any movement. The delay is `siteConfig.lightbox.hideControlsDelay`, in milliseconds, `0` keeping them on screen
- Project titles in the list view, and the type and tag badges on a project page, are now links into the projects view with that filter already applied
- A visible keyboard focus ring across the site
- `aria-expanded` on the mobile menu and the collapsible tag list, `aria-current` on the active pagination button
- On phones the filter panel collapses behind a button that reports how many filters are active

### Changed

- The lightbox image fills the height of the viewport instead of stopping at 60% of it, and its controls no longer sit on top of it
- `/list` and `/projects` render their content on the server: it is in the static HTML rather than conjured at hydration
- Below `md`, list rows become cards instead of a seven-column table scrolling sideways
- Filter controls are inert until the page hydrates, and say so, rather than swallowing a click
- Select inputs show a pointer cursor

### Fixed

- `/list` shipped nothing but a "Loading projects…" placeholder: invisible to search engines, blank without JavaScript, and a flash before hydration
- `/projects` rendered all 101 cards and then dropped to 20 on hydration
- A click on a filter before hydration was lost with no feedback at all
- Four `focus:outline-none` with no replacement left keyboard users with no idea where they were

### Removed

- The unused `loading_projects` string

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

## [Unreleased]

### Added

- Initial project structure
- Basic portfolio functionality

---

**Note**: This is a beta release. Please report any issues you encounter.
