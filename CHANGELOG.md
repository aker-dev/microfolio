# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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