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
- **🗺️ Interactive Map** — MapLibre GL with geolocated projects, light and dark, on an OpenStreetMap basemap
- **🚀 Static Generation** — Optimal performance with SvelteKit adapter-static
- **🖼️ Image Lightbox** — Enhanced gallery with navigation arrows and metadata display
- **📊 EXIF/IPTC Metadata** — Automatic extraction and display of image technical information
- **🌙 Dark Mode** — Toggle in footer with persistent preference (system / manual / localStorage)
- **⚡ Image Optimization** — WebP thumbnails and sharing images, generated as part of the build
- **🔗 Shareable URLs** — Filter, search, sort, and pagination state synced to URL query params
- **🌐 Internationalization** — English/French via svelte-i18n, RTL-ready
- **🏷️ Built to be shared and found** — Open Graph and Twitter tags with absolute URLs, canonical links, and a `sitemap.xml` and `robots.txt` generated from your projects
- **📄 Pagination & Sorting** — Customizable rows-per-page, sort by date, title, type, or location

## 🧪 Beta Testing Program

**We're looking for beta testers!** Are you a creative and want to test microfolio?

👉 **[Beta Tester Guide](doc/en/beta-testers-guide.md)** - Complete guide to get started

📧 Contact **hello@aker.pro** to join the testing program.

## 🚀 Quick Start

### Option 1: Homebrew Installation (macOS - Recommended)

```bash
# Install microfolio via Homebrew
brew trust aker-dev/tap
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

### Recent Features (v0.10.0)

- **The map draws OpenStreetMap the world over** and follows your light or dark theme — a project anywhere on the planet, down to its street
- **Shared links carry an image, a title and a description**: Open Graph and Twitter tags on every page, with a 1200×630 image generated for each project. Until now `og:image` was written relative, which the networks ignore, so no shared link ever showed anything
- `sitemap.xml` and `robots.txt`, generated at build from your own projects
- **Your site's address is set once**, as `url` in `src/lib/config.js`. It used to live in three places that had to agree
- Faster on a phone: first paint improves by 100 to 288 ms across the home, map and project pages, and a project page went from 6.4 MB to 321 kB

> Node.js 22.13 or later is required (a pnpm 11 dependency).

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/aker-dev/microfolio/issues)
- 📧 **Email**: hello@aker.pro
- 💬 **Discussions**: GitHub Discussions for questions

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

## 🖥️ Screenshots

### Homepage

![microfolio Homepage](doc/screenshots/microfolio_home.png)

### Project Views

![microfolio Projects Gallery](doc/screenshots/microfolio_projects.png)
![microfolio Project Detail 1](doc/screenshots/microfolio_project_01.png)
![microfolio Project Detail 2](doc/screenshots/microfolio_project_02.png)

The lightbox shows the image full height, with its title, caption, credit and EXIF metadata in a panel you open when you want it:

![microfolio Lightbox with image metadata](doc/screenshots/microfolio_lightbox.png)

### List View

![microfolio List View](doc/screenshots/microfolio_list.png)

### Map View

![microfolio Interactive Map](doc/screenshots/microfolio_map.png)

### Dark Mode

Follows the system preference, with a toggle in the footer that remembers your choice.

![microfolio Homepage in dark mode](doc/screenshots/microfolio_home_dark.png)
![microfolio Project detail in dark mode](doc/screenshots/microfolio_project_dark.png)
![microfolio List view in dark mode](doc/screenshots/microfolio_list_dark.png)
![microfolio Map in dark mode](doc/screenshots/microfolio_map_dark.png)
![microfolio Lightbox in dark mode](doc/screenshots/microfolio_lightbox_dark.png)

---

**Made with ❤️ by AKER**
