# µFolio

A modern static portfolio generator based on **SvelteKit 2** and **Tailwind CSS 4**, using a folder tree structure and Markdown files to manage content. Perfect for designers, artists, architects, and creatives who want to showcase their projects elegantly and professionally without the hassle!

## Key Features

- **100% static site** - Optimal performance and simple hosting
- **Markdown content** - Easy project and page management
- **4 viewing modes**:
  - **List**: Sortable table with filters
  - **Mosaic**: Visual gallery with thumbnails
  - **Timeline**: Chronological view of projects
  - **Map**: Interactive geographical location
- **Tag system** - Classification and filtering by project type
- **Multi-author** - Role attribution for each project
- **Responsive** - Mobile, tablet, and desktop optimized
- **SEO optimized** - Optimized metadata and structure

## Who is it for?

µFolio is perfect for:

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

- Node.js LTS 22.17.0+ and pnpm
- Git

### 1. Clone the template

```bash
git clone https://github.com/aker-dev/µFolio.git my-portfolio
cd my-portfolio
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start the development server

```bash
pnpm dev
```

### 4. Open http://localhost:5173

1. Create a folder for your project:

```
content/projects/my-first-project
```

2. Create the `index.md` file with the following content:

```markdown
---
title: "My First Project"
date: "2024-01-15"
location: "Paris, France"
coordinates: [48.8566, 2.3522]
description: "A brief description of my project"
type: "architecture"
tags: ["architecture", "modern"]
authors:
  - name: "Your Name"
    role: "Architect"
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
µFolio/
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
title: "Project Title"
date: "2024-01-15" # ISO format (YYYY-MM-DD)
location: "City, Country"
description: "Short description for lists"

# Optional fields
coordinates: [latitude, longitude] # For the map
type: "architecture" # Main category
tags: ["tag1", "tag2"] # Multiple tags
authors: # List of contributors
  - name: "Name"
    role: "Role"
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
  title: "µFolio",
  description: "static site generator",
  author: "AKER",

  // Navigation
  navigation: [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    // ...
  ],

  // Project types
  projectTypes: [
    { value: "architecture", label: "Architecture" },
    { value: "design", label: "Design" },
    // Add your own types
  ],

  // Map configuration
  mapConfig: {
    center: [46.603354, 1.888334],
    zoom: 6,
    // ...
  },
};
```

### Style Customization

The project uses Tailwind CSS. Modify `app.css` to customize:

- Colors
- Typography
- Spacing
- Animations

## 🗺️ Detailed Features

### List View

- Table with sortable columns
- Filtering by type/tag
- Search (coming soon)
- CSV export (coming soon)

### Timeline View

- Chronological display
- Grouping by year
- Quick navigation
- Scroll animations

### Map View

- Interactive map (Leaflet)
- Clickable markers
- Clusters for dense areas
- Popup with preview

### Mosaic View

- Responsive grid
- Lazy loading of images
- Lightbox (coming soon)
- Visual filters

## 🚀 Deployment

### Build for production

```bash
npm run build
```

The static site is generated in the `build/` folder.

### Hosting

Compatible with all static site hosts:

- **Vercel**: `vercel`
- **GitHub Pages**: Via GitHub Actions
- **Classic server**: FTP upload of the `build` folder

### Production Configuration

1. Modify `.env` with your production URL
2. Optimize your images before build
3. Test the build locally: `pnpm preview`

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

### Contribution ideas

- [ ] Add search mode
- [ ] PDF export of portfolio
- [ ] Additional themes
- [ ] Multilingual support
- [ ] Headless CMS integration
- [ ] Advanced animations
- [ ] PWA support

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

- 📧 Email: hello@aker.pro
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/portfolio-generator/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-username/portfolio-generator/discussions)

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
