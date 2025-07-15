# Adding Projects Guide

## Project Structure

Each project in Microfolio is organized in a separate folder located in `content/projects/`. Here's the recommended structure:

```
content/projects/my-project/
├── index.md          # Main project file
├── thumbnail.jpg     # Thumbnail image (required)
├── images/          # Images folder
│   ├── main-view.jpg
│   ├── detail-view.jpg
│   └── context-view.jpg
├── videos/          # Videos folder (optional)
│   └── overview.mp4
└── documents/       # Documents folder (optional)
    ├── project-brief.pdf
    └── technical-specs.pdf
```

## Creating a New Project

### 1. Create the Project Folder

```bash
mkdir content/projects/your-project-name
cd content/projects/your-project-name
```

**Naming Rules:**
- Use hyphens (-) instead of spaces
- Avoid special characters
- Prefer short and descriptive names
- Examples: `modern-villa`, `restaurant-logo`, `art-exhibition`

### 2. Create the Main File

Create the `index.md` file with the following structure:

```markdown
---
title: "Your Project Title"
date: "2024-01-15"
location: "City, Country"
coordinates: [latitude, longitude]
description: "Short and compelling description of your project"
type: "architecture"
tags: ["architecture", "design", "modern", "sustainable"]
authors:
  - name: "Your Name"
    role: "Lead Designer"
  - name: "Collaborator"
    role: "Consultant"
featured: true
---

## Project Description

Describe your project in detail. Explain the context, challenges, and your creative approach.

## Concept and Inspiration

Talk about your creative process, inspiration sources, and vision.

## Creation Process

Detail the steps of your work, techniques used, and tools employed.

## Results and Impact

Present the results achieved, project reception, and its impact.
```

### 3. Important Metadata

**Required fields:**
- `title`: Project title
- `date`: Completion date (YYYY-MM-DD format)
- `description`: Short description for previews
- `type`: Project type (see list below)

**Optional fields:**
- `location`: Project location
- `coordinates`: GPS coordinates [latitude, longitude]
- `tags`: Keywords for filtering
- `authors`: Creators and collaborators
- `featured`: Featured project (true/false)

### 4. Available Project Types

- `architecture`: Architectural projects
- `design`: Graphic design, product design
- `art`: Artistic works
- `interior`: Interior design
- `landscape`: Landscape architecture
- `digital`: Digital projects
- `branding`: Visual identity
- `photography`: Photography
- `illustration`: Illustration
- `web`: Websites, applications

## Adding Media

### 1. Thumbnail Image (required)

Add a `thumbnail.jpg` image in the project folder:
- **Format**: JPG or PNG
- **Recommended size**: 800x600 pixels
- **Weight**: Maximum 200 KB
- **Quality**: High resolution for display

### 2. Project Images

Create an `images/` folder and add your images:

```markdown
## Gallery

![Main view](images/main-view.jpg)
*Caption for the main image*

![Detail](images/detail-view.jpg)
*Close-up of an important detail*

![Context](images/context-view.jpg)
*Overview in its environment*
```

**Image tips:**
- Name your files descriptively
- Use web-optimized formats (JPG, PNG, WebP)
- Add explanatory captions
- Maintain visual consistency

### 3. Videos (optional)

To add videos, create a `videos/` folder:

```markdown
## Presentation Video

<video controls>
  <source src="videos/overview.mp4" type="video/mp4">
  Your browser does not support video playback.
</video>
```

**Supported formats:**
- MP4 (recommended)
- WebM
- OGV

### 4. Documents (optional)

For PDF documents or others:

```markdown
## Documents

- [Technical Documentation](documents/technical-specs.pdf)
- [Project Brief](documents/project-brief.pdf)
```

## Complete Example

Here's a complete example of an architecture project:

