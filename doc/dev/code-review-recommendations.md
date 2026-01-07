# Code Review Recommendations - microfolio

**Date:** 2026-01-06
**Reviewer:** Claude Code (code-reviewer agent)
**Version:** 0.6.0-beta.5

## Summary

The microfolio project demonstrates a solid architecture with modern technologies (SvelteKit 2, Svelte 5 runes, Tailwind CSS 4). However, several security vulnerabilities and optimization opportunities have been identified that should be addressed before production deployment.

---

## 🔴 Critical Issues (Security)

### 1. XSS Vulnerability - Unsanitized HTML Rendering

**Severity:** CRITICAL
**Files:**
- `src/routes/+page.svelte:27`
- `src/routes/about/+page.svelte:24`
- `src/routes/projects/[slug]/+page.svelte:141`

**Issue:**
Using `{@html}` to render markdown content directly without sanitization. The `marked` library converts markdown to HTML but doesn't sanitize against XSS attacks.

**Impact:**
Malicious markdown content could inject JavaScript that executes in users' browsers.

**Solution:**
```bash
pnpm add isomorphic-dompurify
```

```javascript
// In each +page.server.js file, sanitize HTML before returning:
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

const htmlContent = DOMPurify.sanitize(marked(markdownContent));
```

---

### 2. Path Traversal Vulnerability

**Severity:** CRITICAL
**File:** `src/routes/projects/[slug]/+page.server.js:19`

**Issue:**
The `slug` parameter from the URL is used directly to construct file paths without validation.

**Impact:**
Attackers could potentially access files outside the intended directory using paths like `../../etc/passwd`.

**Solution:**
```javascript
// Add validation before using slug
export async function load({ params }) {
    const { slug } = params;

    // Validate slug - only allow alphanumeric, hyphens, and underscores
    if (!/^[a-zA-Z0-9_-]+$/.test(slug)) {
        throw error(400, 'Invalid project identifier');
    }

    const projectPath = join(process.cwd(), 'content/projects', slug);
    // ... rest of the code
}
```

Apply similar validation to all server-side slug/path handling.

---

### 3. Missing Input Validation for Coordinates

**Severity:** HIGH
**File:** `src/routes/map/+page.svelte:150-157`

**Issue:**
Project coordinates are used directly from frontmatter without validation. Invalid coordinates could break the map or cause errors.

**Impact:**
Application errors, potential denial of service if malformed data crashes the map.

**Solution:**
```javascript
// In map page or utility function
function validateCoordinates(coords) {
    if (!Array.isArray(coords) || coords.length !== 2) return false;
    const [lat, lng] = coords;
    return typeof lat === 'number' && typeof lng === 'number' &&
           lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

// Use in map rendering
if (project.coordinates && validateCoordinates(project.coordinates)) {
    // Create marker
}
```

---

## 🟠 Important Improvements

### 4. Inefficient File System Operations

**Severity:** MEDIUM
**File:** `src/lib/utils/projects.js:32-34`

**Issue:**
Using synchronous `existsSync` in an async function unnecessarily blocks the event loop.

**Impact:**
Performance degradation during build time.

**Solution:**
```javascript
// Replace existsSync with async version
import { access } from 'fs/promises';

async function fileExists(path) {
    try {
        await access(path);
        return true;
    } catch {
        return false;
    }
}

// Use in loadProjects:
const hasWebP = await fileExists(webpPath);
```

---

### 5. Duplicate Environment Configuration Code

**Severity:** MEDIUM
**Files:**
- `src/lib/utils/projects.js:7-12`
- `src/routes/+page.server.js:8-14`
- `src/routes/projects/[slug]/+page.server.js:10-15`

**Issue:**
basePath calculation is duplicated across multiple files, violating DRY principles.

**Impact:**
Maintenance burden, potential for inconsistencies.

**Solution:**
```javascript
// Create /src/lib/utils/paths.js
export function getBasePath() {
    return process.env.CUSTOM_DOMAIN === 'true'
        ? ''
        : process.env.NODE_ENV === 'production'
            ? '/microfolio'
            : '';
}

// Use in all files:
import { getBasePath } from '$lib/utils/paths.js';
const basePath = getBasePath();
```

---

### 6. Inconsistent Async Import Pattern

**Severity:** MEDIUM
**File:** `src/routes/map/+page.svelte:75,141`

**Issue:**
Leaflet is imported twice using dynamic imports in the same component.

**Impact:**
Unnecessary duplicate module loading, potential race conditions.

**Solution:**
```javascript
// Store Leaflet reference at component level
let L;

onMount(async () => {
    L = await import('leaflet');
    // ... setup code
});

// Reuse L in updateMarkers instead of re-importing
async function updateMarkers() {
    if (!map || !L) return;
    // Use existing L reference
}
```

---

