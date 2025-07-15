# Custom Configuration Guide

## Basic Configuration

### 1. Personal Information

Edit the `content/index.md` file to customize your homepage:

```markdown
---
title: 'Welcome to my portfolio'
description: 'Portfolio of [Your Name] - [Your profession/specialty]'
---

## Who am I?

Introduce yourself here. Talk about your background, passions, and creative approach.

## My Work

Describe your style, areas of expertise, and what inspires you.
```

### 2. About Page

Modify the `content/about.md` file:

```markdown
---
title: 'About'
description: 'Discover my journey and creative philosophy'
---

## My Journey

Tell your story, education, and important experiences.

## My Philosophy

Explain your approach to design/art, values, and what motivates you.

## My Skills

- Skill 1
- Skill 2
- Skill 3

## Education

- **Year** - Degree, School
- **Year** - Training, Organization

## Experience

- **Year** - Position, Company
- **Year** - Project, Client
```

### 3. Custom Domain Configuration

If you have a custom domain:

1. Modify the `static/CNAME` file and replace the content with your domain:
   ```
   myportfolio.com
   ```

2. In the `.env` file, set:
   ```
   CUSTOM_DOMAIN=true
   ```

### 4. Colors and Style Customization

The site uses Tailwind CSS v4. You can customize colors and styles in the `src/app.css` file.

**Customization example:**
```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100..700;1,100..700&display=swap');

@import 'tailwindcss';
@plugin '@tailwindcss/typography';

@theme {
  --default-font-family: 'IBM Plex Sans', 'sans-serif';
  
  /* Color customization */
  --color-primary-50: #f0f9ff;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;
  
  /* Spacing customization */
  --spacing-custom: 2.5rem;
}

/* Custom styles */
.my-custom-style {
  color: var(--color-primary-500);
  font-family: var(--default-font-family);
}
```

### 5. Metadata Configuration

Modify the `src/app.html` file to customize global metadata:

```html
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="Portfolio of [Your Name]" />
  <meta name="author" content="[Your Name]" />
  <title>Portfolio - [Your Name]</title>
  
  <!-- Add your own metadata -->
  <meta property="og:title" content="Portfolio - [Your Name]" />
  <meta property="og:description" content="Discover my creations..." />
  <meta property="og:image" content="/images/og-image.jpg" />
</head>
```

## Advanced Configuration

### 1. Custom Favicon

Replace the `static/favicon.png` file with your own favicon.

### 2. Custom Fonts

To use custom fonts:

1. Add your font files to `static/fonts/`
2. Modify the `src/app.css` file:

```css
@font-face {
  font-family: 'MyFont';
  src: url('/fonts/myfont.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}

@theme {
  --default-font-family: 'MyFont', sans-serif;
}
```

### 3. Google Analytics

To add Google Analytics:

1. Create a `src/lib/components/Analytics.svelte` file:

```svelte
<script>
  import { onMount } from 'svelte';
  
  onMount(() => {
    // Google Analytics code
    window.gtag = window.gtag || function() {
      (window.gtag.q = window.gtag.q || []).push(arguments);
    };
    
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  });
</script>

<svelte:head>
  <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
</svelte:head>
```

2. Import it in your main layout.

### 4. Display Mode Customization

The site offers different project display modes:
- **Grid**: Grid display
- **List**: List display
- **Map**: Map display (if GPS coordinates available)

You can customize these modes in the corresponding files:
- `src/routes/projects/+page.svelte` (grid)
- `src/routes/list/+page.svelte` (list)
- `src/routes/map/+page.svelte` (map)

### 5. Filters and Categories

Projects can be filtered by:
- **Type**: architecture, design, art, etc.
- **Location**: city, country
- **Year**: completion period
- **Status**: completed, in progress, concept

These filters are configured in each project's metadata (see next guide).

## Environment Variables

The `.env` file contains important variables:

```env
# Domain configuration
CUSTOM_DOMAIN=true

# Development mode
NODE_ENV=development

# Other configurations
VITE_APP_NAME=My Portfolio
```

## Backup and Versioning

Don't forget to save your modifications with Git:

```bash
git add .
git commit -m "Portfolio customization"
```

## Next Steps

- [Adding Projects Guide](03-adding-projects.md)
- [Publishing Guide](04-publishing.md)

## Tips

- Always test your modifications with `pnpm run dev`
- Keep your texts short and impactful
- Use high-quality images
- Check mobile compatibility
- Optimize SEO with relevant descriptions

## Theme Customization

### Color Schemes

You can create different color schemes by modifying CSS variables:

```css
/* Light theme */
@theme {
  --color-background: #ffffff;
  --color-text: #1a1a1a;
  --color-accent: #3b82f6;
}

/* Dark theme */
@media (prefers-color-scheme: dark) {
  @theme {
    --color-background: #1a1a1a;
    --color-text: #ffffff;
    --color-accent: #60a5fa;
  }
}
```

### Typography

Customize typography for different creative fields:

```css
/* For architects */
@theme {
  --default-font-family: 'Helvetica Neue', sans-serif;
  --heading-font-family: 'Futura', sans-serif;
}

/* For artists */
@theme {
  --default-font-family: 'Georgia', serif;
  --heading-font-family: 'Playfair Display', serif;
}
```

### Layout Customization

Adjust layouts for different creative needs:

```css
/* Portfolio grid customization */
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

/* For photographers - larger images */
.photo-grid {
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
}

/* For designers - compact layout */
.design-grid {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
```

This configuration guide provides all the tools you need to make Microfolio truly your own!