# microfolio

_[🇫🇷 Lire en français](LISEZMOI.md)_

A modern static portfolio generator built with **SvelteKit 2** and **Tailwind CSS 4** by AKER. Features a file-based content management system using folders and Markdown files. Perfect for designers, artists, architects, and creatives who want to showcase their projects elegantly and professionally.

**Live Demo**: [https://aker-dev.github.io/microfolio/](https://aker-dev.github.io/microfolio/)

> **We're looking for translators!** Help us make microfolio accessible in more languages. Contact us at **hello@aker.pro** if you'd like to contribute a translation.

## ✅ Features

- **📁 File-based CMS** — No database needed, just folders and Markdown files
- **🎨 Multiple Views** — Projects grid, List, and Map modes
- **📱 Responsive Design** — Mobile-first approach
- **🏷️ Smart Tagging** — Filter counters and collapsible tag list
- **🗺️ Interactive Map** — Leaflet integration with geolocated projects
- **🚀 Static Generation** — Optimal performance with SvelteKit adapter-static
- **🖼️ Image Lightbox** — Enhanced gallery with navigation arrows and metadata display
- **📊 EXIF/IPTC Metadata** — Automatic extraction and display of image technical information
- **🌙 Dark Mode** — Toggle in footer with persistent preference (system / manual / localStorage)
- **⚡ Image Optimization** — WebP thumbnail generation with `pnpm optimize-images`
- **🔗 Shareable URLs** — Filter, search, sort, and pagination state synced to URL query params
- **🌐 Internationalization** — English/French via svelte-i18n, RTL-ready
- **🏷️ OG Metadata** — Social sharing previews for projects and pages
- **📄 Pagination & Sorting** — Customizable rows-per-page, sort by date, title, type, or location

## 🧪 Beta Testing Program

**We're looking for beta testers!** Are you a creative and want to test microfolio?

👉 **[Beta Tester Guide](doc/en/beta-testers-guide.md)** - Complete guide to get started

📧 Contact **hello@aker.pro** to join the testing program.

## 🚀 Quick Start

### Option 1: Homebrew Installation (macOS - Recommended)

```bash
# Install microfolio via Homebrew
brew install aker-dev/tap/microfolio

# Create a new portfolio
microfolio new my-portfolio
cd my-portfolio

# Start the development server
microfolio dev
```

### Option 2: Manual Installation

#### Prerequisites

- Node.js 22.13 or later (required by pnpm 11; tested with 22.x and 24.x)
- pnpm package manager
- Git for version control

```bash
# Clone the template
git clone https://github.com/aker-dev/microfolio.git my-portfolio
cd my-portfolio

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

📖 **Detailed installation guide**: [doc/en/01-installation.md](doc/en/01-installation.md)

## 🖥️ Screenshots

### Homepage Views

![microfolio Homepage 1](doc/screenshots/microfolio_home_01.png)
![microfolio Homepage 2](doc/screenshots/microfolio_home_02.png)

### Project Views

![microfolio Projects Gallery](doc/screenshots/microfolio_projects.png)
![microfolio Project Detail 1](doc/screenshots/microfolio_project_01.png)
![microfolio Project Detail 2](doc/screenshots/microfolio_project_02.png)

### List View

![microfolio List View](doc/screenshots/microfolio_list.png)

### Map View

![microfolio Interactive Map](doc/screenshots/microfolio_map.png)

## 📚 Documentation

- **[Installation Guide](doc/en/01-installation.md)** - Installation and prerequisites
- **[Configuration](doc/en/02-configuration.md)** - Site customization
- **[Adding Projects](doc/en/03-adding-projects.md)** - Create and organize projects
- **[Publishing](doc/en/04-publication.md)** - Deploy your portfolio
- **[Beta Tester Guide](doc/en/beta-testers-guide.md)** - Guide for beta testers

## 🚀 Deployment

📖 **Complete deployment guide**: [doc/en/04-publication.md](doc/en/04-publication.md)

### Quick Deploy to GitHub Pages

```bash
# Build the site
microfolio build  # or pnpm build

# Enable GitHub Pages in repository settings
# Push to main branch - automatic deployment
```

## 🤝 Contributing

Contributions are welcome! Fork the project, create a feature branch, and submit a Pull Request.

### Recent Features (v0.8.0)

- Broken project content is reported by name at the end of the build instead of failing silently
- Missing thumbnails fall back to a placeholder rather than a broken image
- "Back" on a project page returns to where you came from, filters and page number intact
- Browser back and shared list URLs now restore the view they point at
- Unit tests (Vitest) and end-to-end tests (Playwright), both run in CI before deployment

> Node.js 22.13 or later is now required (a pnpm 11 dependency).

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/aker-dev/microfolio/issues)
- 📧 **Email**: hello@aker.pro
- 💬 **Discussions**: GitHub Discussions for questions

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by AKER**