### 7. Missing Error Boundaries

**Severity:** MEDIUM
**Location:** Throughout the application

**Issue:**
No global error handling or error boundaries to catch component errors gracefully.

**Impact:**
Application crashes could result in blank pages for users.

**Solution:**
```svelte
<!-- Create /src/routes/+error.svelte with better error handling -->
<script>
    import { page } from '$app/stores';
    import { dev } from '$app/environment';
</script>

<div class="error-container min-h-screen flex items-center justify-center p-8">
    <div class="text-center">
        <h1 class="text-4xl font-bold mb-4">Error {$page.status}</h1>
        <p class="text-xl mb-8">{$page.error.message}</p>
        {#if dev}
            <pre class="text-left bg-gray-100 p-4 rounded overflow-auto">{$page.error.stack}</pre>
        {/if}
        <a href="/" class="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
            Go Home
        </a>
    </div>
</div>
```

---

### 8. Unsafe UTF-8 Decoding in EXIF Handler

**Severity:** MEDIUM
**File:** `src/lib/utils/imageMetadata.js:64-69`

**Issue:**
Using deprecated `escape()` and `decodeURIComponent()` for UTF-8 conversion is unsafe and unreliable.

**Impact:**
Potential data corruption, security issues with malformed input.

**Solution:**
```javascript
// Remove the unsafe decoding attempt
const getTagValue = (tagPath) => {
    // ... existing code ...
    if (current && typeof current === 'object' && current.description !== undefined) {
        const value = current.description;
        // ExifReader should already handle UTF-8 properly
        return value;
    }
    // ... rest of code
};
```

---

### 9. Console Logging in Production

**Severity:** LOW
**Files:**
- `src/routes/map/+page.svelte:147,151,159,197,204`
- `src/routes/+layout.svelte:22`
- `src/lib/components/AkHeader.svelte:45`

**Issue:**
Debug console.log statements left in production code.

**Impact:**
Performance overhead, information disclosure.

**Solution:**
```javascript
// Remove or wrap in development checks
if (import.meta.env.DEV) {
    console.log('Debug info:', data);
}
```

---

## 🟡 Suggestions (Minor Improvements)

### 10. Missing Alt Text Fallback

**Severity:** LOW
**File:** `src/lib/components/AkOptimizedImage.svelte`

**Issue:**
No fallback if alt text is empty, which affects accessibility.

**Solution:**
```svelte
<script>
    let { src, alt = '', class: className = '', hasWebP = false } = $props();
    const effectiveAlt = alt || 'Image';
</script>

<img {src} alt={effectiveAlt} class={className} />
```

---

### 11. Hardcoded Magic Numbers

**Severity:** LOW
**File:** `src/routes/map/+page.svelte:30`

**Issue:**
Map height calculation uses hardcoded values (600).

**Solution:**
```javascript
// Define constants at the top of the file
const MAP_HEIGHT_MIN = 600;
const MAP_HEIGHT_MAX = 600;
const MAP_HEIGHT_VIEWPORT_RATIO = 0.5;

const height = Math.max(
    MAP_HEIGHT_MIN,
    Math.min(MAP_HEIGHT_MAX, windowHeight * MAP_HEIGHT_VIEWPORT_RATIO)
);
```

---

### 12. Outdated Dependencies

**Severity:** LOW

**Issue:**
Multiple packages have newer versions available:
- `marked` (16.4.2 → 17.0.1) - Major version update
- `globals` (16.5.0 → 17.0.0) - Major version update
- `@eslint/compat` (1.4.1 → 2.0.0) - Major version update
- Various minor updates

**Solution:**
```bash
# Update dependencies carefully, testing after each major version
pnpm update @sveltejs/kit @sveltejs/vite-plugin-svelte svelte

# Test major version updates separately
pnpm update marked@latest

# Run tests to ensure no breaking changes
pnpm run lint
pnpm run build
```

---

### 13. Missing TypeScript

**Severity:** LOW

**Issue:**
Project uses JSDoc comments but no TypeScript, missing type safety benefits.

**Recommendation:**
Consider migrating to TypeScript for better type safety, especially in utility functions and data transformations. This would catch many errors at compile time and improve developer experience.

---

### 14. Accessibility Issues

**Severity:** LOW
**File:** `src/routes/projects/[slug]/+page.svelte:279`

**Issue:**
Empty `<track>` element for video captions.

**Solution:**
```svelte
<!-- Either remove if not using captions, or add proper captions -->
<video controls class="w-full" preload="metadata">
    <source src={video.path} type="video/mp4" />
    <!-- Only include track if caption file exists -->
    {$_('ui.video_not_supported')}
</video>
```

---

### 15. Image Loading Performance

**Severity:** LOW
**File:** `src/lib/components/AkOptimizedImage.svelte`

