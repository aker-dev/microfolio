# microfolio

_[🇫🇷 Lire en français](LISEZMOI.md)_

A modern static portfolio generator built with **SvelteKit 2** and **Tailwind CSS 4** by AKER. Features a file-based content management system using folders and Markdown files. Perfect for designers, artists, architects, and creatives who want to showcase their projects elegantly and professionally.

**Live Demo**: [https://aker-dev.github.io/microfolio/](https://aker-dev.github.io/microfolio/)

## ✅ Features

- **📁 File-based CMS** - No database needed
- **🎨 Multiple Views** - Projects, List, Map modes
- **📱 Responsive Design** - Mobile-first approach
- **🏷️ Smart Tagging** - Advanced filtering system
- **🗺️ Interactive Map** - Leaflet integration
- **🚀 Static Generation** - Optimal performance
- **🖼️ Image Lightbox** - Enhanced gallery with navigation arrows and metadata display
- **📊 EXIF/IPTC Metadata** - Automatic extraction and display of image technical information
- **🌙 Dark Mode** - Built-in theme support for better viewing experience
- **⚡ Image Optimization** - WebP thumbnail generation with `pnpm optimize-images` command

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

- Node.js LTS 20+ (tested with 20.x)
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

### Recent Features

- Interactive Map with Leaflet
- Advanced List View with filtering
- Mobile-responsive design
- GitHub Actions deployment
- Custom domain support

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/aker-dev/microfolio/issues)
- 📧 **Email**: hello@aker.pro
- 💬 **Discussions**: GitHub Discussions for questions

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by AKER**
