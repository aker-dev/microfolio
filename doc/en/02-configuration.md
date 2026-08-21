# Custom Configuration Guide

## Legal pages

`content/legal.md` and `content/privacy.md` ship as templates, and **you must
fill them in**. A site published in France has to carry a legal notice naming
its publisher and its host; publishing someone else's is worse than publishing
none.

The privacy template already describes what microfolio does — no cookies, no
analytics, one interface preference kept locally — so it stays true unless you
add analytics, embeds or forms. If you do, say so there.

Both are linked from the footer of every page.

## Basic Configuration

### 1. Modifying the config.js file

`src/lib/config.js` holds everything that is about **your** site, and nothing else — five blocks, from the general to the particular:

```javascript
export const siteConfig = {
	// --- Your site -------------------------------------------------------------
	title: 'microfolio', // header, and the start of every page title
	description: 'static portfolio generator', // under the title, and the default meta description
	author: 'AKER', // the copyright line in the footer
	url: 'https://aker-dev.github.io/microfolio', // where the site is published, without trailing slash
	locale: 'en', // interface language: 'en' or 'fr'

	// --- Navigation and links --------------------------------------------------
	navigation: [
		{ name: 'nav.home', href: '/' },
		{ name: 'nav.about', href: '/about' },
		{ name: 'nav.projects', href: '/projects' },
		{ name: 'nav.list', href: '/list' },
		{ name: 'nav.map', href: '/map' }
	],
	socialLinks: {
		github: 'https://github.com/aker-dev/microfolio',
		linkedin: 'https://www.linkedin.com/company/aker-network/',
		instagram: 'https://www.instagram.com/aker.pro/'
	},

	// --- Sharing and images ----------------------------------------------------
	ogImage: '/og.jpg',
	images: { optimizeOnBuild: true },

	// --- Typeface --------------------------------------------------------------
	font: {
		url: 'https://fonts.bunny.net/css?family=ibm-plex-sans:400,400i,600&display=swap',
		family: "'IBM Plex Sans', sans-serif"
	},

	// --- Lightbox --------------------------------------------------------------
	lightbox: { hideControlsDelay: 3000, showExtendedMetadata: true }
};
```