```markdown
---
title: "Contemporary Villa"
date: "2024-03-20"
location: "Nice, France"
coordinates: [43.7102, 7.2620]
description: "Contemporary individual house with sea view, integrating sustainable development principles"
type: "architecture"
tags: ["architecture", "residential", "contemporary", "sustainable", "sea view"]
authors:
  - name: "Marie Dubois"
    role: "Architect"
  - name: "Jean Martin"
    role: "Landscape Architect"
featured: true
---

## Project Description

This contemporary 250m² villa was designed for a family of four wishing to combine modern comfort with environmental respect. Located in the hills of Nice, it benefits from a panoramic view of the Mediterranean.

## Architectural Concept

The project is based on three fundamental principles:
- **Landscape opening**: Large south-facing windows
- **Environmental integration**: Use of local materials
- **Energy performance**: BBC certification

## Gallery

![Terrace view](images/terrace-view.jpg)
*The main terrace offers an unobstructed view of the sea*

![Main living room](images/living-room.jpg)
*The open living space bathed in natural light*

![South facade](images/south-facade.jpg)
*South facade with large openings and sun shades*

## Materials and Techniques

- **Structure**: Reinforced concrete and steel
- **Insulation**: Wood fiber and cellulose wadding
- **Joinery**: Aluminum with thermal bridge break
- **Coverings**: Local stone and Douglas fir wood

## Sustainable Development

- Photovoltaic solar panels
- Rainwater harvesting
- Green roofs
- Geothermal heating

## Recognition

- **2024**: PACA Sustainable Architecture Award
- **2024**: Published in "Contemporary Houses"
- **2024**: Architectures à Vivre Selection

## Documents

- [Architectural Plans](documents/plans.pdf)
- [Technical Documentation](documents/technical-specs.pdf)
- [BBC Certification](documents/bbc-certificate.pdf)
```

## Best Practices

### 1. Writing

- **Catchy title**: Clear and descriptive
- **Short description**: Maximum 160 characters
- **Structured text**: Use subheadings
- **Accessible language**: Avoid technical jargon
- **Storytelling**: Tell the project's story

### 2. Images

- **Professional quality**: Sharp and well-lit photos
- **View diversity**: Overall, details, context
- **Visual consistency**: Homogeneous photographic style
- **Web optimization**: Optimized size and weight

### 3. Metadata

- **Relevant tags**: Facilitate search
- **Precise location**: Enables map display
- **Exact date**: Helps chronological sorting
- **Complete authors**: Professional credits

### 4. SEO

- **Descriptive URLs**: Explicit folder name
- **Alt tags**: Image descriptions
- **Natural keywords**: Integrated in text
- **Internal links**: To other similar projects

## Project Management

### Work in Progress

For an unfinished project:

```markdown
---
title: "Project in Progress"
date: "2024-12-01"
status: "in-progress"
completion: 75
---

## Progress Status

This project is currently in the implementation phase. Estimated completion: 75%

**Completed stages:**
- ✅ Design
- ✅ Technical studies
- ✅ Building permit

**Current stages:**
- 🔄 Implementation
- ⏳ Finishing
```

### Conceptual Project

For an unrealized project:

```markdown
---
title: "Development Concept"
date: "2024-11-15"
status: "concept"
---

## Exploratory Concept

This project explores new approaches to urban development. Although not realized, it presents innovative solutions for the future of our cities.
```

## Validation and Publishing

### 1. Verification

Before publishing, check:
- [ ] Complete `index.md` file
- [ ] `thumbnail.jpg` image present
- [ ] Correct metadata
- [ ] Functional links
- [ ] Spelling and grammar

### 2. Local Testing

```bash
pnpm run dev
```

Check that your project displays correctly in:
- The projects list
- The project detail
- Filters and search
- Map view (if GPS coordinates)

### 3. Optimization

- Compress your images
- Check loading times
- Test on mobile
- Validate accessibility

## Project Categories

### Architecture

Perfect for:
- Residential buildings
- Commercial spaces
- Public buildings
- Urban planning

```markdown
type: "architecture"
tags: ["architecture", "residential", "commercial", "urban"]
```

### Design

Ideal for:
- Graphic design
- Product design
- UI/UX design
- Brand identity

```markdown
type: "design"
tags: ["design", "graphic", "product", "branding"]
```

### Art

For:
- Installations
- Sculptures
- Paintings
- Performance art

```markdown
type: "art"
tags: ["art", "installation", "sculpture", "performance"]
```

### Digital

For:
- Websites
- Mobile apps
- Interactive experiences
- Digital art

```markdown
type: "digital"
tags: ["digital", "web", "app", "interactive"]
```

## Next Steps

Once your projects are added, check out the [Publishing Guide](04-publishing.md) to put your portfolio online.

## Useful Resources

- **Image optimization**: TinyPNG, Squoosh
- **GPS coordinates**: Google Maps, OpenStreetMap
- **Inspiration**: Behance, Dribbble, ArchDaily
- **Writing**: Grammarly, ProWritingAid

## Tips for Success

1. **Quality over quantity**: Better to have fewer high-quality projects
2. **Tell a story**: Each project should have a narrative
3. **Show process**: Include sketches, development stages
4. **Be consistent**: Maintain a coherent style across projects
5. **Update regularly**: Keep your portfolio fresh with new work

Your projects are the heart of your portfolio - make them shine!