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

1. **Set the address in your config**

   ```js
   // src/lib/config.js
   url: 'https://your-domain.com';
   ```

   This is the only place the address is written. The base path and every
   absolute URL — sharing tags, canonical links, the sitemap — come from it.

2. **Tell GitHub Pages**
   - In the repository, go to Settings › Pages › Custom domain
   - Enter your domain and save

   There is no `CNAME` file to write. Published through an Actions workflow, as
   microfolio is, GitHub ignores any `CNAME` in the build.

3. **Configure your DNS**
   - At your registrar, create a CNAME record
   - Point your domain to `your-username.github.io`

#### Option B: GitHub Pages Domain

If you're using GitHub Pages without a custom domain:

1. **The site will be accessible at:**
   ```
   https://your-username.github.io/microfolio
   ```

## Site Build

### 1. Local Build

Always test locally before publishing:

```bash
pnpm build
```

### 2. Build Verification

After the build, verify:

- `build/` folder created
- `build/index.html` file present
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
   - Source: "GitHub Actions"

### 3. GitHub Actions (automatic)

The repository ships a workflow, `.github/workflows/deploy.yml`, that builds the site, checks it (lint, tests, a smoke pass over the built files) and publishes it to GitHub Pages. **It runs on every push to `main`** — so publishing is just:

```bash
git push origin main
```

A few minutes later the site is live. You can also trigger a deployment by hand from the repository's **Actions** tab ("Deploy to GitHub Pages › Run workflow"). If you would rather work on another branch and publish deliberately, merge it into `main` when you are ready — or change the `branches` line at the top of the workflow.

### 4. Two branches: `dev` to work, `main` to publish

Since every push to `main` goes live, keep a second branch for work in progress:

```bash
git switch -c dev          # once: create the working branch
# …edit, add projects, check with pnpm dev…
git add . && git commit -m "New project: …"

git switch main            # publish: bring dev into main and push
git merge dev
git push origin main
git switch dev             # back to work
```

`main` only ever receives what you have already seen working locally — and a half-finished project waiting on `dev` never reaches the published site by accident.

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

If you prefer to deploy the `build/` folder yourself:

```bash
# Deploy to a gh-pages branch (no global install needed)
npx gh-pages -d build
```

## Shared hosting (O2Switch, OVH, Gandi…): build locally, upload by FTP

A microfolio site is plain files: any web hosting that serves HTML can host it, and nothing needs to be installed on the server — no Node.js, no database.

1. **Set the final address** in `src/lib/config.js`, because the build bakes it into every absolute URL:

   ```js
   url: 'https://www.my-portfolio.com'; // at the root of a domain
   url: 'https://www.my-site.com/portfolio'; // or in a sub-folder
   ```

2. **Build for production** with `pnpm deploy`, not `pnpm build`: it is the one that sets `NODE_ENV=production` and therefore honours a sub-folder in `url` (at the root of a domain both give the same result, but make it a habit):

   ```bash
   pnpm deploy
   ```

   On Windows PowerShell, where that `NODE_ENV=` prefix is not understood: `$env:NODE_ENV='production'; pnpm build`. The site is in `build/`.

3. **Upload the _contents_ of `build/`** (not the folder itself) to your hosting's web root — called `www/`, `public_html/` or `htdocs/` depending on the host, or the sub-folder you chose. A free FTP client such as [FileZilla](https://filezilla-project.org) does the job: create a connection with the host, login and password shown in your hosting panel (pick SFTP when your host offers it), open `build/` on the left, the web root on the right, select everything on the left and drag it across.

4. **Check the site** at your address — every page, the map, one project and its lightbox.

**Updating the site** is the same steps again: `pnpm deploy`, then upload. Empty the web root before uploading (or let FileZilla overwrite, then delete what is no longer in `build/`): the generated file names change between builds, and old ones would linger.

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

### 3. Updating microfolio

A new release of microfolio is a new version of the engine; your projects, your `config.js`, your favicon and your sharing image are yours and stay put. From the folder of your site, with everything committed:

```bash
pnpm update-microfolio            # to the latest release
pnpm update-microfolio --dry-run  # only say what would change
```

The script downloads the release you run and the one you are moving to, and decides file by file: what you never touched takes the new version, what you edited and microfolio left alone stays as it is, and when both sides changed the same file it tries to combine the two — failing that, your version stays and the new one is written next to it as `<file>.upstream`, for you to look at. `content/`, `src/lib/config.js`, `static/favicon.svg` and `static/og.jpg` are never touched; when `config.js` gained settings upstream, the difference is printed so you can copy what you want. Then:

```bash
pnpm install
pnpm dev                                    # look at the site
git add -A && git commit -m "Update microfolio to 1.1.0"
git push origin main                        # publishes, if GitHub Pages deploys main
```

If you do not like the result, `git checkout . && git clean -fd` right after the update puts everything back — which is why the script asks for a clean working tree before it starts.

**A site older than the script** (from before 1.0) has no `pnpm update-microfolio` yet. Fetch the script once and run it; it is part of the site from then on:

```bash
curl -fsSL https://raw.githubusercontent.com/aker-dev/microfolio/main/scripts/update-microfolio.js -o update-microfolio.js
node update-microfolio.js
rm update-microfolio.js
```

**By hand**, if you would rather see every step: download the release you want from [the releases page](https://github.com/aker-dev/microfolio/releases) and unpack it next to your site, then copy everything from it into your site's folder **except** `content/`, `src/lib/config.js`, `static/favicon.svg` and `static/og.jpg`. Bring back any change you had made to the templates or to `src/app.css` by comparing with your git history, run `pnpm install`, check with `pnpm dev`, and commit. This also works on a site that was never a git repository.

**With git alone**, if you cloned the repository rather than used `microfolio new`: your history is shared with microfolio's, so `git remote add upstream https://github.com/aker-dev/microfolio.git`, `git fetch upstream --tags` and `git merge v1.1.0` bring the release in. Expect conflicts on the files you rewrote — the home and about pages, `config.js` — and on the example project if you deleted it; resolve each by keeping yours.

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

- Check `url` in `src/lib/config.js`
- Check the domain in Settings › Pages
- Configure DNS correctly
- Wait for DNS propagation (24-48h)
- Check GitHub Pages settings

## Useful Resources

- **GitHub Pages**: https://pages.github.com/
- **DNS Checker**: https://dnschecker.org/
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **Google Search Console**: https://search.google.com/search-console

---

Congratulations! Your Microfolio portfolio is now online and accessible to the world. Don't forget to keep it updated with your new projects and monitor its performance regularly.