- **`title`, `description`, `author`** — your name, your tagline, your copyright line
- **`url`** — the single place the address is written: the base path and every absolute URL (sharing tags, canonical links, sitemap) derive from it. See [Custom domain configuration](#4-custom-domain-configuration)
- **`locale`** — `'en'` or `'fr'`; adding a language is described under [Internationalization](#7-internationalization-i18n)
- **`navigation`** — the menu, in order. `name` is a translation key from `src/lib/locales/` (`nav.home`, `nav.about`…), so the menu follows the locale; remove an entry to take a page out of the menu
- **`socialLinks`** — the footer shows an icon for each of `github`, `linkedin` and `instagram`; delete the ones you don't use
- **`font`** — the typeface: the stylesheet that loads it and the family name, see [Custom fonts](#2-custom-fonts)
- **`ogImage`, `images`, `lightbox`** — the sharing image, build-time image optimization and the lightbox's two settings, covered under [Advanced Configuration](#advanced-configuration)

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

### 3. About page

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

#### Images and videos in these pages

The home, about, legal and privacy pages can embed images. Put the files in
`content/images/` and reference them relative to `content/`:

```markdown
![A view of my studio](images/studio.jpg)
```

The address is resolved at build time, so it works in development and under a
sub-path (GitHub Pages) alike. External links in these pages open in a new tab
automatically. On large screens, images spread wider than the text column —
part of the editorial layout of these pages.

**Videos from YouTube or Vimeo**: paste the video's address on a line of its
own — nothing else on the line — and it becomes the player:

```markdown
https://www.youtube.com/watch?v=VIDEO_ID
```

`youtu.be/…`, Shorts and `vimeo.com/…` addresses work the same way. A written
link (`[see the film](…)`) or an address inside a sentence stays a plain link.
Need the platform's options (start time, playlist…)? The embed code from
"Share › Embed" can be pasted as-is instead.

The player scales to the column and keeps its 16:9 ratio. microfolio also
routes every embed through the platforms' no-cookie modes at build time —
`youtube.com/embed` becomes `youtube-nocookie.com/embed`, and Vimeo players
get `dnt=1` — so the "no cookies" promise of your site survives a pasted
snippet. Loading a player still sends the visitor's IP address to YouTube or
Vimeo, though: **add them to the third-party table in `content/privacy.md`**,
which says so itself. The same works in a project's body.

### 4. Custom domain configuration

If you have a custom domain name:

1. Set the address in `src/lib/config.js`:

   ```js
   url: 'https://myportfolio.com';
   ```

   This is the only place the address is written: the base path and every
   absolute URL — sharing tags, canonical links, the sitemap — come from it.

2. Declare the domain to GitHub Pages under Settings › Pages › Custom domain,
   then point a CNAME record at `your-username.github.io` with your registrar.

   There is no `CNAME` file to write: published through an Actions workflow, as
   microfolio is, GitHub ignores any `CNAME` in the build.

### 5. Color and style customization

The site uses Tailwind CSS v4. You can customize colors and styles in the `src/app.css` file.

**Customization example:**

```css
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

### 6. Dark mode

microfolio includes a dark mode toggle in the footer. The behavior follows a three-tier priority:

1. **System preference** — by default, the site respects `prefers-color-scheme: dark`
2. **Manual override** — users can click the toggle to force light or dark mode
3. **Persistence** — the chosen mode is saved in `localStorage` and restored on next visit

The dark mode colors are defined as CSS custom properties in `src/app.css`:

```css
@theme {
	/* Light theme colors (default) */
	--color-primary: black;
	--color-background: oklch(97% 0 0);
	--color-box: white;

	/* Dark theme colors */
	--color-primary-dark: white;
	--color-background-dark: oklch(20.5% 0 0);
	--color-box-dark: oklch(26.9% 0 0);
}

/* System preference: applies when no manual override (.light) is set */
@media (prefers-color-scheme: dark) {
	:root:not(.light) {
		--color-primary: var(--color-primary-dark);
		--color-background: var(--color-background-dark);
		--color-box: var(--color-box-dark);
		color-scheme: dark;
	}
}

/* User forced dark mode via toggle */
:root.dark {
	--color-primary: var(--color-primary-dark);
	--color-background: var(--color-background-dark);
	--color-box: var(--color-box-dark);
	color-scheme: dark;
}
```

To customize dark mode colors, edit the `--color-*-dark` variables in the `@theme` block.

### 7. Internationalization (i18n)

microfolio supports multiple languages via `svelte-i18n`. English and French are active by default.

**Changing the default locale:**

Edit the `locale` field in `src/lib/config.js`:

```javascript
export const siteConfig = {
	// ...
	locale: 'en' // Change to 'fr' for French
	// ...
};
```

**Translation files** are located in `src/lib/locales/`:

- `en.json` — English strings
- `fr.json` — French strings

**Adding a new language:**

1. Create a new JSON file in `src/lib/locales/` (e.g., `es.json`) using an existing file as template
2. Uncomment the corresponding import and `addMessages` line in `src/lib/i18n.js`:
   ```javascript
   import es from './locales/es.json';
   addMessages('es', es);
   ```
3. Set `locale: 'es'` in `src/lib/config.js`

**RTL support:** The layout automatically detects RTL locales (e.g., Arabic) and sets the `dir` attribute on the HTML element.

## Advanced Configuration

### 1. Custom favicon

Replace the `static/favicon.svg` file with your own favicon (SVG scales to every size from one file; a PNG works too if you update the `<link rel="icon">` in `src/app.html`).

### 1b. Sharing image (Open Graph)

When a page is shared on a social network or in a messaging app, the preview card uses an image:

- **Project pages already have theirs**: an `og.jpg` is generated from each project's thumbnail at build time — nothing to do
- **Every other page** (home, about, list, map…) falls back to the site-wide image declared in `src/lib/config.js`:

  ```js
  ogImage: '/og.jpg';
  ```

  Replace `static/og.jpg` with your own — **1200×630 pixels**, the format every network crops to. Set `ogImage: ''` to ship none.

### 1c. Lightbox

Two settings in the `lightbox` block of `src/lib/config.js`:

```js
lightbox: {
	hideControlsDelay: 3000,
	showExtendedMetadata: true
}
```

- **`hideControlsDelay`** — milliseconds before the arrows, the close button and the details toggle fade out while the visitor is idle; any mouse move, key press or touch brings them back. `0` keeps them on screen permanently.
- **`showExtendedMetadata`** — the details panel always shows an image's title, caption and credit (from its IPTC/EXIF fields, see [Preparing Your Images](03-preparing-images.md)). With `true` it also shows what else the file carries: **Technical Details** (camera, lens, exposure), **Location & Date** and **Keywords**. Set it to `false` to keep the panel to the editorial three — for a portfolio where the camera settings are nobody's business, or where the photos come from many hands.

### 2. Custom fonts

The typeface is set in the `font` block of `src/lib/config.js` — not in `src/app.html`, which an update of microfolio overwrites:

```js
font: {
	url: 'https://fonts.bunny.net/css?family=ibm-plex-sans:400,400i,600&display=swap',
	family: "'IBM Plex Sans', sans-serif"
}
```

- **Another family from Bunny Fonts** (the same catalogue as Google Fonts, served from the EU without tracking): pick it on [fonts.bunny.net](https://fonts.bunny.net), paste the address it gives you into `url`, and put the family name in `family` — as CSS expects it, with a fallback
- **A font you host yourself**: set `url: ''` so nothing is loaded from a third party, add the files to `static/fonts/` with a `@font-face` in `src/app.css`, and name the family in `family`:

  ```css
  @font-face {
  	font-family: 'MyFont';
  	src: url('/fonts/myfont.woff2') format('woff2');
  	font-weight: normal;
  	font-style: normal;
  }
  ```

- **The system font**: `url: ''` and `family: 'system-ui, sans-serif'`

Whoever serves the font files sees your visitors' IP addresses, and `content/privacy.md` names Bunny.net for that reason: if you change provider, or host the files yourself, update its table.

### 3. Display mode customization

The site offers different project display modes:

- **Grid**: Grid display
- **List**: List display
- **Map**: Map display (if GPS coordinates)

You can customize these modes in the corresponding files:

- `src/routes/projects/+page.svelte` (grid)
- `src/routes/list/+page.svelte` (list)
- `src/routes/map/+page.svelte` (map)

### 4. Going further: the Svelte templates

Everything above is configuration. When you want to change how things look or behave, the templates are yours too — microfolio is a SvelteKit project, and a small one:

| What you want to change                              | Where it lives                        |
| ---------------------------------------------------- | ------------------------------------- |
| A page's layout (home, projects, list, map, project) | `src/routes/**/+page.svelte`          |
| Header, footer, cards, filters, lightbox             | `src/lib/components/Ak*.svelte`       |
| Colours, dark theme, prose styling                   | `src/lib/theme.css` and `src/app.css` |
| Interface texts                                      | `src/lib/locales/en.json`, `fr.json`  |
| The menu, the lightbox, the sharing image            | `src/lib/config.js` (this guide)      |

`pnpm dev` reloads the page as you save. The stack is [SvelteKit 2](https://svelte.dev/docs/kit), [Svelte 5](https://svelte.dev/docs/svelte) and [Tailwind CSS 4](https://tailwindcss.com/docs); their documentation covers what the templates do. One piece of advice: keep your changes small and local — a colour here, a block there — so that `git merge` brings in future microfolio versions without a fight.

## Environment Variables

microfolio reads none of its own. The site's address lives in
`src/lib/config.js`, under `url`.

## Next steps

- [Project addition guide](04-adding-projects.md)
- [Publishing guide](05-publication.md)

## Tips

- Always test your changes with `pnpm dev`
- Keep your texts short and impactful
- Use high-quality images
- Check mobile compatibility
- Optimize SEO with relevant descriptions
