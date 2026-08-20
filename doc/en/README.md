# Microfolio Documentation

Welcome to the complete documentation for **microfolio**! 🎉

## About Microfolio

microfolio is a modern static portfolio generator, designed specifically for creatives: designers, architects, photographers, artists, graphic designers, collectives... It allows you to create a professional website to showcase your projects elegantly, without needing deep technical knowledge.

### Key Features

- ✨ **Modern and clean interface**
- 📱 **Responsive design** (mobile, tablet, desktop)
- 🎨 **Easily customizable**
- 🚀 **Optimal performance** with static generation and build-time image optimization (WebP)
- 🔍 **SEO friendly** with OG metadata for social sharing, `sitemap.xml` and `robots.txt`
- 🗺️ **Worldwide project map** — MapLibre GL on OpenFreeMap vector tiles, no API key, light and dark styles
- 🏷️ **Tag and filter system** with counters and collapsible tag list
- 📊 **Different display modes** (grid, list, map)
- 🌐 **Ready for custom domain**
- 🌙 **Dark mode** with toggle and persistent preference
- 🔗 **Shareable URLs** — filter, search, sort, and pagination state synced to URL
- 🌍 **Internationalization** — English/French via svelte-i18n, RTL-ready
- 📄 **Pagination & sorting** — customizable rows-per-page, sort by date, title, type, or location
- 🖼️ **Image lightbox** with EXIF/IPTC metadata display
- ⚖️ **Legal notice and privacy policy** page templates, linked from the footer

## Documentation Structure

### [0. Getting Started — Beginner's Guide](00-getting-started.md)

- Never opened a terminal? Start here
- Prerequisites explained step by step (Mac and Windows)
- First project, file naming, Markdown primer
- Common problems and solutions

### [1. Installation Guide](01-installation.md)

- Prerequisites (Node.js, Git, pnpm)
- Project installation
- First launch
- Troubleshooting

### [2. Configuration Guide](02-configuration.md)

- Page customization
- Domain configuration
- Color and style customization
- Dark mode configuration
- Internationalization (locale)
- Metadata and SEO
- Advanced features

### [3. Preparing Your Images](03-preparing-images.md)

- Sizes, formats and naming
- EXIF/IPTC metadata the lightbox displays, field by field
- Editing tools (Affinity Photo, exiftool)
- Privacy: what to strip before publishing

### [4. Project Addition Guide](04-adding-projects.md)

- Project structure
- Creating new projects
- Media management (images, videos)
- Metadata and organization
- Best practices

### [5. Publication Guide](05-publication.md)

- Publication preparation
- Site build
- GitHub Pages publication
- Custom domains
- Other hosting options
- Maintenance and updates

## Quick Start

### Option 1: Installation via Homebrew (Recommended for Mac)

**Homebrew** is a package manager for macOS that greatly simplifies installation:

```bash
# Trust the AKER tap, then install microfolio
brew trust aker-dev/tap
brew install aker-dev/tap/microfolio

# Create a new portfolio
microfolio new my-portfolio
cd my-portfolio

# Start the development server
microfolio dev
```

Your site will be accessible at: http://localhost:5555

**Advantages of this method:**

- Automatic installation of all dependencies (Node.js, pnpm, Git)
- Simplified commands: `microfolio new`, `microfolio dev`, `microfolio build`
- Easy updates with `brew upgrade microfolio`

### Option 2: Manual installation

```bash
# Clone the repository
git clone https://github.com/aker-dev/microfolio.git my-portfolio
cd my-portfolio

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

### Basic customization

1. **Edit your profile** in `content/index.md` and `content/about.md`
2. **Add your projects** in `content/projects/`
3. **Set your address** in `src/lib/config.js` (`url`)
4. **Test locally** with `pnpm run dev`
5. **Publish** with `pnpm run build`

## Important note about the terminal / command line

**Don't worry!** This guide uses the terminal (or "command line"), but **no technical knowledge is required**. You'll simply need to type or copy-paste a few simple commands. It's easier than it looks! 😊

### How to open the terminal

**On Mac:**

- Press `Cmd + Space` to open Spotlight
- Type "Terminal" and press Enter
- Or go to Applications > Utilities > Terminal

**On Windows:**

- Press `Windows + R`
- Type "powershell" and press Enter
- Or search for "PowerShell" in the Start menu

## Target Audience

This documentation is primarily aimed at **non-developer creatives**:

- 🏗️ **Architects**
- 🎨 **Graphic designers**
- 🖼️ **Artists**
- 🏠 **Interior designers**
- 📸 **Photographers**
- ✏️ **Illustrators**
- 🌐 **Content creators**

**No deep technical knowledge is required** to use Microfolio. The guides are designed to be accessible to everyone.

## Video Tutorials (planned)

A series of short video tutorials is in preparation. Planned topics:

1. **Installing microfolio with Homebrew** — from zero to a running site
2. **Your first project** — folder, `index.md`, images
3. **Making it yours** — configuration, colors, dark mode
4. **Publishing on GitHub Pages** — from your computer to the web
5. **Using a custom domain** — DNS and HTTPS without tears

Links will be added here as episodes are released.

## Help and Support

### Resources

- **Official documentation**: This `doc/` folder
- **Project examples**: `content/projects/` folder
- **[GitHub Issues](https://github.com/aker-dev/microfolio/issues)**: To report bugs
- **[Discussions](https://github.com/aker-dev/microfolio/discussions)**: To ask questions

### Contact

For any questions or problems:

📧 **Email**: hello@aker.pro

In your message, please specify:

- Your operating system (Mac/Windows)
- The problem encountered
- The steps you followed
- A screenshot if possible

### Contribution

Your contributions are welcome! See **[CONTRIBUTING.md](../../CONTRIBUTING.md)** for how to:

- Improve the documentation
- Report bugs
- Suggest new features
- Help translate microfolio
- Share your creations

## Changelog

See the full changelog in [CHANGELOG.md](../../CHANGELOG.md).

## License

This project is under MIT license. You are free to use, modify and distribute it under the terms of this license.

---

**Happy creating with Microfolio! 🎨**
