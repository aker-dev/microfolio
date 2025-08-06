# Custom Configuration Guide

## Basic Configuration

### 1. Modifying the config.js file

The `src/lib/config.js` file contains the main settings for your portfolio. Here's how to customize it:

```javascript
// Site configuration
export const config = {
	// General information
	siteName: 'My Portfolio',
	siteDescription: 'Portfolio of [Your Name] - [Your profession]',
	author: 'Your Name',

	// Navigation
	navigation: [
		{ name: 'Home', href: '/' },
		{ name: 'Projects', href: '/projects' },
		{ name: 'List', href: '/list' },
		{ name: 'Map', href: '/map' },
		{ name: 'About', href: '/about' }
	],

	// Social links
	social: {
		email: 'your@email.com',
		linkedin: 'https://linkedin.com/in/your-profile',
		instagram: 'https://instagram.com/your-account',
		github: 'https://github.com/your-account'
	}
};
```

**Customize the following sections:**

- **siteName**: The name of your portfolio
- **siteDescription**: Description for SEO
- **author**: Your full name
- **navigation**: Adjust or remove navigation links
- **social**: Your social media profiles

### 2. Personal information

Edit the `content/index.md` file to customize your home page:

```markdown
---
title: 'Welcome to my portfolio'
description: 'Portfolio of [Your Name] - [Your profession/specialty]'
---

## Who am I?

Introduce yourself here. Talk about your journey, your passions, your creative approach.

## My work

Describe your style, your areas of expertise, what inspires you.
```

### 2. About page

Modify the `content/about.md` file:

```markdown
---
title: 'About'
description: 'Discover my journey and creative philosophy'
---

## My journey

Tell your story, your education, your important experiences.

## My philosophy

Explain your approach to design/art, your values, what motivates you.

## My skills

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

### 3. Custom domain configuration

If you have a custom domain name:

1. Modify the `static/CNAME` file and replace the content with your domain:

   ```
   myportfolio.com
   ```

2. In the `.env` file, define:
   ```
   CUSTOM_DOMAIN=true
   ```

### 4. Color and style customization

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
```

## Advanced Configuration

### 1. Custom favicon

Replace the `static/favicon.png` file with your own favicon.

### 2. Custom fonts

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
	--default-font-family: 'MyFont', 'sans-serif';
}
```

### 3. Display mode customization

The site offers different project display modes:

- **Grid**: Grid display
- **List**: List display
- **Map**: Map display (if GPS coordinates)

You can customize these modes in the corresponding files:

- `src/routes/projects/+page.svelte` (grid)
- `src/routes/list/+page.svelte` (list)
- `src/routes/map/+page.svelte` (map)

## Environment Variables

The `.env` file contains important variables:

```env
# Domain configuration
CUSTOM_DOMAIN=true
```

## Next steps

- [Project addition guide](03-adding-projects.md)
- [Publishing guide](04-publishing.md)

## Tips

- Always test your changes with `pnpm dev`
- Keep your texts short and impactful
- Use high-quality images
- Check mobile compatibility
- Optimize SEO with relevant descriptions