# Project Addition Guide

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

**Naming rules:**

- Use hyphens (-) instead of spaces
- Avoid special characters
- Prefer short and descriptive names
- Examples: `modern-villa`, `restaurant-logo`, `art-exhibition`

### 2. Create the Main File

Create the `index.md` file with the following structure:

```markdown
---
# ── Required ── a project missing either is skipped from every view
title: 'Your project title'
date: '2024-01-15' # YYYY-MM-DD

# ── Recommended ──
description: 'Short and compelling description of your project'
type: 'architecture' # drives the type filter — see the list below

# ── Optional ──
location: 'City, Country' # leave it out and the project simply shows no place
coordinates: [48.8566, 2.3522] # [latitude, longitude] for the map — no coordinates, no marker
tags: ['modern', 'sustainable', 'public-space'] # don't repeat the type
authors:
  - name: 'Your Name'
    role: 'Lead Designer'
  - name: 'Collaborator'
    role: 'Consultant'
featured: true # true shows the project on the homepage

# ── Optional info panel ── shown on the project page when present
owner: 'Client or commissioning body'
status: 'delivered' # free text: delivered, ongoing, competition…
surface_area: '250 m²'
cost: '1 200 000 €'
---

## Project Description

Describe your project in detail. Explain the context, challenges, your creative approach.

## Concept and Inspiration

Talk about your creative process, sources of inspiration, your vision.

## Creation Process

Detail the steps of your work, techniques used, tools employed.

## Results and Impact

Present the results obtained, project reception, its impact.
```

### 3. Important Metadata

**Required fields** (a project missing either is skipped, and named in a summary at the end of the build):

- `title`: Project title
- `date`: Completion date (YYYY-MM-DD format)

**Recommended fields:**

- `description`: Short description for previews
- `type`: Project type, drives the type filter (see list below)

**Optional fields:**

- `location`: Project location — leave it out and nothing is shown for it, on the project page or in the list
- `coordinates`: GPS coordinates [latitude, longitude] — without them the project has no marker on the map

> The map draws OpenStreetMap the world over, through OpenFreeMap, and follows
> your light or dark theme. The basemap and its zoom limits are set at the top of
> `src/routes/map/+page.svelte` if you want another one.

- `tags`: Keywords for filtering — don't repeat the type, it has its own filter
- `authors`: Creators and collaborators (each with a `name` and a `role`)
- `featured`: Featured project (true/false)
- `owner`, `status`, `surface_area`, `cost`: free-text fields shown in the project page's info panel when present

### 4. Project Type Examples

- `architecture`: Architectural projects
- `design`: Graphic design, product design
- `art`: Artistic works
- `web`: Websites, applications
- ...

## Adding Media

### 1. Thumbnail Image (required)

Add a `thumbnail.jpg` image in the project folder — 1200×900 pixels recommended (4:3, the card ratio).

### 2. Project Images

Create an `images/` folder and add your images.

Sizes, formats, naming, and the EXIF/IPTC metadata the lightbox displays — including what to strip before publishing — are covered in the **[Preparing Your Images](03-preparing-images.md)** guide.

A YouTube or Vimeo video can also sit in the project's text: paste the video's address on a line of its own and it becomes the player, as described in the [configuration guide](02-configuration.md#images-and-videos-in-these-pages) — routed through the no-cookie modes automatically.

### 3. Videos (optional)

To add videos, create a `videos/` folder

**Supported formats:**

- MP4 (recommended)
- WebM
- OGV

### 4. Documents (optional)

To add documents, create a `documents/` folder

For PDF or other documents:

```markdown
## Documents

- [Technical file](documents/technical-specs.pdf)
- [Project brief](documents/project-brief.pdf)
```

## Complete Example

Here's a complete example of an architecture project:

```markdown
---
title: 'Contemporary Villa'
date: '2024-03-20'
location: 'Nice, France'
coordinates: [43.7102, 7.2620]
description: 'Contemporary individual house with sea view, integrating sustainable development principles'
type: 'architecture'
tags: ['residential', 'contemporary', 'sustainable', 'sea view']
authors:
  - name: 'Marie Dubois'
    role: 'Architect'
  - name: 'Jean Martin'
    role: 'Landscape Architect'
owner: 'Private client'
status: 'delivered'
surface_area: '250 m²'
cost: '1 850 000 €'
featured: true
---

## Project Description

This contemporary 250m² villa was designed for a family of four wishing to combine modern comfort and environmental respect. Located on the heights of Nice, it benefits from a panoramic view of the Mediterranean.

## Architectural Concept

The project is structured around three fundamental principles:

- **Opening to the landscape**: Large south-facing windows
- **Environmental integration**: Use of local materials
- **Energy performance**: BBC certification

## Gallery

![View from the terrace](images/terrace-view.jpg)
_The main terrace offers an unobstructed view of the sea_

![Main living room](images/living-room.jpg)
_The open living space bathed in natural light_

![South facade](images/south-facade.jpg)
_South facade with its large openings and sun shades_

## Materials and Techniques

- **Structure**: Reinforced concrete and steel
- **Insulation**: Wood fiber and cellulose wadding
- **Windows**: Aluminum with thermal break
- **Coverings**: Local stone and Douglas fir

## Sustainable Development

- Photovoltaic solar panels
- Rainwater collection
- Green roofs
- Geothermal heating

## Recognition

- **2024**: PACA Sustainable Architecture Award
- **2024**: Publication in "Contemporary Houses"
- **2024**: Architectures à Vivre Selection

## Documents

- [Architectural plans](documents/plans.pdf)
- [Technical file](documents/technical-specs.pdf)
- [BBC certification](documents/bbc-certificate.pdf)
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

- **Relevant tags**: Facilitate search — and never repeat the type, which has its own filter
- **Precise location**: Enables map display
- **Exact date**: Helps chronological sorting
- **Complete authors**: Professional credits

### 4. SEO

- **Descriptive URLs**: Explicit folder name
- **Natural keywords**: Integrated in text
- **Internal links**: To other similar projects

## Validation and Publication

### 1. Verification

Before publishing, check:

- [ ] Complete `index.md` file
- [ ] `thumbnail.jpg` image present
- [ ] Correct metadata
- [ ] Functional links
- [ ] Spelling and grammar

### 2. Local Testing

```bash
pnpm dev
```

Verify your project displays correctly in:

- Project list
- Project detail
- Filters and search
- Map view (if GPS coordinates)

### 3. Optimization

- Compress your images
- Check loading times
- Test on mobile
- Validate accessibility

## Next Steps

Once your projects are added, check out the [Publication guide](05-publication.md) to put your portfolio online.

## Useful Resources

- **Image optimization**: TinyPNG, Squoosh
- **GPS coordinates**: Google Maps, OpenStreetMap
- **Inspiration**: Behance, Dribbble, ArchDaily
- **Writing**: Grammarly, Antidote
