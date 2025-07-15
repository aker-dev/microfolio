# Build and Publishing Guide

## Preparing for Publication

### 1. Content Verification

Before publishing your portfolio, make sure you have:

**Required content:**
- [ ] Customized homepage (`content/index.md`)
- [ ] Completed about page (`content/about.md`)
- [ ] At least 3-5 projects with images
- [ ] All thumbnail images present
- [ ] Contact information

**Technical verification:**
- [ ] Functional links
- [ ] Optimized images
- [ ] Complete metadata
- [ ] No errors in terminal

### 2. Domain Configuration

#### Option A: Custom Domain

If you have your own domain:

1. **Configure the CNAME file**
   ```bash
   echo "your-domain.com" > static/CNAME
   ```

2. **Set the environment variable**
   ```bash
   # In the .env file
   CUSTOM_DOMAIN=true
   ```

3. **Configure your DNS**
   - At your registrar, create a CNAME record
   - Point your domain to `your-username.github.io`

#### Option B: GitHub Pages Domain

If you're using GitHub Pages without a custom domain:

1. **Configure the .env file**
   ```bash
   # In the .env file
   CUSTOM_DOMAIN=false
   ```

2. **The site will be accessible at:**
   ```
   https://your-username.github.io/microfolio
   ```

## Building the Site

### 1. Local Build

Always test locally before publishing:

```bash
# With custom domain
CUSTOM_DOMAIN=true pnpm run build

# Or simply (if defined in .env)
pnpm run build
```

### 2. Build Verification

After building, check:
- `build/` folder created
- `build/index.html` file present
- `build/CNAME` file (if custom domain)
- `build/content/` folder with your projects

### 3. Site Preview

Preview the production site:

```bash
pnpm run preview
```

Test all pages and functionalities.

## Publishing on GitHub Pages

### 1. Repository Preparation

```bash
# Make sure you're on the main branch
git checkout main

# Add all your files
git add .
git commit -m "Prepare for publication"

# Push to GitHub
git push origin main
```

### 2. GitHub Pages Configuration

1. **Access your GitHub repository**
2. **Go to Settings > Pages**
3. **Configure the source:**
   - Source: "Deploy from a branch"
   - Branch: "main"
   - Folder: "/ (root)"

### 3. GitHub Actions (automatic)

The repository uses GitHub Actions for automatic deployment. With each push to `main`, the site will be rebuilt and redeployed.

**`.github/workflows/deploy.yml` file:**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install -g pnpm
      - run: pnpm install
      - run: CUSTOM_DOMAIN=true pnpm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

## Manual Publishing

### 1. Production Build

```bash
# Make sure everything is committed
git add .
git commit -m "Ready for publication"

# Build the site
pnpm run build
```

### 2. Manual Deployment

If you prefer to deploy manually:

```bash
# Install gh-pages
npm install -g gh-pages

# Deploy
gh-pages -d build
```

## Other Hosting Options

### 1. Netlify

1. **Connect your GitHub repository to Netlify**
2. **Configure the build:**
   - Build command: `pnpm run build`
   - Publish directory: `build`
   - Environment variables: `CUSTOM_DOMAIN=true`

3. **Custom domain:**
   - Add your domain in Netlify
   - Configure DNS at your registrar

### 2. Vercel

1. **Import your project from GitHub**
2. **Automatic SvelteKit configuration**
3. **Environment variables:**
   - `CUSTOM_DOMAIN=true`

### 3. Traditional Hosting

For classic hosting:

1. **Build the site:**
   ```bash
   CUSTOM_DOMAIN=true pnpm run build
   ```

2. **Upload content:**
   - Upload the `build/` folder content
   - Configure web server (Apache, Nginx)

## Custom Domains

### 1. DNS Configuration

**For a main domain (example.com):**
```
Type: A
Host: @
Value: 185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153
```

**For a subdomain (portfolio.example.com):**
```
Type: CNAME
Host: portfolio
Value: your-username.github.io
```

### 2. HTTPS Configuration

GitHub Pages automatically activates HTTPS for custom domains. Wait a few minutes after DNS configuration.

### 3. Domain Verification

Check that your domain works:
- `https://your-domain.com`
- HTTP → HTTPS redirect
- Valid SSL certificate

## Maintenance and Updates

### 1. Adding New Projects

