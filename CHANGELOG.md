# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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