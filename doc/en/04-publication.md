# Build and Publication Guide

## Publication Preparation

### 1. Content Verification

Before publishing your portfolio, make sure that:

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

## Site Build

### 1. Local Build

Always test locally before publishing:

```bash
# With custom domain
CUSTOM_DOMAIN=true pnpm build

# Or simply (if defined in .env)
pnpm build
```

### 2. Build Verification

After the build, verify:

- `build/` folder created
- `build/index.html` file present
- `build/CNAME` file (if custom domain)
- `build/content/` folder with your projects

### 3. Site Preview

Preview the production site:

```bash
pnpm preview
```

Test all pages and features.

## GitHub Pages Publication

### 1. Repository Preparation

```bash
# Make sure you're on the main branch
git checkout main

# Add all your files
git add .
git commit -m "Preparation for publication"

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

**File `.github/workflows/deploy.yml`:**

## Manual Publication

### 1. Production Build

```bash
# Make sure everything is committed
git add .
git commit -m "Ready for publication"

# Build the site
pnpm build
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
   - Build command: `pnpm build`
   - Publish directory: `build`
   - Environment variables: `CUSTOM_DOMAIN=true`

3. **Custom domain:**
   - Add your domain in Netlify
   - Configure DNS at your registrar

### 2. Vercel

1. **Import your project from GitHub**
2. **Automatic configuration for SvelteKit**
3. **Environment variables:**
   - `CUSTOM_DOMAIN=true`

### 3. Traditional Hosting

For classic hosting:

1. **Build the site:**

   ```bash
   CUSTOM_DOMAIN=true pnpm build
   ```

2. **Upload content:**
   - Upload the contents of the `build/` folder
   - Configure the web server (Apache, Nginx)

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

GitHub Pages automatically enables HTTPS for custom domains. Wait a few minutes after DNS configuration.

### 3. Domain Verification

Verify your domain works:

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
pnpm dev

# Build and test
pnpm build
pnpm preview

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
pnpm dev
pnpm build

# Publish
git add .
git commit -m "Dependency updates"
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
- Generate a sitemap
- Add Open Graph tags
- Configure Google Analytics

## Troubleshooting

### Problem: Build fails

```bash
# Clean cache
pnpm clean
rm -rf node_modules package-lock.json
pnpm install

# Rebuild
pnpm build
```

### Problem: Missing images

- Check paths in markdown files
- Make sure images are in the repository
- Respect file name case

### Problem: Custom domain not working

- Check the `static/CNAME` file
- Configure DNS correctly
- Wait for DNS propagation (24-48h)
- Check GitHub Pages settings

## Useful Resources

- **GitHub Pages**: https://pages.github.com/
- **Netlify**: https://www.netlify.com/
- **Vercel**: https://vercel.com/
- **DNS Checker**: https://dnschecker.org/
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **Google Search Console**: https://search.google.com/search-console

---

Congratulations! Your Microfolio portfolio is now online and accessible to the world. Don't forget to keep it updated with your new projects and monitor its performance regularly.