```bash
# Add your new project
# Commit the changes
git add .
git commit -m "New project: [project name]"
git push origin main

# The site will be automatically rebuilt
```

### 2. Design Modifications

```bash
# Modify necessary files
# Test locally
pnpm run dev

# Build and test
pnpm run build
pnpm run preview

# Publish
git add .
git commit -m "Design update"
git push origin main
```

### 3. Dependency Updates

```bash
# Check for updates
pnpm outdated

# Update
pnpm update

# Test
pnpm run dev
pnpm run build

# Publish
git add .
git commit -m "Dependencies update"
git push origin main
```

## Production Optimization

### 1. Images

```bash
# Optimize all images
find content/ -name "*.jpg" -exec jpegoptim --max=85 {} \;
find content/ -name "*.png" -exec optipng -o5 {} \;
```

### 2. Performance

- Compress images
- Use modern formats (WebP)
- Minimize videos
- Optimize PDFs

### 3. SEO

- Check metadata
- Generate sitemap
- Add Open Graph tags
- Configure Google Analytics

## Monitoring and Analytics

### 1. Google Analytics

Add tracking in `src/app.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Monitoring

- Use Google Search Console
- Monitor 404 errors
- Check loading speed
- Test accessibility

## Troubleshooting

### Problem: Build fails

```bash
# Clean cache
pnpm run clean
rm -rf node_modules package-lock.json
pnpm install

# Rebuild
pnpm run build
```

### Problem: Missing images

- Check paths in markdown files
- Make sure images are in the repository
- Respect file name case

### Problem: Custom domain not working

- Check `static/CNAME` file
- Configure DNS correctly
- Wait for DNS propagation (24-48h)
- Check GitHub Pages settings

### Problem: Slow site

- Optimize images
- Reduce video sizes
- Use a CDN
- Enable gzip compression

## Security

### 1. Best Practices

- Never commit API keys
- Use environment variables
- Update dependencies regularly
- Monitor vulnerabilities

### 2. Backup

```bash
# Regular backups
git add .
git commit -m "Backup $(date)"
git push origin main

# Create tags for important versions
git tag -a v1.0 -m "Version 1.0"
git push origin v1.0
```

## Performance Optimization

### 1. Image Optimization

```bash
# Batch optimize images
for file in content/projects/*/images/*.jpg; do
  jpegoptim --max=85 "$file"
done

for file in content/projects/*/images/*.png; do
  optipng -o5 "$file"
done
```

### 2. Code Splitting

Microfolio automatically handles code splitting, but you can optimize further:

```javascript
// In your component
import { onMount } from 'svelte';

onMount(async () => {
  // Lazy load heavy components
  const { default: HeavyComponent } = await import('./HeavyComponent.svelte');
  // Use component
});
```

### 3. Content Delivery Network (CDN)

For faster global loading:

1. **Use Cloudflare** (free tier available)
2. **Configure caching rules**
3. **Enable compression**

## Advanced Features

### 1. Progressive Web App (PWA)

Add PWA capabilities:

```javascript
// src/app.html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#000000">
```

### 2. Multi-language Support

For international portfolios:

```markdown
---
title: "Project Title"
title_fr: "Titre du Projet"
title_en: "Project Title"
description: "Description"
description_fr: "Description en français"
description_en: "Description in English"
---
```

### 3. Contact Forms

Add contact functionality:

```svelte
<!-- src/lib/components/ContactForm.svelte -->
<form action="https://formspree.io/f/your-form-id" method="POST">
  <input type="email" name="email" required>
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>
```

## Useful Resources

- **GitHub Pages**: https://pages.github.com/
- **Netlify**: https://www.netlify.com/
- **Vercel**: https://vercel.com/
- **DNS Checker**: https://dnschecker.org/
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **Google Search Console**: https://search.google.com/search-console

## Support

If you encounter problems:

1. Check GitHub Actions logs
2. Review repository issues
3. Test locally with `pnpm run dev`
4. Contact your hosting provider's support

## Success Metrics

Track your portfolio's success:

- **Traffic**: Monthly visitors
- **Engagement**: Time on site, pages per session
- **Conversions**: Contact form submissions
- **SEO**: Search ranking for your name/specialty
- **Performance**: Page load speed

---

Congratulations! Your Microfolio portfolio is now online and accessible to the world. Don't forget to keep it updated with your new projects and monitor its performance regularly.

Your creative work deserves to be seen - now it can be!