**Issue:**
Missing `loading="lazy"` attribute for images.

**Solution:**
```svelte
{#if hasWebP}
    <picture class={className}>
        <source srcset={webpSrc} type="image/webp" />
        <img {src} {alt} class={className} loading="lazy" />
    </picture>
{:else}
    <img {src} {alt} class={className} loading="lazy" />
{/if}
```

---

### 16. CSS Font Loading

**Severity:** LOW
**File:** `src/app.css:1`

**Issue:**
Fonts loaded from bunny.net without preconnect, causing potential loading delays.

**Solution:**
```html
<!-- In src/app.html -->
<link rel="preconnect" href="https://fonts.bunny.net" />
<link rel="dns-prefetch" href="https://fonts.bunny.net" />
```

---

### 17. Vite Server Configuration

**Severity:** LOW
**File:** `vite.config.js:40-42`

**Issue:**
`fs.allow: ['..']` is overly permissive and could allow access to files outside the project.

**Solution:**
```javascript
import { searchForWorkspaceRoot } from 'vite';

export default defineConfig({
    server: {
        fs: {
            allow: [
                // Only allow specific directories
                searchForWorkspaceRoot(process.cwd()),
                join(process.cwd(), 'content')
            ]
        }
    }
});
```

---

### 18. Build Script Error Handling

**Severity:** LOW
**File:** `build.js:17-24`

**Issue:**
Limited error information when build fails.

**Solution:**
```javascript
vite.on('close', (code) => {
    if (code === 0) {
        console.log('✅ Build completed successfully!');
        console.log('💡 Tip: Run `pnpm run optimize-images` before build to generate optimized thumbnails');
    } else {
        console.error('❌ Build failed with code:', code);
        console.error('Please check the error messages above for details.');
    }
    process.exit(code);
});

vite.on('error', (error) => {
    console.error('❌ Build error:', error);
    process.exit(1);
});
```

---

### 19. Missing CSP Headers

**Severity:** LOW

**Issue:**
No Content Security Policy configured for the static site.

**Recommendation:**
Add CSP headers via deployment platform (GitHub Pages, Netlify, etc.) or meta tags:

```html
<!-- In src/app.html -->
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.bunny.net; font-src 'self' https://fonts.bunny.net; img-src 'self' data: https:; connect-src 'self';">
```

---

### 20. Git Ignore Patterns

**Severity:** LOW
**File:** `.gitignore`

**Issue:**
Ignores all projects except example, which means users can't commit their own projects easily.

**Recommendation:**
Document this pattern clearly in README or provide a better default for users who want to version control their content.

---

## ✅ Strengths

The project demonstrates several best practices:

- Modern tech stack: SvelteKit 2, Svelte 5 with runes, Tailwind CSS 4
- Clean component architecture with consistent naming (AK prefix)
- File-based routing and server-side data loading
- Proper static site generation setup
- Internationalization support with svelte-i18n
- Image optimization with WebP support
- EXIF metadata extraction for images
- Good separation of concerns (components, utilities, routes)
- Consistent error handling with try-catch blocks

---

## 📋 Implementation Priority

### Phase 1: Critical Security Fixes (Do Immediately)

1. **XSS vulnerability** - Add DOMPurify sanitization
2. **Path traversal** - Validate slugs and file paths
3. **Coordinate validation** - Validate map coordinates

**Estimated effort:** 2-4 hours

---

### Phase 2: Important Improvements (Do Soon)

4. **Async file operations** - Replace synchronous calls
5. **Deduplicate basePath** - Create centralized utility
6. **Fix Leaflet import** - Store reference at component level
7. **Error boundaries** - Add +error.svelte
8. **Remove unsafe UTF-8** - Trust ExifReader
9. **Remove console.log** - Clean up production code

**Estimated effort:** 4-6 hours

---

### Phase 3: Quality & Performance (When Time Permits)

10-20. Minor improvements for accessibility, performance, and code quality

**Estimated effort:** 8-12 hours

---

## Testing Checklist

After implementing fixes, verify:

- [ ] HTML content is sanitized (try injecting `<script>alert('XSS')</script>` in markdown)
- [ ] Invalid slugs are rejected (try `../../../etc/passwd` as project slug)
- [ ] Invalid coordinates don't crash the map
- [ ] Build completes without errors
- [ ] All pages render correctly
- [ ] Images load with proper lazy loading
- [ ] Error pages display properly
- [ ] No console errors in production build
- [ ] Accessibility audit passes (Lighthouse/axe)
- [ ] Performance metrics are acceptable (Lighthouse)

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [SvelteKit Security](https://kit.svelte.dev/docs/security)
- [DOMPurify](https://github.com/cure53/DOMPurify)
- [Web.dev Performance](https://web.dev/performance/)

---

**Next Review:** After implementing Phase 1 and Phase 2 recommendations
