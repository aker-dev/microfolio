# Microfolio Installation Guide

## About

Microfolio is a modern portfolio system that allows you to showcase your creative projects elegantly and professionally. This guide will walk you through the step-by-step process of installing and configuring your own portfolio website.

## Prerequisites

### 1. Node.js Installation

Node.js is required to run Microfolio.

**On Windows:**
1. Visit [nodejs.org](https://nodejs.org)
2. Download the recommended LTS (Long Term Support) version
3. Run the downloaded .exe file
4. Follow the installation instructions (leave default options)

**On macOS:**
1. Visit [nodejs.org](https://nodejs.org)
2. Download the LTS version for macOS
3. Open the .pkg file and follow the instructions
4. Or use Homebrew: `brew install node`

**On Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verification:**
Open a terminal/command prompt and type:
```bash
node --version
npm --version
```
You should see version numbers displayed.

### 2. Git Installation

Git is required to download and manage the source code.

**On Windows:**
1. Visit [git-scm.com](https://git-scm.com)
2. Download Git for Windows
3. Install with default options

**On macOS:**
1. Open Terminal
2. Type `git --version`
3. If Git is not installed, macOS will offer to install it
4. Or use Homebrew: `brew install git`

**On Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install git
```

**Verification:**
```bash
git --version
```

### 3. pnpm Installation

pnpm is a faster and more efficient package manager than npm.

**Installation (all platforms):**
```bash
npm install -g pnpm
```

**Verification:**
```bash
pnpm --version
```

## Microfolio Installation

### 1. Download the Code

Open a terminal in the folder where you want to install Microfolio and run:

```bash
git clone https://github.com/your-username/microfolio.git
cd microfolio
```

### 2. Install Dependencies

```bash
pnpm install
```

This command will download all the libraries necessary for Microfolio to function.

### 3. Initial Configuration

Copy the example configuration file:

```bash
cp .env.example .env
```

### 4. First Launch

Start the development server:

```bash
pnpm run dev
```

Open your browser and go to `http://localhost:5173`

You should see your portfolio website with example projects!

## Troubleshooting

### Problem: "command not found"
If you get "command not found" errors, check that:
- Node.js is properly installed
- You have restarted your terminal after installation
- Environment variables are correctly configured

### Problem: Permission errors
On macOS/Linux, if you get permission errors:
```bash
sudo chown -R $(whoami) ~/.npm
```

### Problem: Port already in use
If port 5173 is already in use, pnpm will automatically use another port. Check the messages in the terminal to see the correct URL.

## Next Steps

Now that Microfolio is installed, check out:
- [Configuration Guide](02-configuration.md) to customize your site
- [Adding Projects Guide](03-adding-projects.md) to add your own creations
- [Publishing Guide](04-publishing.md) to put your site online

## Help

If you encounter problems, don't hesitate to:
- Consult the official documentation
- Ask questions on the support forum
- Check the project's GitHub issues

## Getting Started

Once installed, you can:
- Edit `content/index.md` to customize your homepage
- Edit `content/about.md` to add your biography
- Add your projects in `content/projects/`
- Customize colors and styles in `src/app.css`
- Configure your domain in `static/CNAME`

Your creative portfolio is ready to showcase your work to the world!