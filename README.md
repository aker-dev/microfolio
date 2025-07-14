# microfolio

A modern static portfolio generator built with **SvelteKit 2** and **Tailwind CSS 4**. Features a file-based content management system using folders and Markdown files. Perfect for designers, artists, architects, and creatives who want to showcase their projects elegantly and professionally.

🚀 **Live Demo**: [https://aker-dev.github.io/microfolio/](https://aker-dev.github.io/microfolio/)

## Key Features

- **📁 File-based CMS** - No database needed, content managed through folders and Markdown
- **🎨 Multiple View Modes**:
  - **Mosaic**: Visual grid with project thumbnails
  - **Map**: Interactive map with project locations using Leaflet
  - **Projects**: Detailed project listings with filtering
- **📱 Fully Responsive** - Optimized for mobile, tablet, and desktop
- **🏷️ Smart Tagging** - Project categorization and filtering system
- **👥 Multi-author Support** - Role attribution for collaborative projects
- **🚀 Static Site Generation** - Built with SvelteKit for optimal performance
- **🎯 SEO Ready** - Optimized metadata and structure
- **📦 GitHub Pages Ready** - Automated deployment with GitHub Actions
- **🌐 Custom Domain Support** - Environment-based configuration for custom domains

## Who is it for?

microfolio is perfect for:

- Designers and graphic artists
- Architects and urban planners
- Artists and creatives
- Developers wanting a simple portfolio
- Creative agencies
- Any professional with projects to showcase

## Advantages of folder organization

- **Autonomy**: Each project is independent with all its resources
- **Portability**: Easy to move or archive a complete project
- **Clarity**: Intuitive and easy-to-navigate structure
- **Versioning**: Better tracking of changes per project
- **Backup**: Simplified project-by-project backup

## Preview

_[Screenshots to be added]_

## 🚀 Quick Start

### Prerequisites

- **Node.js** LTS 20+ (tested with 20.x)
- **pnpm** package manager
- **Git** for version control

### 1. Clone the template

```bash
git clone https://github.com/aker-dev/microfolio.git my-portfolio
cd my-portfolio
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Install demo projects (optional)

```bash
chmod +x example_projects_generator.sh
./example_projects_generator.sh
```

### 4. Start the development server

```bash
pnpm dev
```

### 5. Open http://localhost:5173

1. Create a folder for your project:

```
content/projects/my-first-project
```

2. Create the `index.md` file with the following content:

```markdown
---
title: 'My First Project'
date: '2024-01-15'
location: 'Paris, France'
coordinates: [48.8566, 2.3522]
description: 'A brief description of my project'
type: 'architecture'
tags: ['architecture', 'modern']
authors:
  - name: 'Your Name'
    role: 'Architect'
featured: true
---

## Description

Here is the complete description of my project...
```

3. Add your resources to the project folder:

```
# Add the thumbnail (required)
thumbnail.jpg

# Create folders for resources
images videos documents
```

4. Your project automatically appears on the site!

## 📁 Folder Structure

```
microfolio/
├── 📁 content/
│   ├── 📁 projects/              # All projects
│   │   ├── 📁 cultural-center-paris/
│   │   │   ├── 📄 index.md     # Project content
│   │   │   ├── 🖼️ thumbnail.jpg # Thumbnail
│   │   │   ├── 📁 images/      # Image gallery
│   │   │   │   ├── view-01.jpg
│   │   │   │   ├── view-02.jpg
│   │   │   │   └── plan.jpg
│   │   │   ├── 📁 videos/      # Project videos
│   │   │   └── 📁 documents/   # PDFs, plans, etc.
│   │   │       └── technical-file.pdf
│   │   └── 📁 modern-house/
│   │       ├── 📄 index.md
│   │       ├── 🖼️ thumbnail.jpg
│   │       └── 📁 images/
│   └── 📁 pages/               # Static pages
│       ├── about.md
│       └── contact.md
├── 📁 src/
│   ├── 📁 routes/              # SvelteKit pages
│   ├── 📁 lib/
│   │   ├── 📁 components/      # Reusable components
│   │   ├── 📁 utils/           # Utility functions
│   │   └── config.js           # Site configuration
│   └── app.css                 # Global styles
├── 📁 static/                  # Global site assets
│   ├── 📁 images/              # Logo, favicon, etc.
│   └── 📁 fonts/               # Custom fonts
├── 📄 package.json
└── 📄 README.md
```

## 📝 Markdown File Format

### Project File Structure

Each project is organized in its own folder with an `index.md` file:

```yaml
---
# Required fields
title: 'Project Title'
date: '2024-01-15' # ISO format (YYYY-MM-DD)
location: 'City, Country'
description: 'Short description for lists'

# Optional fields
coordinates: [latitude, longitude] # For the map
type: 'architecture' # Main category
tags: ['tag1', 'tag2'] # Multiple tags
authors: # List of contributors
  - name: 'Name'
    role: 'Role'
featured: true # Featured project
---
## Description

Markdown content...
```

### Naming Conventions

- **Project folder**: `project-name` (kebab-case)
- **Thumbnail**: `thumbnail.jpg` (always this name)
- **Images**: In the `images/` subfolder
- **Videos**: In the `videos/` subfolder
- **Documents**: In the `documents/` subfolder

### Automatic Resource Management

All resources placed in folders are automatically added at the end of each project:

1. **Images** (`images/`) → Automatic photo gallery
2. **Videos** (`videos/`) → Video section with integrated player
3. **Documents** (`documents/`) → Download list

**No configuration needed!** Simply drop your files in the right folders.

### Customization (optional)

You can still reference specific resources in your content:

```markdown
<!-- Image in text -->

![Description](images/my-image.jpg)

<!-- YouTube/Vimeo video -->

[Watch the presentation](https://youtube.com/watch?v=...)

<!-- Emphasize a document -->

Consult the [detailed specifications](documents/specifications.pdf)
```

### Project Structure Examples

**Architecture project:**

```
📁 cultural-center-paris/
├── 📄 index.md
├── 🖼️ thumbnail.jpg
├── 📁 images/
│   ├── facade-day.jpg
│   ├── facade-night.jpg
│   ├── interior-hall.jpg
│   └── aerial-view.jpg
├── 📁 documents/
│   ├── architectural-plans.pdf
│   ├── specifications.pdf
│   └── hqe-certification.pdf
└── 📁 videos/
    └── virtual-tour.mp4
```

**Graphic design project:**

```
📁 tech-startup-identity/
├── 📄 index.md
├── 🖼️ thumbnail.jpg
├── 📁 images/
│   ├── logo-variations.jpg
│   ├── brand-guidelines.jpg
│   ├── stationery-mockup.jpg
│   └── web-applications.jpg
└── 📁 documents/
    └── logo-usage-guide.pdf
```

**Art installation:**

```
📁 light-installation-2024/
├── 📄 index.md
├── 🖼️ thumbnail.jpg
├── 📁 images/
│   ├── complete-installation.jpg
│   ├── technical-details.jpg
│   └── public-interaction.jpg
├── 📁 videos/
│   ├── teaser.mp4
│   └── making-of.mp4
└── 📁 documents/
    └── press-kit.pdf
```

### Supported Formats and Best Practices

**Images:**

- Formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.svg`
- Recommended thumbnail: 800x600px minimum
- Gallery images: 1920px wide maximum
- Optimize your images (tools: ImageOptim, Squoosh)

**Videos:**

- Formats: `.mp4`, `.webm`, `.mov`
- Recommendation: MP4 H.264 for maximum compatibility
- Size: < 50MB per video (host on YouTube/Vimeo if larger)

**Documents:**

- Formats: `.pdf`, `.doc`, `.docx`, `.ppt`, `.pptx`
- Naming: avoid spaces and special characters

**Best practices:**

- Use descriptive filenames in kebab-case
- Keep consistency in thumbnail dimensions
- Compress resources for fast loading
- Add alt text to images for accessibility

## ⚙️ Configuration

### Site Configuration (`src/lib/config.js`)

```javascript
export const siteConfig = {
	title: 'microfolio',
	description: 'static portfolio generator',
	author: 'AKER',

	// Social links
	socialLinks: {
		github: 'https://github.com/yourusername',
		linkedin: 'https://linkedin.com/in/yourusername',
		instagram: 'https://instagram.com/yourusername'
	},

	// Navigation
	navigation: [
		{ name: 'Home', href: '/' },
		{ name: 'About', href: '/about' },
		{ name: 'Projects', href: '/projects' },
		{ name: 'Map', href: '/map' }
	]
};
```

### Style Customization

The project uses Tailwind CSS. Modify `app.css` to customize:

- Colors
- Typography
- Spacing
- Animations

## 🎨 View Modes & Features

### Mosaic View

- **Responsive masonry grid** - Projects displayed as cards with thumbnails
- **Smart filtering** - Filter by project type, tags, and featured status
- **Lazy loading** - Optimized image loading for performance
- **Project cards** - Show title, date, location, type, and tags

### Interactive Map

- **Leaflet integration** - Professional mapping with OpenStreetMap
- **Geo-located projects** - Projects with coordinates appear as markers
- **Popup previews** - Click markers to see project details
- **Cluster support** - Automatic grouping for dense project areas

### Project Detail Pages

- **Dynamic routing** - SEO-friendly URLs for each project
- **Automatic galleries** - Images from `/images` folder displayed automatically
- **Video support** - MP4/WebM videos from `/videos` folder with native player
- **Document downloads** - PDFs and docs from `/documents` folder
- **Mobile optimized** - Touch-friendly navigation and lightbox

### About Page

- **Dynamic content loading** - Markdown-based page content
- **Metadata integration** - Author information and site configuration

## 🚀 Deployment

### GitHub Pages (Recommended)

The project includes automated GitHub Actions deployment:

1. **Enable GitHub Pages**: Go to Settings → Pages → Source → GitHub Actions
2. **Configure custom domain** (optional):
   - Add your domain to `.env`: `CUSTOM_DOMAIN=yourdomain.com`
   - Update `static/CNAME` with your domain
3. **Push to main branch** - Deployment happens automatically

### Manual Build

```bash
pnpm build
```

The static site is generated in the `build/` folder.

### Other Hosting Platforms

Compatible with all static site hosts:

- **Vercel**: Connect your repository and deploy
- **Netlify**: Drag and drop the `build/` folder
- **Classic server**: FTP upload of the `build/` folder

### Environment Configuration

For custom domains, configure environment variables:

```bash
# .env
CUSTOM_DOMAIN=yourdomain.com
```

This automatically:

- Removes the `/microfolio` base path
- Copies CNAME file for GitHub Pages
- Optimizes configuration for custom domain hosting

## 🔄 Migration from Other Systems

### From WordPress

1. Export your projects to markdown with an export plugin
2. Create one folder per project
3. Adapt the YAML front matter
4. Copy media to the right folders

### From a static HTML site

1. Create one folder per project
2. Convert content to Markdown
3. Organize resources according to the structure
4. Add metadata in front matter

## 🤝 Contributing

Contributions are welcome!

### How to contribute

1. Fork the project
2. Create a branch (`git checkout -b feature/new-feature`)
3. Commit (`git commit -m 'Add new feature'`)
4. Push (`git push origin feature/new-feature`)
5. Open a Pull Request

### Recent Updates

Based on the 25+ feature commits, microfolio now includes:

- ✅ **Interactive Map** with Leaflet integration and project markers
- ✅ **Mobile Menu** with improved header and navigation
- ✅ **Custom Fonts** and enhanced typography
- ✅ **GitHub Actions** deployment for automated publishing
- ✅ **Static Adapter** with prerendering for optimal performance
- ✅ **Custom Domain Support** with environment-based configuration
- ✅ **Dynamic Content Loading** for projects and pages
- ✅ **Icon Integration** with @iconify/svelte
- ✅ **Responsive Design** with mobile-first approach

### Contribution Ideas

- [ ] Timeline view for chronological browsing
- [ ] Table view for listing all projects
- [ ] PDF export of portfolio
- [ ] Additional themes and color schemes
- [ ] Multilingual support (i18n)
- [ ] Headless CMS integration
- [ ] Advanced animations and transitions
- [ ] PWA support with offline capabilities

## 📄 License

This project is under MIT license. See the [LICENSE](LICENSE) file for more details.

## ❓ FAQ

### How to add a project quickly?

1. Copy an existing project folder
2. Rename it with your project slug
3. Modify the `index.md` file
4. Replace `thumbnail.jpg`
5. Add your images/videos/documents

### Images don't display?

- Check that the `thumbnail.jpg` file exists
- Filenames should not contain spaces
- Use supported formats (.jpg, .png, .webp)

### How to change project order?

Projects are sorted by date (newest to oldest). Modify the `date` field in `index.md`.

### Can I use YouTube/Vimeo videos?

Yes! Simply add the link in your Markdown content:

```markdown
[Watch the presentation video](https://youtube.com/watch?v=xxx)
```

### How to optimize performance?

- Compress your images (max 1920px wide)
- Use WebP or AVIF format for images
- Limit videos to 50MB (otherwise use YouTube/Vimeo)
- Enable gzip compression on your server

### Is the site multilingual?

Not yet, but it's planned! You can contribute to this feature.

## 🙏 Acknowledgments

- [SvelteKit](https://kit.svelte.dev/) - Fullstack framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Leaflet](https://leafletjs.com/) - Interactive maps

## 📞 Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/aker-dev/microfolio/issues)
- 💬 **Discussions**: Use GitHub Discussions for questions and ideas
- 📧 **Email**: hello@aker.pro

## 📚 Useful Resources

### Documentation

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Markdown Guide](https://www.markdownguide.org/)
- [Leaflet Documentation](https://leafletjs.com/reference.html)

### Recommended Tools

- **Images**: [Tinify](https://tinypng.com/) - Image compression
- **Icons**: [Heroicons](https://heroicons.com/) - Free SVG icons
- **Colors**: [Coolors](https://coolors.co/) - Color palettes
- **Fonts**: [Google Fonts](https://fonts.google.com/) - Free fonts

### Inspiration

- [Subfolio](https://github.com/area17/subfolio) - Award-winning sites

---

Made with ❤️ by AKER
