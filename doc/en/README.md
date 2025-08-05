# Microfolio Documentation

Welcome to the complete documentation for **microfolio**! 🎉

## About Microfolio

microfolio is a modern static portfolio generator, designed specifically for creatives: designers, architects, photographers, artists, graphic designers, collectives... It allows you to create a professional website to showcase your projects elegantly, without needing deep technical knowledge.

### Key Features

- ✨ **Modern and clean interface**
- 📱 **Responsive design** (mobile, tablet, desktop)
- 🎨 **Easily customizable**
- 🚀 **Optimal performance**
- 🔍 **SEO friendly**
- 🗺️ **Map display** for geolocated projects
- 🏷️ **Tag and filter system**
- 📊 **Different display modes** (grid, list, map)
- 🌐 **Ready for custom domain**

## Documentation Structure

### [1. Installation Guide](01-installation.md)
- Prerequisites (Node.js, Git, pnpm)
- Project installation
- First launch
- Troubleshooting

### [2. Configuration Guide](02-configuration.md)
- Page customization
- Domain configuration
- Color and style customization
- Metadata and SEO
- Advanced features

### [3. Project Addition Guide](03-adding-projects.md)
- Project structure
- Creating new projects
- Media management (images, videos)
- Metadata and organization
- Best practices

### [4. Publication Guide](04-publication.md)
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
# Install microfolio via Homebrew
brew install aker-dev/tap/microfolio

# Create a new portfolio
microfolio new my-portfolio
cd my-portfolio

# Start the development server
microfolio dev
```

Your site will be accessible at: http://localhost:5173

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
3. **Configure your domain** in `static/CNAME`
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

## Help and Support

### Resources

- **Official documentation**: This `doc/` folder
- **Project examples**: `content/projects/` folder
- **GitHub Issues**: To report bugs
- **Discussions**: To ask questions

### Contact

For any questions or problems:

📧 **Email**: hello@aker.pro

In your message, please specify:
- Your operating system (Mac/Windows)
- The problem encountered
- The steps you followed
- A screenshot if possible

### Contribution

Your contributions are welcome! Feel free to:

- Improve the documentation
- Report bugs
- Suggest new features
- Share your creations

## Changelog

### Version 0.1.0-beta.1
- Complete documentation in French
- Detailed guides for non-developers
- Practical examples
- Modular structure

## License

This project is under MIT license. You are free to use, modify and distribute it under the terms of this license.

---

**Happy creating with Microfolio! 🎨**